"""
Seed script to populate MongoDB with constituency, candidate,
and historical data for the Predictive Electoral Analytics platform.
"""
import datetime
from pymongo import MongoClient, ASCENDING, DESCENDING

MONGO_URI = "mongodb+srv://singhvikki870_db_user:5PQ0L9doOAjyRnfX@cluster0.aqkonu7.mongodb.net/"

client = MongoClient(MONGO_URI)
db = client['political_matrix_db']

def seed_constituency():
    db.Constituencies.drop()
    constituency = {
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "type": "General",
        "total_voters": 1842000,
        "demographics": {
            "youth_percentage": 35.5,
            "rural_percentage": 40.0,
            "urban_percentage": 60.0,
            "literacy_rate": 72.3,
            "religion": {"hindu": 75, "muslim": 20, "other": 5},
            "caste": {"general": 30, "obc": 35, "sc": 20, "st": 5, "other": 10}
        },
        "past_turnout": [62.4, 58.1, 65.7, 60.2, 63.8],
        "created_at": datetime.datetime.utcnow()
    }
    result = db.Constituencies.insert_one(constituency)
    print(f"Inserted constituency: {constituency['name']} -> {result.inserted_id}")
    return result.inserted_id

def seed_candidates(constituency_id):
    db.Candidates.drop()
    candidates = [
        {
            "constituency_id": constituency_id,
            "name": "Rajesh Kumar Singh",
            "display_name": "Candidate A (Incumbent)",
            "party": "Bharatiya National Alliance",
            "party_short": "BNA",
            "is_incumbent": True,
            "age": 58,
            "education": "M.A. Political Science",
            "past_work_score": 7,
            "personal_base_score": 6,
            "terms_served": 2,
            "previous_margin": 45000,
            "scores": {
                "incumbency": {"value": 2, "label": "High (Anti-incumbency)"},
                "party_strength": {"value": 8, "label": "Strong National Presence"},
                "past_work": {"value": 7, "label": "Verified Dev. Projects"},
                "personal_base": {"value": 6, "label": "Traditional Loyalists"},
                "demographic_base": {"value": 5, "label": "Split Support"},
                "digital_sentiment": {"value": 4, "label": "Neutral/Negative"}
            },
            "created_at": datetime.datetime.utcnow()
        },
        {
            "constituency_id": constituency_id,
            "name": "Priya Sharma",
            "display_name": "Candidate B (Challenger)",
            "party": "People's Progressive Front",
            "party_short": "PPF",
            "is_incumbent": False,
            "age": 42,
            "education": "MBA, Social Work",
            "past_work_score": 8,
            "personal_base_score": 8,
            "terms_served": 0,
            "previous_margin": 0,
            "scores": {
                "incumbency": {"value": 5, "label": "N/A (Neutral)"},
                "party_strength": {"value": 7, "label": "Regional Powerhouse"},
                "past_work": {"value": 8, "label": "High Social Activism"},
                "personal_base": {"value": 8, "label": "Youth/Urban Appeal"},
                "demographic_base": {"value": 9, "label": "Solidified Block"},
                "digital_sentiment": {"value": 9, "label": "Highly Positive"}
            },
            "created_at": datetime.datetime.utcnow()
        },
        {
            "constituency_id": constituency_id,
            "name": "Arun Patel",
            "display_name": "Candidate C (Independent)",
            "party": "Independent",
            "party_short": "IND",
            "is_incumbent": False,
            "age": 51,
            "education": "B.Sc. Agriculture",
            "past_work_score": 2,
            "personal_base_score": 7,
            "terms_served": 0,
            "previous_margin": 0,
            "scores": {
                "incumbency": {"value": 5, "label": "N/A (Neutral)"},
                "party_strength": {"value": 3, "label": "Weak / Local Only"},
                "past_work": {"value": 2, "label": "Limited Record"},
                "personal_base": {"value": 7, "label": "Hyper-Local Community"},
                "demographic_base": {"value": 4, "label": "Minority Niche"},
                "digital_sentiment": {"value": 2, "label": "Low Visibility"}
            },
            "created_at": datetime.datetime.utcnow()
        }
    ]
    result = db.Candidates.insert_many(candidates)
    print(f"Inserted {len(result.inserted_ids)} candidates")
    return result.inserted_ids

def seed_historical_results(constituency_id):
    db.HistoricalResults.drop()
    results = [
        {"constituency_id": constituency_id, "year": 2009, "winner_party": "BNA", "winner_margin": 52000, "turnout_percentage": 58.1, "total_votes_cast": 1072000},
        {"constituency_id": constituency_id, "year": 2014, "winner_party": "BNA", "winner_margin": 371000, "turnout_percentage": 65.7, "total_votes_cast": 1211000},
        {"constituency_id": constituency_id, "year": 2019, "winner_party": "BNA", "winner_margin": 479000, "turnout_percentage": 63.8, "total_votes_cast": 1175000},
        {"constituency_id": constituency_id, "year": 2024, "winner_party": "BNA", "winner_margin": 150000, "turnout_percentage": 60.2, "total_votes_cast": 1108000},
    ]
    for r in results:
        r["created_at"] = datetime.datetime.utcnow()
    db.HistoricalResults.insert_many(results)
    print(f"Inserted {len(results)} historical results")

def seed_sentiment_logs(candidate_ids):
    db.SentimentLogs.drop()
    from textblob import TextBlob
    import random

    texts_by_candidate = {
        0: [  # Candidate A - mixed/negative
            "The incumbent has not delivered on promises. Roads are still broken.",
            "At least the highway project was completed on time. Credit where it's due.",
            "Corruption allegations are damaging the incumbent's credibility.",
            "Rajesh Kumar has done good work for the temple renovation project.",
            "Tired of the same old politics. Time for change.",
            "Development funds were misused according to RTI data.",
            "The PM's support could save the incumbent this time.",
        ],
        1: [  # Candidate B - positive
            "Priya Sharma's youth rally was massive! Real energy for change.",
            "The challenger has a solid social media game. Very impressive.",
            "PPF's manifesto addresses real issues - jobs, education, healthcare.",
            "Priya's NGO work in rural schools shows genuine commitment.",
            "Young voters are excited about a fresh face in politics!",
            "The women's empowerment program she started is showing real results.",
            "Finally someone who understands what the youth actually need.",
        ],
        2: [  # Candidate C - low visibility
            "Who is this independent candidate? Never heard of him.",
            "Arun Patel seems honest but has zero organizational support.",
            "The independent is a spoiler candidate, nothing more.",
            "Local farmers trust Arun but he can't win at this scale.",
            "His agricultural reform ideas are actually quite good though.",
        ]
    }

    days_back = 7
    records = []
    for idx, cand_id in enumerate(candidate_ids):
        texts = texts_by_candidate.get(idx, [])
        for i, text in enumerate(texts):
            analysis = TextBlob(text)
            day_offset = i % days_back
            timestamp = datetime.datetime.utcnow() - datetime.timedelta(days=day_offset, hours=random.randint(0, 23))
            records.append({
                "candidate_id": str(cand_id),
                "source": random.choice(["twitter", "news", "reddit", "local_forum"]),
                "text": text,
                "sentiment_score": round(analysis.sentiment.polarity, 3),
                "subjectivity": round(analysis.sentiment.subjectivity, 3),
                "timestamp": timestamp
            })
    
    db.SentimentLogs.insert_many(records)
    print(f"Inserted {len(records)} sentiment logs")

def create_indexes():
    db.SentimentLogs.create_index([("candidate_id", ASCENDING), ("timestamp", DESCENDING)])
    db.Candidates.create_index([("constituency_id", ASCENDING)])
    db.HistoricalResults.create_index([("constituency_id", ASCENDING), ("year", DESCENDING)])
    print("Indexes created successfully")

if __name__ == "__main__":
    print("=" * 50)
    print("Seeding MongoDB with Electoral Data...")
    print("=" * 50)
    cid = seed_constituency()
    candidate_ids = seed_candidates(cid)
    seed_historical_results(cid)
    seed_sentiment_logs(candidate_ids)
    create_indexes()
    print("=" * 50)
    print("Database seeded successfully!")
    print("=" * 50)
