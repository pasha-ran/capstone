"""
    On powershell (vscode), type this:
    $env:FLASK_ENV="development"

    change development to production if you want to run in production mode
"""

from distutils.debug import DEBUG


class Config(object):

    # Base configs
    DEBUG = False
    TESTING = False
    SECRET_KEY = "NdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3"
    SESSION_COOKIE_SAMESITE="None"
    SESSION_COOKIE_SECURE=True

    # DB Configs
    MONGODB_SETTINGS = {
        "db": "keymanagementdb",
        "host": "database",
        "port": 27017
    }

    # Email configs
    MAIL_SERVER = "antispam.cs.vt.edu"
    MAIL_PORT = 25
    MAIL_USERNAME = "keymanagementsystem@cs.vt.edu"
    MAIL_USE_TLS = False
    MAIL_USE_SLL = True

    # Administrator's email
    ADMIN_EMAIL = "test@test.com"   


class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True
    MONGODB_SETTINGS = {
        "db": "keymanagementdb",
        "host": "database",
        "port": 27017
    }

class TestingConfig(Config):
    TESTING = True