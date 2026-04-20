import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'pow_model.pkl')

def train_model():
    # 1. Prepare Dataset (Historical data features)
    # Features: [incumbency_flag, party_strength, sentiment_avg, demographic_alignment]
    # We will expand this dataset for better Random Forest training
    data = {
        'incumbency': [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        'party_strength': [8, 5, 3, 9, 7, 6, 2, 8, 4, 9, 7, 3, 5, 8, 6, 9, 2, 4, 7, 5],
        'sentiment_avg': [0.5, -0.2, -0.8, 0.9, 0.1, 0.2, -0.9, 0.6, -0.1, 0.8, 0.4, -0.5, -0.3, 0.7, 0.3, 0.9, -0.7, -0.2, 0.6, 0.0],
        'demographic_alignment': [7, 4, 3, 8, 6, 5, 2, 7, 3, 9, 6, 2, 4, 8, 5, 9, 3, 5, 7, 4],
        'won': [1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0] # Target variable (1 = Won, 0 = Lost)
    }
    df = pd.DataFrame(data)
    
    X = df[['incumbency', 'party_strength', 'sentiment_avg', 'demographic_alignment']]
    y = df['won']
    
    # 2. Train Random Forest
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X, y)
    
    # 3. Save the model for Flask to use
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(rf_model, f)
        
    print("Model trained and saved to pow_model.pkl")
    
    # Feature Importance
    print("\nFeature Importances:")
    for feature, imp in zip(X.columns, rf_model.feature_importances_):
        print(f"{feature}: {imp:.2f}")

if __name__ == "__main__":
    train_model()
