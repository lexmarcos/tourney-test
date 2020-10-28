from flask import Blueprint, request, redirect, session, url_for, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from ..db import get_db
from ..models import login_required

bp = Blueprint('auth', __name__)


@bp.route('/login', methods=['GET', 'POST'])
def login():
    db = get_db()
    if request.method == 'POST':
        username = request.json["body"]['username']
        password = request.json["body"]['password']
        message = None
        user = db.users.find_one({'username': username})
        if not user:
            message = 'User not found'
        elif not check_password_hash(user['password'], password):
            message = 'Password does not match'

        if message is None:
            session.clear()
            session['username'] = user['username']
            message = 'authenticated'
        
        return jsonify({"message": message})
    return redirect(url_for('index'))


@bp.route('/logout')
@login_required
def logout():
    session.clear()
    return redirect(url_for('index'))