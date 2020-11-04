import datetime

from flask import Blueprint, jsonify, session, request, flash, redirect, url_for

from tourney_site.models import login_required
from tourney_site.db import get_db
from bson.objectid import ObjectId

import random

bp = Blueprint('home', __name__)

def get_current_user():
    if "profile" in dict(session):
        return dict(session)["profile"]["name"]
    else:
        return session["username"]


def get_tournament_config(players):
    i = 0
    while 2**i < len(players):
        i+=1
    byes = (2**i) - len(players)

    return {
        "byes": byes,
        "rounds": i,
    }


def generate_first_round(players):
    random.shuffle(players)
    round = []
    config = get_tournament_config(players)
    if config['byes'] > 0:
        for bye in range(config['byes']):
            players.append("BYE")
    

    player_2_index = int(len(players)/2)
    for i in range(int(len(players)/2)):
        player_1 = "BYE"
        player_2 = "BYE"
        if i < len(players)/2:
            player_1 = players[i]
        if (player_2_index + 1) <= len(players):
            player_2 = players[player_2_index]
        round.append({
            "player_1": {
                "name": player_1,
                "score": 0,
            },
            "player_2": {
                "name": player_2,
                "score": 0,
            }
        })
        player_2_index += 1
    return round

def make_next_round(prev_round, prev_round_number):
    filter_games = []
    next_round = []
    index = 0

    while(index < int(len(prev_round))):
        games = [[prev_round[index]['player_1'], prev_round[index]['player_2']],[prev_round[index+1]['player_1'], prev_round[index+1]['player_2']]]
        index += 2
        filter_games.append(games)
    
    for index_games, games in enumerate(filter_games):
        players = {}
        for index, game in enumerate(games):
            if game[0]['name'] != "BYE" and game[0]['score'] == 0 and game[1]['name'] != "BYE" and game[1]['score'] == 0:
                players['player_' + str(index + 1)] = {"name": "Winner of M{local} - {game}".format(local = index_games + 1, game = prev_round_number + 1), "score": 0}
            else:
                if game[0]['name'] == "BYE" or game[0]['score'] < game[1]['score']:
                    players['player_' + str(index + 1)] = {"name" : game[1]['name'], "score": 0}
                elif game[1]['name'] == "BYE" or game[1]['score'] < game[0]['score']:
                    players['player_' + str(index + 1)] = {"name" : game[0]['name'], "score": 0}
                else:
                    players['player_' + str(index + 1)] = {"name" : game[0]['name'], "score": 0}
        next_round.append(players)
        
    return next_round


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
    user = get_current_user()

    tournaments = list(db.tournaments.find({"creator" : { "$ne": 20 }}))

    return jsonify({
        'tournaments': tournaments,
    })

@bp.route('/api/tournaments/user')
@login_required
def user_tournaments_view():
    db = get_db()
    user = get_current_user()

    tournaments = list(db.tournaments.find({"creator" : user}))

    return jsonify({
        'tournaments': tournaments,
    })

@bp.route('/api/tournament/<id>')
@login_required
def tournament_view(id):
    db = get_db()

    tournament = list(db.tournaments.find({"_id" : ObjectId(id)}))

    return jsonify({
        'tournament': tournament[0],
    })


@bp.route('/api/tournament/signup', methods=['POST'])
@login_required
def signup_player_to_tournament():
    db = get_db()
    id = request.json['id']
    db.tournaments.update({"_id" : ObjectId(id)}, { "$push": { "players_joined": get_current_user() } } )
    tournament = list(db.tournaments.find({"_id" : ObjectId(id)}))

    return jsonify({
        'tournament': tournament[0],
    })


@bp.route('/api/tournament/start', methods=['POST'])
@login_required
def start_tournament():
    db = get_db()
    id = request.json['id']

    players = list(db.tournaments.find({"_id" : ObjectId(id)}, {"_id": 0, "players_joined": 1}))
    players = players[0]['players_joined']

    config = get_tournament_config(players)
    rounds = []
    rounds.append(generate_first_round(players))
    
    for i in range(config['rounds']-1):
        rounds.append(make_next_round(rounds[i], i))

    db.tournaments.update({"_id" : ObjectId(id)}, {"$set":{ "brackets": rounds }} )

    return jsonify({
        'brackets': rounds,
    })



@bp.route('/api/tournaments/new', methods=['POST'])
@login_required
def new_tournaments_view():
    db = get_db()
    user = get_current_user()

    name = request.json['name']
    game = request.json['game']
    daterange = request.json['daterange']
    description = request.json['description']


    if not name:
        return jsonify({
            "success": False,
            "message": "Enter the tournament name"
        })

    if not game:
        return jsonify({
            "success": False,
            "message": "Enter the tournament game"
        })

    if not daterange:
        return jsonify({
            "success": False,
            "message": "Enter the tournament daterange"
        })

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

    return jsonify({
            "success": True,
            "message": "Tournament created"
        })
