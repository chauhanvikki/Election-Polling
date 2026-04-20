import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_data.json')

def load_data():
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

def calculate_pow():
    data = load_data()
    candidates = data['candidates']
    factors = {f['id']: f['weight'] for f in data['factors']}
    
    results = []
    total_score = 0
    
    for cand in candidates:
        score = 0
        for factor_id, weight in factors.items():
            if factor_id in cand['scores']:
                # The value is between 0 to 10
                score += cand['scores'][factor_id]['value'] * weight
        
        # apply an exponential function to simulate logistic/probabilistic gap 
        # since elections often heavily favor the clear leader
        adjusted_score = score ** 1.5 
        cand['total_raw_score'] = score
        cand['adjusted_score'] = adjusted_score
        total_score += adjusted_score
        results.append(cand)
        
    # Calculate Probability of Win (PoW) as percentage
    for cand in results:
        if total_score > 0:
            cand['pow'] = round((cand['adjusted_score'] / total_score) * 100, 1)
        else:
            cand['pow'] = 0
            
    return results

def get_factors():
    data = load_data()
    return data['factors']
