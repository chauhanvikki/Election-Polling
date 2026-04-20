# Election-Polling: Predictive Electoral Analytics

A professional SaaS-style political analytics platform that synthesizes multi-dimensional data into actionable intelligence. 

## Features
- **Candidate Comparison Matrix**: Factor-by-factor breakdown of candidate strengths (Incumbency, Party Strength, Demographic Alignment, Digital Sentiment).
- **AI-Powered Simulation Engine**: Interactive sliders (Sentiment Shift, Swing Voters, Voter Turnout) powered by a Random Forest Classifier to predict real-time Probability of Win (PoW).
- **Live MongoDB Integration**: Pulls live constituency demographics, historical results, and NLP-analyzed sentiment logs directly from MongoDB Atlas.
- **Strategic Recommendation Engine**: Translates ML metrics into actionable, color-coded campaign strategies.
- **Premium UI/UX**: Built with React Router, Context API, and a custom dark-mode glassmorphism design system.

## Tech Stack
- **Frontend**: React (Vite), React Router, Recharts, Lucide Icons, Vanilla CSS
- **Backend**: Python (Flask), Scikit-Learn, TextBlob, Pandas
- **Database**: MongoDB Atlas

## Getting Started

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python seed_db.py  # Run once to seed MongoDB Atlas
python app.py      # Starts Flask server on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server
```

> **Note**: Ensure your current IP address is whitelisted in your MongoDB Atlas Network Access settings, otherwise the backend will fail to fetch live data (`TLSV1_ALERT_INTERNAL_ERROR`).
