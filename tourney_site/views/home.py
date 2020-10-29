import datetime

from flask import Blueprint, jsonify, session, request, flash, redirect, url_for, flash

from tourney_site.models import login_required
from tourney_site.db import get_db

bp = Blueprint('home', __name__)


@bp.route('/home')
@login_required
def home_view():
    return jsonify({"message": "Hello"})


@bp.route('/players')
@login_required
def players_view():
    db = get_db()

    players = db.players.find()

    names = {p['name'] for p in players}

    return jsonify({
        'players': names,
    })


@bp.route('/tournaments')
@login_required
def tournaments_view():
    db = get_db()

    tournaments = list(db.tournaments.find())

    return jsonify({
        'user': session["username"],
        'tournaments': tournaments,
    })


@bp.route('/tournaments/new')
@login_required
def new_tournaments_view():
    db = get_db()
    user = session["user"]

    name = request.json['name']
    game = request.json['game']
    daterange = request.json['daterange']
    description = request.json['description']

    if not name:
        flash('Enter the tournament name.')
        return redirect('/tournaments')

    if not game:
        flash('Enter the tournament game.')
        return redirect('/tournaments')

    if not daterange:
        flash('Enter the tournament daterange.')
        return redirect('/tournaments')

    tourney_id = db.tournaments.insert_one({
        'name': name.strip(),
        'game': game.strip(),
        'dates': [s.strip() for s in daterange.split(" - ")],
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

    return redirect('/tournaments')
