from flask import Flask, request, make_response,jsonify
from models import Users, Monitors ,Log # Make sure you import Monitors here
from database import db  # Assuming you moved the db initialization to a separate module
import os
from dotenv import load_dotenv
from flask_cors import CORS
from datetime import datetime, timedelta
from sqlalchemy.sql import func
load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app) 
# Initialize the app with the database
db.init_app(app)


# Ensure the tables are created
with app.app_context():
    db.create_all()

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    password = data.get("password")

    if firstName and lastName and email and password:
        user = Users.query.filter_by(email=email).first()
        if user:
            return make_response(
                {"message": "Email already registered"}, 200
            )
        
        new_user = Users(
            email=email,
            password=password,
            firstName=firstName,
            lastName=lastName,
        )
        db.session.add(new_user)
        db.session.commit()

        return make_response(
            {"message": "Account created successfully"}, 200
        )
    else:
        return make_response(
            {"message": "All fields are required"}, 400
        )

@app.route("/add-monitor", methods=["POST"])
def add_monitor():
    data = request.json
    path = data.get("path")
    method = data.get("method")
    interval = data.get("interval")
    timeout = data.get("timeout")
    request_body = data.get("request_body")
    response_body = data.get("response_body")
    query_params = data.get("query_params")
    headers = data.get("headers")
    user_id = data.get("user_id")
    print(interval)
    if path and method:
        try:
            new_monitor = Monitors(
                path=path,
                method=method,
                interval=interval,
                timeout=timeout,
                request_body=request_body,
                response_body=response_body,
                query_params=query_params,
                headers=headers,
                user_id=user_id,
                status=True
            )
            db.session.add(new_monitor)
            db.session.commit()

            return make_response(
                {"message": "Monitor added successfully"}, 200
            )
        except Exception as e:
            db.session.rollback()
            return make_response(
                {"message": f"Error adding monitor: {str(e)}"}, 500
            )
    else:
        return make_response(
            {"message": "Path and method are required"}, 400
        )

from datetime import datetime, timedelta
from sqlalchemy import extract


@app.route("/fetch-monitor-list", methods=["POST"])
def fetch_monitor():
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return make_response({"message": "user id is required"}, 404)
    
    # Fetch all monitors for the user
    monitors = Monitors.query.filter_by(user_id=user_id).all()
    
    monitor_list = []
    
    for monitor in monitors:
        # Prepare monitor data
        monitor_data = {
            "path": monitor.path,
            "interval": monitor.interval.total_seconds(),  # Convert timedelta to seconds
            "created_at": monitor.created_at.isoformat(),  # Convert datetime to string
            "status": monitor.status,
            "logs": []
        }
        
        # Get the current time and 24 hours before it
        now = datetime.utcnow()
        last_24_hours = now - timedelta(hours=24)
        
        # Fetch logs for the past 24 hours, grouped by hour and ordered by timestamp
        hourly_logs = db.session.query(
            func.date_trunc('hour', Log.timestamp).label('hour_start'),
            func.bool_and(Log.success).label('hour_status')
        ).filter(
            Log.monitor_id == monitor.id,
            Log.timestamp >= last_24_hours  # Logs within the last 24 hours
        ).group_by(
            func.date_trunc('hour', Log.timestamp)  # Group by hour
        ).order_by('hour_start').all()

        # Prepare hourly log data with a proper timestamp for the start of the hour
        for log in hourly_logs:
            monitor_data["logs"].append({
                "time": log.hour_start.isoformat(),  # Full timestamp of the start of the hour
                "status": log.hour_status
            })
        
        monitor_list.append(monitor_data)
    
    return jsonify(monitor_list), 200

if __name__ == "__main__":
     app.run(host="localhost", port=6969, debug=True)
