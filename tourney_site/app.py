import os
import logging

from flask import Flask, request, render_template, jsonify, session
from tourney_site.convert import MongoJSONEncoder, ObjectIdConverter


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY='mysecret',
        DATABASE='0.0.0.0:27017/tourney-site',
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from tourney_site import db
    db.init_app(app)
    with app.app_context():
        db.init_db()
    app.json_encoder = MongoJSONEncoder
    app.url_map.converters['objectid'] = ObjectIdConverter

    from tourney_site.views import auth
    app.register_blueprint(auth.bp)

    from tourney_site.views import hello
    app.register_blueprint(hello.bp)

    from tourney_site.views import users
    app.register_blueprint(users.bp)

    logging.getLogger('urllib3.connectionpool').setLevel(logging.CRITICAL)

    @app.after_request
    def add_header(r):
        r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        r.headers["Pragma"] = "no-cache"
        r.headers["Expires"] = "0"
        r.headers['Cache-Control'] = 'public, max-age=0'
        return r

    @app.route('/', methods=['GET', 'POST'])
    def index():
        if request.method == "POST":
            if "username" in session:
                return jsonify({"auth": True})
            else:
                return jsonify({"auth": False})

        return render_template("index.html")

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
