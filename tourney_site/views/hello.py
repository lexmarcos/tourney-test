from flask import Blueprint, jsonify

from ..models import login_required

bp = Blueprint('hello', __name__)


@bp.route('/hello')
@login_required
def hello_view():
    return jsonify({"message": "Hello"})