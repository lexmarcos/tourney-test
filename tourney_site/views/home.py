import datetime

from flask import Blueprint, jsonify, session, request, flash, redirect, url_for, flash

from tourney_site.models import login_required
from tourney_site.db import get_db

bp = Blueprint('home', __name__)

@bp.route('/api/players')
@login_required
def players_view():
    db = get_db()

    players = db.players.find()

    names = {p['name'] for p in players}

    return jsonify({
        'players': names,
    })


@bp.route('/api/tournaments')
@login_required
def tournaments_view():
    db = get_db()

    tournaments = list(db.tournaments.find())

    return jsonify({
        'user': session["username"],
        'tournaments': tournaments,
    })


@bp.route('/api/tournaments/new', methods=['POST'])
@login_required
def new_tournaments_view():
    db = get_db()
    user = session["username"]

    name = request.json['name']
    game = request.json['game']
    daterange = request.json['daterange']
    description = request.json['description']


    if not name:
        return jsonify({"success": False, "messages": "Enter the tournament name."})

    if not game:
        return jsonify({"success": False, "messages": "Enter the tournament game."})

    if not daterange:
        return jsonify({"success": False, "messages": "Enter the tournament daterange."})

    tourney_id = db.tournaments.insert_one({
        'name': name.strip(),
        'game': game.strip(),
        'dates': daterange,
        'description': description.strip(),

        'creator': user,
        'directors': [user],
        'assistant_directors': [],
        'players_joined': [],
        'players_interested': [],
        'watchers': [],
        'location': None,
        'type': 'Bracket',

        'active': True,
        'created_ts': datetime.datetime.now(),
    })

    return jsonify({"success": True, "messages": "Tournament created"})
