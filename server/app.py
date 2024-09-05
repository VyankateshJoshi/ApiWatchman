from flask import Flask, request, make_response
from models import Users, Monitors  # Make sure you import Monitors here
from database import db  # Assuming you moved the db initialization to a separate module
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
                user_id=user_id
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

if __name__ == "__main__":
     app.run(host="localhost", port=6969, debug=True)
