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

    tournaments = list(db.tournaments.find({"creator" : { "$ne": user }}))

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


@bp.route('/api/tournament/player/win', methods=['POST'])
@login_required
def player_win():
    db = get_db()

    id = request.json['id']
    round = request.json['round']
    game = request.json['game']
    player = request.json['player']

    bracket = list(db.tournaments.find({"_id" : ObjectId(id)}, {"_id": 0, "brackets": 1}))[0]['brackets']

    not_games = 0
    winners = 0
    for games in bracket[round]:
        if 'Winner of' in games['player_1']['name'] or 'Winner of' in games['player_2']['name']:
            not_games += 1
        if 'BYE' in games['player_1']['name'] or 'BYE' in games['player_2']['name']:
            not_games += 1
        if "winner" in games['player_1'] or "winner" in games['player_2']:
            if  games['player_1']['winner'] or games['player_2']['winner']:
                winners += 1


    bracket[round][game][player]['score'] = 1
    bracket[round][game][player]['winner'] = True
    if player == 'player_1':
        bracket[round][game]['player_2']['winner'] = False
    else:
        bracket[round][game]['player_1']['winner'] = False

    round_to_finish = None
    is_able_to_finish = False
    if winners == (int(len(bracket[round]))-1)-not_games:
        is_able_to_finish = True
        round_to_finish = round

    db.tournaments.update({"_id" : ObjectId(id)}, {"$set":{ "brackets": bracket, "round_to_finish": round_to_finish }} )

    return jsonify({"is_able_to_finish": is_able_to_finish})
    return {"dale": True}

@bp.route('/api/tournament/round/finish', methods=['POST'])
@login_required
def finish_round():
    db = get_db()

    id = request.json['id']
    round = request.json['round']
    winner = ""
    ranking = []

    bracket = list(db.tournaments.find({"_id" : ObjectId(id)}, {"_id": 0, "brackets": 1}))[0]['brackets']
    
    if round + 1 < int(len(bracket)):
        bracket[round + 1] = make_next_round(bracket[round], round)
    else:
        if bracket[round][0]['player_1']['score'] > bracket[round][0]['player_2']['score']:
            winner = bracket[round][0]['player_1']['name']
        else:
            winner = bracket[round][0]['player_2']['name']

        for index, game in enumerate(bracket):
            position = []
            for player in game:
                if "winner" in player['player_1']:
                    if not player['player_1']['winner']:
                        position.append(player['player_1']['name'])
                    else:
                        if not player['player_2']['winner']:
                            position.append(player['player_2']['name'])

            ranking.append(position)
        
    db.tournaments.update({"_id" : ObjectId(id)}, {"$set":{ "brackets": bracket, "winner": winner, "round_to_finish": None, "ranking": ranking }} )

    return jsonify({"rounds": bracket})


@bp.route('/api/tournament/ranking/<id>', methods=['GET'])
@login_required
def generate_ranking(id):
    db = get_db()

    ranking = list(db.tournaments.find({"_id" : ObjectId(id)}, {"_id": 0, "ranking": 1}))[0]['ranking']

    return jsonify({"rounds": ranking})


@bp.route('/api/tournament/place_players', methods=['POST'])
@login_required
def place_players():
    db = get_db()
    id = request.json['id']

    players = list(db.tournaments.find({"_id" : ObjectId(id)}, {"_id": 0, "players_joined": 1}))
    players = players[0]['players_joined']
    random.shuffle(players)
    config = get_tournament_config(players)
    rounds = []
    rounds.append(generate_first_round(players))
    
    for i in range(config['rounds']-1):
        rounds.append(make_next_round(rounds[i], i))

    db.tournaments.update({"_id" : ObjectId(id)}, {"$set":{ "brackets": rounds }} )

    return jsonify({
        'brackets': rounds,
    })

@bp.route('/api/tournament/start', methods=['POST'])
@login_required
def start_tournament():
    db = get_db()
    id = request.json['id']
    db.tournaments.update({"_id" : ObjectId(id)}, {"$set":{ "started": True }} )
    return jsonify({
            "success": True,
            "message": "Tournament started"
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
