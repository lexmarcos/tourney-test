from flask import Blueprint, request, redirect, session, url_for, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from tourney_site.db import get_db
from tourney_site.models import login_required

bp = Blueprint('auth', __name__)





@bp.route('/api/login', methods=['GET', 'POST'])
def login():
    db = get_db()
    if request.method == 'POST':
        username = request.json["body"]['username']
        password = request.json["body"]['password']
        message = None
        success = False
        user = db.users.find_one({'username': username})
        if not user:
            db.users.insert_one({
                "username": username,
                "password": generate_password_hash(password)
            })

            user = db.users.find_one({'username': username})
        elif not check_password_hash(user['password'], password):
            message = 'Password does not match'

        if message is None:
            session.clear()
            session['username'] = user['username']
            message = 'authenticated'
            success = True

        return jsonify({"success": success, "message": message})
    return redirect(url_for('index'))


@bp.route('/api/logged_user', methods=['GET'])
@login_required
def logged_user():
    if "profile" in dict(session):
        return jsonify({"username": dict(session)["profile"]["name"]})
    else:
        return jsonify({"username": session['username']})


@bp.route('/logout')
@login_required
def logout():
    session.clear()
    return redirect(url_for('index'))
