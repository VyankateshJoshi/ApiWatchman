from database import db  # Import db from the database module
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.dialects.postgresql import ENUM
HttpMethod =ENUM( 
     "GET" ,"POST" ,"PUT" ,"DELETE" ,"PATCH" ,"OPTIONS" , "HEAD",
     name="HttpMethod",
    create_type=True,
)
class Users(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(250), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Add relationship to Monitors
    monitors = db.relationship('Monitors', backref='user', lazy=True)

    def __repr__(self):
        return f"<UserName-{self.firstName} id-{self.id}>"

class Monitors(db.Model):
    __tablename__ = "Monitors"
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(500), nullable=False)
    method = db.Column(HttpMethod, nullable=False)
    interval = db.Column(INTERVAL, nullable=False)  # Interval type
    timeout = db.Column(INTERVAL, nullable=False)  # Interval type
    request_body = db.Column(db.JSON, nullable=False)
    response_body = db.Column(db.JSON, nullable=False)
    query_params = db.Column(db.JSON, nullable=False)
    headers = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_called_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Foreign key to Users
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    def __repr__(self):
        return f"<ApiEndpoint id={self.id} path={self.path} method={self.method}>"
