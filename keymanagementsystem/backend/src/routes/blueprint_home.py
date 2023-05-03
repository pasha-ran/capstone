"""
    Defines miscellanous routes

    TODO:
        - Rename this file and blueprint to "blueprint_misc"
"""
# Import flask objects
from flask import Flask, Blueprint, current_app

# Define the blueprint
blueprint_home: Blueprint = Blueprint(name="blueprint_home", import_name=__name__)

@blueprint_home.route("/", methods=["GET"])
def home() :
    if current_app.config["ENV"] == "production":
        return "Welcome to the key management API! You are in production mode."
    else:
        return "Welcome to the key management API! You are in development mode."
    