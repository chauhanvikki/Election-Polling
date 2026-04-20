from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import pickle
import numpy as np
import pandas as pd
import os
import json
import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = "mongodb+srv://singhvikki870_db_user:5PQ0L9doOAjyRnfX@cluster0.aqkonu7.mongodb.net/"
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client['political_matrix_db']

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'pow_model.pkl')
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'mock_data.json')

# Load ML Model
try:
    with open(MODEL_PATH, 'rb') as f:
        ml_model = pickle.load(f)
except Exception as e:
    print(f"Warning: Could not load ML model: {e}")
    ml_model = None

def load_data():
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

# ──────────────────────────────────────────────
# Existing endpoints
# ──────────────────────────────────────────────

@app.route('/api/factors', methods=['GET'])
def api_get_factors():
    try:
        data = load_data()
        return jsonify({"status": "success", "data": data['factors']}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/pow', methods=['GET'])
def api_get_pow():
    try:
        data = load_data()
        results = data['candidates']
        return jsonify({"status": "success", "data": results}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ──────────────────────────────────────────────
# NEW: Constituency endpoint (from MongoDB)
# ──────────────────────────────────────────────

@app.route('/api/constituency', methods=['GET'])
def api_get_constituency():
    try:
        constituency = db.Constituencies.find_one({}, {"_id": 0, "created_at": 0})
        if not constituency:
            return jsonify({"status": "error", "message": "No constituency found"}), 404
        return jsonify({"status": "success", "data": constituency}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ──────────────────────────────────────────────
# NEW: Historical results endpoint (from MongoDB)
# ──────────────────────────────────────────────

@app.route('/api/historical', methods=['GET'])
def api_get_historical():
    try:
        results = list(db.HistoricalResults.find({}, {"_id": 0, "constituency_id": 0, "created_at": 0}).sort("year", 1))
        return jsonify({"status": "success", "data": results}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ──────────────────────────────────────────────
# NEW: Sentiment aggregation endpoint (from MongoDB)
# ──────────────────────────────────────────────

@app.route('/api/sentiment', methods=['GET'])
def api_get_sentiment():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$candidate_id",
                    "avg_sentiment": {"$avg": "$sentiment_score"},
                    "avg_subjectivity": {"$avg": "$subjectivity"},
                    "total_mentions": {"$sum": 1},
                    "positive_count": {
                        "$sum": {"$cond": [{"$gt": ["$sentiment_score", 0.1]}, 1, 0]}
                    },
                    "negative_count": {
                        "$sum": {"$cond": [{"$lt": ["$sentiment_score", -0.1]}, 1, 0]}
                    },
                    "neutral_count": {
                        "$sum": {"$cond": [
                            {"$and": [
                                {"$gte": ["$sentiment_score", -0.1]},
                                {"$lte": ["$sentiment_score", 0.1]}
                            ]}, 1, 0
                        ]}
                    }
                }
            }
        ]
        results = list(db.SentimentLogs.aggregate(pipeline))
        
        # Get candidate names from DB
        candidates = {str(c["_id"]): c["display_name"] for c in db.Candidates.find({}, {"_id": 1, "display_name": 1})}
        
        formatted = []
        for r in results:
            cand_name = candidates.get(r["_id"], r["_id"])
            formatted.append({
                "candidate_id": r["_id"],
                "candidate_name": cand_name,
                "avg_sentiment": round(r["avg_sentiment"], 3),
                "avg_subjectivity": round(r["avg_subjectivity"], 3),
                "total_mentions": r["total_mentions"],
                "positive": r["positive_count"],
                "negative": r["negative_count"],
                "neutral": r["neutral_count"]
            })
        
        return jsonify({"status": "success", "data": formatted}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ──────────────────────────────────────────────
# NEW: Recent sentiment logs (from MongoDB)
# ──────────────────────────────────────────────

@app.route('/api/sentiment/recent', methods=['GET'])
def api_get_recent_sentiment():
    try:
        logs = list(db.SentimentLogs.find(
            {},
            {"_id": 0, "candidate_id": 1, "source": 1, "text": 1, "sentiment_score": 1, "timestamp": 1}
        ).sort("timestamp", -1).limit(20))
        
        # Convert datetime to string
        for log in logs:
            if isinstance(log.get("timestamp"), datetime.datetime):
                log["timestamp"] = log["timestamp"].isoformat()
        
        candidates = {str(c["_id"]): c["display_name"] for c in db.Candidates.find({}, {"_id": 1, "display_name": 1})}
        for log in logs:
            log["candidate_name"] = candidates.get(log["candidate_id"], "Unknown")
        
        return jsonify({"status": "success", "data": logs}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ──────────────────────────────────────────────
# ML Prediction & Recommendation Engine
# ──────────────────────────────────────────────

def generate_recommendations(metrics, win_probability):
    recs = []
    if metrics['sentiment'] < -0.2:
        recs.append({"type": "critical", "text": "🚨 CRITICAL: Digital sentiment is deeply negative. Deploy positive PR campaigns targeting recent controversies."})
    elif metrics['sentiment'] > 0.5:
        recs.append({"type": "success", "text": "✅ STRONG: Sentiment is highly positive. Maintain current messaging momentum."})
        
    if metrics['demographics'] < 5:
        recs.append({"type": "warning", "text": "💡 STRATEGY: Weak demographic alignment. Organize local townhalls and community outreach programs."})
        
    if metrics['incumbency'] == 1 and win_probability < 50:
        recs.append({"type": "critical", "text": "📉 WARNING: Severe anti-incumbency detected. Shift campaign focus from 'past work' to 'future vision'."})
    elif metrics['incumbency'] == 0 and metrics['party_strength'] > 7:
        recs.append({"type": "success", "text": "🔥 OPPORTUNITY: Leverage strong party backing to overcome the incumbent's existing base."})

    if metrics['party_strength'] < 4:
        recs.append({"type": "warning", "text": "⚠️ WEAK PARTY: Party infrastructure is insufficient. Focus on personal brand and grassroots campaigning."})
        
    if not recs:
        recs.append({"type": "info", "text": "ℹ️ Stable position. Continue standard campaign operations."})
        
    return recs

@app.route('/api/predict', methods=['POST'])
def predict_pow():
    if not ml_model:
        return jsonify({"error": "Model not trained yet"}), 500
        
    data = request.json
    
    incumbency = data.get('incumbency', 0)
    party_strength = data.get('party_strength', 5)
    sentiment = data.get('sentiment', 0)
    demographics = data.get('demographics', 5)
    
    features = pd.DataFrame([[
        incumbency,
        party_strength,
        sentiment,
        demographics
    ]], columns=['incumbency', 'party_strength', 'sentiment_avg', 'demographic_alignment'])
    
    probabilities = ml_model.predict_proba(features)[0]
    win_probability = round(probabilities[1] * 100, 2)
    
    # Feature importance from model
    importances = dict(zip(
        ['incumbency', 'party_strength', 'sentiment_avg', 'demographic_alignment'],
        [round(float(x), 3) for x in ml_model.feature_importances_]
    ))
    
    recommendations = generate_recommendations({
        'incumbency': incumbency,
        'party_strength': party_strength,
        'sentiment': sentiment,
        'demographics': demographics
    }, win_probability)
    
    return jsonify({
        "status": "success", 
        "probability_of_win": win_probability,
        "confidence": round(max(probabilities) * 100, 1),
        "feature_importance": importances,
        "recommendations": recommendations
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
