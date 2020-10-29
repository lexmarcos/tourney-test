from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from ..db import get_db
from ..models import login_required

bp = Blueprint('users', __name__)


@bp.route('/users', methods=['GET', 'POST'])
@login_required
def users_view():
    db = get_db()
    if request.method == "GET":
        users = [{"username": u['username']} for u in db.users.find()]
        return jsonify({"message": "Success", "users": users})
    elif request.method == "POST":
        new_username = request.json["body"]['n_username']
        new_password = request.json["body"]['n_password']
        message = None
        if db.users.find_one({"username": new_username}):
            message = "A user with this username already exist!"
        else:
            db.users.insert_one({
                "username": new_username, 
                "password": generate_password_hash(new_password)
                })
            message = "The user was created!"
        return jsonify({"message": message})
