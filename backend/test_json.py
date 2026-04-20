from pymongo import MongoClient
import json
import datetime

MONGO_URI = "mongodb+srv://singhvikki870_db_user:5PQ0L9doOAjyRnfX@cluster0.aqkonu7.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client['political_matrix_db']

constituency = db.Constituencies.find_one({}, {"_id": 0, "created_at": 0})
print("constituency:", constituency)
try:
    json.dumps(constituency)
    print("constituency serialized OK")
except Exception as e:
    print("constituency JSON error:", e)

historical = list(db.HistoricalResults.find({}, {"_id": 0, "constituency_id": 0, "created_at": 0}).sort("year", 1))
print("historical:", historical)
try:
    json.dumps(historical)
    print("historical serialized OK")
except Exception as e:
    print("historical JSON error:", e)
