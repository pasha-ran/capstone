"""
    Defines routes for emails
"""

# Import libraries
import inspect
import uuid
import re

# Import flask objects
from flask import Blueprint, current_app, jsonify, session, abort, \
    make_response, request, Response

from flask_mail import Mail, Message

# Import mongo objects
from mongoengine import *

# Import schemas
from ..schemas.user import User
from ..schemas.key import Key

# Import validation
from ..utils.validation import validate_authenticated_admin, \
    validate_authenticated

# Setup mail
mail = Mail()

# Define email regex
email_regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

# Define the blueprint
blueprint_email: Blueprint = Blueprint(
    name="blueprint_email", import_name=__name__)


@blueprint_email.route("/email", methods=["GET"])
def get_admin_email() -> Response:

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    return jsonify(current_app.config["ADMIN_EMAIL"])


@blueprint_email.route("/email/<string:new_email>", methods=["PATCH"])
def update_admin_email(new_email: str) -> Response:

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    # Validate email
    if not re.fullmatch(email_regex, new_email):
        return f"Error, the email specified is not a valid email!", 400
    
    # Set new admin email
    current_app.config["ADMIN_EMAIL"] = new_email

    # Report done
    return f"Successfully changed admin email to {new_email}", 200


@blueprint_email.route("/email/request", methods=["POST"])
def send_request_email() -> Response:
    """Send an email to a recipient requesting for a key

    Returns:
        Response: A response indicating successful email sent
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    # Get the json from the body
    data: dict = request.get_json()

    # Define the required fields for the email
    required_fields: list = ["student_id", "recipient", "key_type", 
        "description", "reason", "supervisor"]

    # Ensure the json request body has all required fields
    if set(data.keys()) != set(required_fields):
        return "Error! JSON for request email does not have all fields!", 400

    # Find the user in the database
    user: User = User.objects.get(pid=session["pid"])

    # Extract variables from json request body
    try:
        student_id: int = int(data["student_id"])
    except ValueError:
        return f"Error, student ID is not a number!", 400
    
    recipient: str = data["recipient"]
    key_type: str = data["key_type"]
    description: str = data["description"]
    reason: str = data["reason"]
    supervisor: str = data["supervisor"]

    # Validate student id
    if len(str(student_id)) != 4:
        return f"Error, student ID is not four digits!", 400
    
    # Validate email
    if not re.fullmatch(email_regex, recipient):
        return f"Error, the email specified is not a valid email!", 400

    # Validate key type
    if key_type not in ("door", "display", "file_cabinet"):
        return f"Error, the key type must be door, display or file_cabinet", 400

    # Initialize a new email message
    msg = Message(
        f"Physical Key Request for: {user.pid} (Reference: {str(uuid.uuid4())[:8]})",
        sender="keymanagementsystem@cs.vt.edu",
        recipients=[recipient],
    )

    # Create email body
    body = f"""
            {user.full_name} ({user.pid}) is requesting for a key.\n
            Last 4 digits of student id: {student_id}
            Key Type: {key_type}
            Description: {description}
            Reason: {reason}
            Supervisor: {supervisor}

            To approve of this request, please contact the respective room owner and/or supervisor if applicable.\n
            Then, proceed to set up a meeting time for key exchange.
            """

    # Clean up email body
    msg.body = inspect.cleandoc(body)

    # Send the email
    mail.send(msg)

    # Report done
    return "Sucessfully sent request email", 200


@blueprint_email.route("/email/return", methods=["POST"])
def send_return_email():
    """Send an email to the administrator requesting to return a key

    Returns:
        Response: A response indicating successful email sent
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    # Get the json from the body
    data: dict = request.get_json()

    # Define the required fields for the email
    required_fields: list = ["tag_number"]

    # Ensure data has all required fields
    if set(data.keys()) != set(required_fields):
        return "Error! JSON body does not have all required fields!", 400

    # Extract variables from json request body
    tag_number = data["tag_number"]

    # Find the user in the database
    user: User = User.objects.get(pid=session["pid"])

    # Initialize a new email message
    msg = Message(
        f"Key return from: {user.pid} for key with tag {tag_number} (Request id: {str(uuid.uuid4())[:8]})",
        sender="keymanagementsystem@cs.vt.edu",
        recipients=[current_app.config["ADMIN_EMAIL"]],
    )

    # Create email body
    body = f"""
            {user.full_name} ({user.pid}) wants to return key with tag {tag_number}\n

            Please email {user.pid} with instructions to physically return the 
            key. \n

            Once returned, search for the key with tag number {tag_number} and 
            click on the "return" button. \n
            
            The ledger will automatically create an entry to record that the key was returned.
            """

    # Clean up email body
    msg.body = inspect.cleandoc(body)

    # Send the email
    mail.send(msg)

    # Report done
    return "Sucessfully sent return email", 200


@blueprint_email.route("/email/report", methods=["POST"])
def send_report_email():
    """Send an email to the administrator reporting a key

    Returns:
        Response: A response indicating successful email sent
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    # Get the json from the body
    data: dict = request.get_json()

    # Define the required fields for the email
    required_fields: list = ["tag_number", "reason"]

    # Ensure data has all required fields
    if set(data.keys()) != set(required_fields):
        return "Error! JSON body does not have all required fields!", 400

    # Extract variables from json request body
    tag_number = data["tag_number"]
    reason = data["reason"]

    # Find the user in the database
    user: User = User.objects.get(pid=session["pid"])

    # Initialize a new email message
    msg = Message(
        f"NOTICE: Key with tag {tag_number} has been reported by {user.pid} (Request id: {str(uuid.uuid4())[:8]})",
        sender="keymanagementsystem@cs.vt.edu",
        recipients=[current_app.config["ADMIN_EMAIL"]],
    )

    # Create email body
    body = f"""
            {user.full_name} ({user.pid}) has reported a key with {tag_number}\n
            Reason: {reason}

            This key will remain as unavailable. \n
            
            The ledger will automatically create an entry to record that the key was reported. \n

            If the key has been found or remade, search for the key with tag number 
            {tag_number} and click on the "return" button. \n 
            
            Then, the ledger will automatically create an entry to record that the key was returned.
            """

    # Clean up email body
    msg.body = inspect.cleandoc(body)

    # Send the email
    mail.send(msg)

    # Report done
    return "Sucessfully sent report email", 200