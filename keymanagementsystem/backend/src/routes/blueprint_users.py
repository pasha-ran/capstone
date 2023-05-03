"""
    Defines routes for user resource
"""

# Import flask objects
from flask import Blueprint, current_app, jsonify, session, abort, \
    make_response, request, Response

# Import mongo objects
from mongoengine.queryset.visitor import Q
from mongoengine import *

# Import schemas
from ..schemas.user import User
from ..schemas.key import Key

# Import validation
from ..utils.validation import validate_authenticated_admin, \
    validate_authenticated

# Define the blueprint
blueprint_users: Blueprint = Blueprint(
    name="blueprint_users", import_name=__name__)


# region Routes


@blueprint_users.route("/users", methods=["GET"])
def get_all_users() -> Response:
    """Get all users (restricted to adminstrator+ only)

    Returns:
        Response: A JSON array of all users
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    # Get all users
    result: list = User.objects()

    # If there was nothing in the database, return an empty list
    if not result:
        return jsonify([])

    # Finally, return the result as json
    return jsonify(result)


@blueprint_users.route("/users/<string:pid>", methods=["GET"])
def get_user(pid: str) -> Response:
    """Get a specific user (restricted to administrator+ only)

    Args:
        pid (str): The pid for the user of interest

    Returns:
        Response: A JSON of the user. Otherwise, a response indicating failure
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the user
        user: User = User.objects.get(pid=pid)

        # Return the user as json
        return jsonify(user)

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with pid: {pid} does not exist in database! Instruct this user to create an account by logging into the website with their PID.", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with getting user: {e}", 400

@blueprint_users.route("/users/name/<string:full_name>", methods=["GET"])
def get_user_by_name(full_name: str) -> Response:
    """Get a specific user (restricted to administrator+ only)

    Args:
        full_name (str): The full name

    Returns:
        Response: A JSON of the user. Otherwise, a response indicating failure
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the user
        user: User = User.objects.get(full_name=full_name)

        # Return the user as json
        return jsonify(user)

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with full_name: {full_name} does not exist in database!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with getting user: {e}", 400


@blueprint_users.route("/users", methods=["POST"])
def add_user() -> Response:
    """Add a user to the database

    Returns:
        Response: A response indicating whether adding the user was
        successfully created.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    # Get the json from the body
    data: dict = request.get_json()

    try:

        # Prepare pid
        pid: str = str(data["pid"]).strip()

        # Ensure that this user has a unique pid
        if User.objects(Q(pid=pid)):
            return f"Error! A user with pid {pid} already exists!", 400

        # Construct new user
        new_user: User = User(
            pid=pid,
            full_name=str(data["full_name"]),
            role=str(data["role"])
        )

        # Now save it into the database
        new_user.save()

        # Report done
        return f"Successfully added user with pid {pid}", 200

    # Handle bad values
    except ValidationError as verror:
        return f"Error on updating user: {verror}. Regex errors suggest mistakenly using special characters!", 400

    # Handle dictionary key error
    except KeyError as kerror:
        return f"Error on adding user: {kerror}", 400

    # Handle type error
    except TypeError as terror:
        return f"Error on adding user: {terror}", 400

    # Catch all other errors
    except Exception as e:
        return f"Error with adding user: {e}", 400


@blueprint_users.route("/users/<string:pid>", methods=["PATCH"])
def update_user(pid: str) -> Response:
    """Update a specific user

    Args:
        pid (str): The pid for the user of interest

    Returns:
        Response: A response indicating whether updating the user's details
        was successful or not
    """

    # Require authentiation (abort if failure)
    validate_authenticated()

    # Ensure pid was specified
    if pid == "":
        return "Error! PID is empty.", 400

    # Get the json from the body
    data = request.get_json()

    try:
        # Find the user in the database
        user: User = User.objects.get(pid=pid)

        # Update role
        if "role" in data:
            role: str = str(data["role"]).lower().strip()
            user.update(set__role=role)

        # Update full name
        if "full_name" in data:
            full_name: str = str(data["full_name"]).strip()
            user.update(set__full_name=full_name)

        # Report done
        return f"Sucessfully updated user with pid {pid}", 200

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with pid: {pid} does not exist in our database!  Instruct this user to create an account by logging into the website with their PID.", 404

    # Handle bad values
    except ValidationError as verror:
        return f"Error on updating user: {verror}. Regex errors suggest mistakenly using special characters!", 400

    # Handle dictionary key error
    except KeyError as kerror:
        return f"Error on updating user: {kerror}", 400

    # Handle type error
    except TypeError as terror:
        return f"Error on updating user: {terror}", 400

    # Catch all other errors
    except Exception as e:
        return f"Error with updating user: {e}", 400


@blueprint_users.route("/users/<string:pid>", methods=["DELETE"])
def delete_user(pid: str) -> Response:
    """Delete a specific user (restricted to administator+ only)

    Args:
        pid (str): The pid for the user of interest

    Returns:
        Response: A response indicating whether deleting the user was
        successful or not
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the user
        user: User = User.objects.get(pid=pid)

        # Delete the user
        user.delete()

        # Report done
        return f"Sucessfully deleted user with pid {pid}", 200

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with pid: {pid} does not exist in our database!  Instruct this user to create an account by logging into the website with their PID.", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with deleting user: {e}", 400


@blueprint_users.route("/users/<string:pid>/keys", methods=["GET"])
def user_get_keys(pid: str) -> Response:
    """Get a specific user's keys

    Args:
        pid (str): The pid for the user of interest

    Returns:
        Response: A JSON array of the user's keys
    """

    # Require authentiation (abort if failure)
    validate_authenticated()

    try:
        # Find the user
        user: User = User.objects.get(pid=pid)

        # If the user has no keys, return an empty list.
        # Otherwise, return what they have
        if user.owned_keys == None or len(user.owned_keys) == 0:
            return jsonify([])
        else:
            return jsonify(user.owned_keys)

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with pid: {pid} does not exist in our database!  Instruct this user to create an account by logging into the website with their PID.", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with getting user keys: {e}", 400


@blueprint_users.route("/users/name/<string:full_name>/keys", methods=["GET"])
def user_get_keys_by_name(full_name: str) -> Response:
    """Get a specific user's keys

    Args:

    Returns:
        Response: A JSON array of the user's keys
    """

    # Require authentiation (abort if failure)
    validate_authenticated()
    # console.log("Hi")
    try:
        # Find the user
        user: User = User.objects.get(full_name=full_name)

        # If the user has no keys, return an empty list.
        # Otherwise, return what they have
        
        if user.owned_keys == None or len(user.owned_keys) == 0:
            return jsonify([])
        else:
            return jsonify(user.owned_keys)

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with name: {full_name} does not exist in our database!", 404

    # Catch all other errors
    except Exception as e:
        mult =  User.objects.get(full_name=full_name).values()
        return f"Multiple users with that name: {mult}. Error: {e}", 400


@blueprint_users.route("/users/<string:pid>/keys/<string:tag_number>", methods=["POST"])
def user_add_key(pid: str, tag_number: str) -> Response:
    """Add a key for a specific user (restricted to adminstrator+)

    Args:
        pid (str): The pid for the user of interest
        tag_number (str): The tag number of the key to add

    Returns:
        Response: A response indicating whether adding a key to the user
        was successful or not
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:

        # Find the user
        user: User = User.objects.get(pid=pid)

        # Find the key
        key: Key = Key.objects.get(tag_number=tag_number)

        # Do not add the key if they already own it
        if key in user.owned_keys:
            return f"Error! {pid} already owns this key!", 400

        # Ensure they key was even available
        if not key.is_available:
            return f"Error! Tried to assign {pid} to key with tag number {tag_number} but it isn't available!", 400

        # Update the key state to false
        key.update(set__is_available=False)

        # Add the key to the user
        user.update(push__owned_keys=key)

        # Report done
        return f"Sucessfully added key with tag {tag_number} for user with pid {pid}", 200

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with pid: {pid} does not exist in our database!  Instruct this user to create an account by logging into the website with their PID.", 404

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag: {tag_number} does not exist in our database!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with adding key to user: {e}", 400


@blueprint_users.route("/users/<string:pid>/keys/<string:tag_number>", methods=["DELETE"])
def user_remove_key(pid: str, tag_number: str):
    """Removes a key for a specific user

    Args:
        pid (str): The pid for the user of interest
        tag_number (str): The tag number of the key to add

    Returns:
        Response: A response indicating whether removing a key from the user
        was successful or not
    """

    # Require authentiation (abort if failure)
    validate_authenticated()

    try:

        # Find the user
        user: User = User.objects.get(pid=pid)

        # Find the key
        key: Key = Key.objects.get(tag_number=tag_number)

        # Error if the user doesn't own this key
        if key not in user.owned_keys:
            return f"Error, the key you specified is not owned by the user!", 400

        # Remove the key from the user
        user.update(pull__owned_keys=key)

        # Make sure the changes are saved to the database
        user.save()

        # Report done
        return f"Sucessfully removed key with tag number {tag_number} from user with pid {pid}", 200

    # Handle user not found
    except User.DoesNotExist:
        return f"Error! User with pid: {pid} does not exist in our database! Instruct this user to create an account by logging into the website with their PID.", 404

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag: {tag_number} does not exist in our database!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with removing key from user: {e}", 400

# endregion
