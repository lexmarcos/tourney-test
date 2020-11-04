import os
import logging

from flask import Flask, request, render_template, jsonify, session, url_for, redirect
from tourney_site.convert import MongoJSONEncoder, ObjectIdConverter

from authlib.integrations.flask_client import OAuth
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, static_folder="./static", template_folder="./templates")

    oauth = OAuth(app)
    google = oauth.register(
        name='google',
        client_id="241207606130-seji6525kc1i7dvfr7mt68flgm0r70fo.apps.googleusercontent.com",
        client_secret="bpcYF5II8ACFmIpK4gMW_0oW",
        access_token_url='https://accounts.google.com/o/oauth2/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params=None,
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',  # This is only needed if using openId to fetch user info
        client_kwargs={'scope': 'openid email profile'},
    )

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

    from tourney_site.views import home
    app.register_blueprint(home.bp)

    logging.getLogger('urllib3.connectionpool').setLevel(logging.CRITICAL)

    @app.after_request
    def add_header(r):
        r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        r.headers["Pragma"] = "no-cache"
        r.headers["Expires"] = "0"
        r.headers['Cache-Control'] = 'public, max-age=0'
        return r

    @app.route('/', defaults={'path': ''}, methods=["GET", "POST"])
    @app.route('/<path:path>')
    def index(path):
        if request.method == "POST":
            if "username" in session:
                return jsonify({"auth": True})
            elif "profile" in dict(session):
                return jsonify({"auth": True})
            else:
                return jsonify({"auth": False})

        return render_template("index.html")
    
    @app.route('/login')
    def login_google():
        google = oauth.create_client('google')  # create the google oauth client
        redirect_uri = url_for('authorize', _external=True)
        return google.authorize_redirect(redirect_uri)


    @app.route('/authorize')
    def authorize():
        google = oauth.create_client('google')  # create the google oauth client
        token = google.authorize_access_token()  # Access token from google (needed to get user info)
        resp = google.get('userinfo')  # userinfo contains stuff u specificed in the scrope
        user_info = resp.json()
        user = oauth.google.userinfo()  # uses openid endpoint to fetch user info
        # Here you use the profile/user data that you got and query your database find/register the user
        # and set ur own data in the session not the profile from google
        session['profile'] = user_info
        session.permanent = True  # make the session permanant so it keeps existing after broweser gets closed
        return redirect('/')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
