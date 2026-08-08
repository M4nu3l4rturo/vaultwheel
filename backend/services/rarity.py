from typing import Dict, Any

def calculate_rarity_score(vehicle_data: Dict[str, Any]) -> float:
    """
    Calculates a rarity score (0-100) for a vehicle based on:
    - Production quantity (40 pts)
    - Custom/unique features (30 pts)
    - Documented history events (20 pts)
    - Valuation tier (10 pts)
    """
    score = 0.0
    
    # Production quantity score (40 pts) - fewer = rarer
    units = vehicle_data.get("production_units", 1000)
    if units <= 25:
        score += 40
    elif units <= 50:
        score += 35
    elif units <= 100:
        score += 30
    elif units <= 200:
        score += 25
    elif units <= 500:
        score += 18
    elif units <= 1000:
        score += 12
    else:
        score += 5
    
    # Custom/unique features (30 pts) - more unique features = rarer
    features = vehicle_data.get("custom_features", {})
    feature_count = len(features) if isinstance(features, dict) else 0
    score += min(feature_count * 6, 30)
    
    # Documented history events (20 pts)
    passport = vehicle_data.get("passport_data", {})
    events = passport.get("timeline", []) if isinstance(passport, dict) else []
    score += min(len(events) * 3, 20)
    
    # Valuation tier (10 pts)
    valuation = float(vehicle_data.get("total_valuation", 0))
    if valuation >= 10_000_000:
        score += 10
    elif valuation >= 3_000_000:
        score += 8
    elif valuation >= 1_000_000:
        score += 6
    elif valuation >= 500_000:
        score += 4
    else:
        score += 2
    
    return min(round(score, 1), 100.0)
