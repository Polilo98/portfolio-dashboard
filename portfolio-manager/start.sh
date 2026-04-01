#!/bin/zsh
set -x

# backend
cd backend
source venv/bin/activate
python -m uvicorn bakend_app:app --reload &

# frontend
cd ../frontend
npm run dev