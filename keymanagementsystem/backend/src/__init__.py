# Import libraries
from flask import Config, Flask
from flask_mongoengine import MongoEngine
from flask_cors import CORS
from flask_mail import Mail

# Import blueprints
from .routes.blueprint_home import blueprint_home
from .routes.blueprint_cas import blueprint_cas
from .routes.blueprint_keys import blueprint_keys
from .routes.blueprint_users import blueprint_users
from .routes.blueprint_ledger import blueprint_ledger
from .routes.blueprint_email import blueprint_email

# Initial plugins
db = MongoEngine()
cors = CORS()
mail = Mail()


def create_app() -> Flask:
    """Factory method for creating a flask application

    Returns:
        Flask: An instance of a flask application
    """

    # Initialize core application
    app = Flask(__name__)

    # Initialize configuration based on exported ENV (an environment variable)
    if app.config["ENV"] == "production":
        # Triggered by doing "export FLASK_ENV=production"
        app.logger.debug("Using production settings")
        app.config.from_object("config.ProductionConfig")
    else:
        # Triggered by doing "export FLASK_ENV=development"
        app.logger.debug("Using development settings")
        app.config.from_object("config.DevelopmentConfig")

    # Initialize plugins
    db.init_app(app)
    cors.init_app(app, supports_credentials=True)
    mail.init_app(app)

    # Register Blueprints
    with app.app_context():

        app.register_blueprint(blueprint_home, url_prefix="/api")
        app.register_blueprint(blueprint_cas, url_prefix="/api")
        app.register_blueprint(blueprint_keys, url_prefix="/api")
        app.register_blueprint(blueprint_users, url_prefix="/api")
        app.register_blueprint(blueprint_ledger, url_prefix="/api")
        app.register_blueprint(blueprint_email, url_prefix="/api")
        
        return app
