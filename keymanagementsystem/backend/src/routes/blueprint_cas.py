"""
    Defines routes related to CAS, authentication and client information
"""

# Import flask objects
from flask import Flask, Response, make_response, session, request, \
    redirect, url_for, Blueprint, current_app, jsonify

# Import CAS
from cas import CASClient

# Import mongo objects
from mongoengine.queryset.visitor import Q
from mongoengine import *

# Import schemas
from ..schemas.user import User

# Initialize CAS Client
cas_client = CASClient(version=2,
                       server_url="https://login.vt.edu/profile/cas/login")

# Define the base service URL
base_service_url = "https://keymanagement.discovery.cs.vt.edu/api/cas/login_callback"

# Define the blueprint
blueprint_cas: Blueprint = Blueprint(
    name="blueprint_cas", import_name=__name__)

# region Routes


@blueprint_cas.route("/cas/login", methods=["GET"])
def login() -> Response:
    """Logs in a client

    Returns:
        Response: A URL redirect to VT CAS
    """

    # Store GET parameters
    destination = request.args.get("destination")
    ticket = request.args.get("ticket")

    # Error if no destination provided
    if not destination:
        current_app.logger.debug("No destination address provided!")
        return "No destination address provided! We can't reroute you back unless this is supplied!", 400

    # Create new service URL
    cas_client.service_url = base_service_url + f"?destination={destination}"

    # If ticket is none, user needs to login with VT CAS first
    if not ticket:
        cas_login_url = cas_client.get_login_url()
        current_app.logger.debug("CAS login URL: %s", cas_login_url)
        return redirect(cas_login_url)


@blueprint_cas.route("/cas/login_callback", methods=["GET"])
def login_callback() -> Response:
    """VT CAS will call this function in a callback
    because we set the service URL to this route

    Returns:
        Response: A URL redirect to the supplied destination GET parameter
    """

    # Store GET parameters
    destination = request.args.get("destination")
    ticket = request.args.get("ticket")

    # Validate ticket from CAS
    pid, _, _ = cas_client.verify_ticket(ticket)

    # If the pid could not be extracted, that means ticket verfication failed
    if not pid:
        return f'Failed to verify ticket. <a href="{destination}">Return</a>'

    # See if the user is in the database. If they don't make a new user in
    # the database
    try:
        user: User = User.objects.get(pid=pid)
    except User.DoesNotExist:
        try:
            new_user: User = User(pid=pid, full_name="NA", role="requestor")
            new_user.save()
        except ValidationError:
            return "Error! There was an issue processing your information in the server!", 500

    session["pid"] = pid
    session.permanent = True      # set session cookie expiration to 31 days
    return redirect(destination)  # redirect client to destination


@blueprint_cas.route("/cas/logout", methods=["GET"])
def logout() -> Response:
    """Logs out a client

    Returns:
        Response: A URL redirect to VT CAS logout
    """
    # Create cas logout URL
    cas_logout_url = cas_client.get_logout_url()
    current_app.logger.debug("CAS Logout URL: %s", cas_logout_url)

    # Delete username off cookie
    if "pid" in session:
        session.pop("pid", None)

    # Redirect to cas logout url
    return redirect(cas_logout_url)


@blueprint_cas.route("/cas/info", methods=["GET"])
def info() -> Response:
    """Get info for a client (requires authentication)

    Returns:
        Response: A JSON containing user information
    """

    # Use the PID in the session cookie to get more info about the client
    if "pid" in session:
        user: User = User.objects.get(pid=session["pid"])
        return jsonify(user)
    else:
        return "Error, you are not authenticated!", 403

# endregion
