from flask import Flask , request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

@app.route("/login",methods=["POST"])
def login():
    email = request.form['email']

    return "Hello, World!"

if __name__ == "__main__":
    app.run("localhost", 6969)