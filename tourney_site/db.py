import pymongo
from werkzeug.security import generate_password_hash
import click

from flask import current_app, g
from flask.cli import with_appcontext


def get_db() -> pymongo.database.Database:
    if 'db' not in g:
        db_url = current_app.config['DATABASE']
        cn = pymongo.MongoClient(host=db_url.rsplit('/', 1)[0])
        g.db = cn[db_url.rsplit('/', 1)[1]]

    return g.db


def init_db():
    db = get_db()

    db.users.find_one_and_update(
        {'username': 'admin'},
        {'$set': {
            'username': 'admin',
            'password': generate_password_hash('Admin22')
        }},
        upsert=True
    )
    db.users.find_one_and_update(
        {'username': 'ds-tester'},
        {'$set': {
            'username': 'ds-tester',
            'password': generate_password_hash('ds-tester')
        }},
        upsert=True
    )


@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo("Initialized the database.")


def init_app(app):
    app.cli.add_command(init_db_command)
