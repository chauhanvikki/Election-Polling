import datetime
from pymongo import MongoClient
from textblob import TextBlob

# Connect to MongoDB
MONGO_URI = "mongodb+srv://singhvikki870_db_user:5PQ0L9doOAjyRnfX@cluster0.aqkonu7.mongodb.net/"

def get_db():
    client = MongoClient(MONGO_URI)
    return client['political_matrix_db']

def fetch_social_data(candidate_name):
    # Mock function: In reality, use Tweepy (Twitter API) or NewsAPI here
    return [
        f"{candidate_name} is doing terrible work. Disappointed.",
        f"I fully support {candidate_name} in the upcoming election!",
        f"{candidate_name} has mixed reviews, but the infrastructure project was good.",
        f"Do not vote for {candidate_name}, completely corrupt."
    ]

def analyze_and_store_sentiment(candidate_id, candidate_name):
    db = get_db()
    raw_texts = fetch_social_data(candidate_name)
    
    records = []
    for text in raw_texts:
        # NLP Sentiment Analysis (-1.0 to 1.0)
        analysis = TextBlob(text)
        sentiment_score = analysis.sentiment.polarity 
        
        # Insert into MongoDB
        record = {
            "candidate_id": candidate_id,
            "source": "social_mock",
            "text": text,
            "sentiment_score": sentiment_score,
            "timestamp": datetime.datetime.utcnow()
        }
        db.SentimentLogs.insert_one(record)
        records.append(record)
        print(f"Stored sentiment: {sentiment_score:.2f} for {candidate_name}")
        
    return records

if __name__ == "__main__":
    # Test data ingestion
    analyze_and_store_sentiment("cand_a", "Candidate A")
    analyze_and_store_sentiment("cand_b", "Candidate B")
    analyze_and_store_sentiment("cand_c", "Candidate C")
