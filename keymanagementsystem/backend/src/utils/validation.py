"""
    Utility script for validation of user priviledges and request bodies
"""

# Import libraries
from datetime import datetime
from typing import Any

# Import flask objects
from flask import Response, current_app, session, abort, make_response

# Import schemas
# from ..schemas.key import Key #, MAX_TAG_LENGTH, MAX_SERIES_LENGTH, MAX_BUILDING_LENGTH, MAX_LOCATION_LENGTH
from ..schemas.user import User  # , MAX_FULL_NAME_LENGTH
# from ..schemas.record import Record #, MAX_TAG_LENGTH, MAX_COMMENT_LENGTH, MAX_PID_LENGTH


def validate_authenticated() -> Response:
    """Ensures that requests came from an authenticated client
    Triggers abort if client is not authenticated.
    """

    # Abort if cookie cannot be found
    if "pid" not in session:
        abort(make_response(
            "Error! Could not find username in session. Perhaps you don't have cookies or CORS enabled?", 401))

    # Get pid of client
    pid = session["pid"]

    # Abort if client is not authenticated
    if pid is None:
        abort(make_response("Error! User not authenticated", 401))

    try:
        # Try to find the user in the database
        user: User = User.objects.get(pid=pid)

    except User.DoesNotExist:
        # This should not happen because all signed-in users
        # should be in the database
        abort(make_response(
            f"Error! user with pid: {pid} not in database! Instruct this user to create an account by signing into the website with PID", 401))


def validate_authenticated_admin() -> None:
    """Ensure request came from an authenticated user with administrator+ role
    Triggers abort if client is not admistrator+ role.
    """

    # Check for authentication first (will abort if failed)
    validate_authenticated()

    # Ignore the rest if we are in development mode
    if current_app.config["ENV"] == "development":
        return

    # Get pid of client
    pid = session["pid"]

    # Find the user in the database
    user: User = User.objects.get(pid=pid)

    # Abort if user is not adminstrator+
    if user.role not in ("administrator", "sudo"):
        abort(make_response(
            "Error! User must have administrator role or higher", 403))


# def validate_key_params(param_name: str, param_value: Any):
#     """Used to validate request parameters regarding keys.
#     Triggers abort if a supplied parameters do not conform to expectations.

#     Args:
#         param_name (str): The parameter name
#         param_value (Any): The parameter value
#     """

#     # Ignore paramers that are null
#     if param_value is None:
#         return

#     # Tag Number
#     if param_name == "tag_number":
#         if isinstance(param_value, str) and not param_value.isnumeric():
#             abort(make_response(
#                 "Error! The tag number must be an integer.", 400))

#     # Series ID
#     if param_name == "series_id":
#         if len(param_value) > MAX_SERIES_LENGTH:
#             abort(make_response(
#                 f"Error, series ID can only be max of {MAX_SERIES_LENGTH} characters!", 400))

#     # Sequence ID
#     if param_name == "sequence_id":
#         if len(str(param_value)) > 4:
#             abort(make_response(
#                 "Error! The sequence id is too long! Must be less than 5 characters!", 400))
#         if isinstance(param_value, str) and not param_value.isnumeric():
#             abort(make_response(
#                 "Error! The sequence id must be an integer.", 400))

#     # Building
#     if param_name == "building":
#         if len(param_value) > MAX_BUILDING_LENGTH:
#             abort(make_response(
#                 f"Error, building can only be max of {MAX_BUILDING_LENGTH} characters!", 400))

#     # Key Type
#     if param_name == "key_type":
#         if param_value not in ("door", "display", "file_cabinet"):
#             abort(make_response(
#                 f"Error! Key type must be door, display or file_cabinet", 400))

#     # Location
#     if param_name == "location":
#         location_list: list = param_value.split(",")
#         for loc in location_list:
#             if len(loc) > MAX_LOCATION_LENGTH:
#                 abort(make_response(
#                     f"Error, each location can only be max of {MAX_LOCATION_LENGTH} characters!", 400))

#     # Is Available
#     if param_name == "is_available":
#         pass  # insert validation logic here


# def validate_user_params(param_name: str, param_value):
#     """Used to validate request parameters regarding users.
#     Triggers abort if a supplied parameters do not conform to expectations.

#     Args:
#         param_name (str): The parameter name
#         param_value (Any): The parameter value
#     """

#     # If the value is none, exit because we do not care
#     if param_value is None:
#         pass

#     # PID
#     if param_name == "pid":
#         if len(param_value) > MAX_PID_LENGTH:
#             abort(make_response(
#                 f"Error, pid can only be max of {MAX_PID_LENGTH} characters!", 400))

#     # full name
#     if param_name == "full_name":
#         if len(param_value) > MAX_FULL_NAME_LENGTH:
#             abort(make_response(
#                 f"Error, full name can only be max of {MAX_FULL_NAME_LENGTH} characters!", 400))

#     # role
#     if param_name == "role":
#         if param_value not in ("requestor", "administrator", "sudo"):
#             return f"Error, role must be requestor, administrator, or sudo!", 400

#     # owned keys
#     if param_name == "owned_keys":
#         pass  # insert validation logic here


# def validate_record_params(param_name: str, param_value):
#     """Used to validate request parameters regarding records.
#     Triggers abort if a supplied parameters do not conform to expectations.

#     Args:
#         param_name (str): The parameter name
#         param_value (Any): The parameter value
#     """

#     # If the value is none, exit because we do not care
#     if param_value is None:
#         return

#     # Tag Number
#     if param_name == "tag_number":
#         if len(param_value) > MAX_TAG_LENGTH:
#             abort(make_response(
#                 f"Error, tag number can only be max of {MAX_TAG_LENGTH} characters!", 400))

#         if isinstance(param_value, str) and not param_value.isnumeric():
#             abort(make_response(
#                 "Error! The tag number must be an integer.", 400))

#     # PID
#     if param_name == "pid":
#         if len(param_value) > MAX_PID_LENGTH:
#             abort(make_response(
#                 f"Error, pid can only be max of {MAX_PID_LENGTH} characters!", 400))

#     # Date
#     if param_name == "date":
#         try:
#             date = datetime.fromisoformat(param_value)
#         except ValueError:
#             abort(make_response("Error! Date is not in ISO format.", 400))

#     # Exchange
#     if param_name == "exchange":
#         if param_value not in ("acquired", "returned", "reported"):
#             abort(make_response(
#                 "Error! Exchange isn't be acquired, returned, reported!", 400))

#     # Comment
#     if param_name == "comment":
#         if len(param_value) > MAX_COMMENT_LENGTH:
#             abort(make_response(
#                 f"Error, comment can only be max of {MAX_COMMENT_LENGTH} characters!", 400))
