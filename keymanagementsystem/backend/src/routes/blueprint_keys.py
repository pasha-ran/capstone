"""
    Defines routes for key resource
"""

# Imports libraries
from functools import reduce

# Import flask objects
from flask import Blueprint, Response, current_app, jsonify, session, \
    request, abort, make_response

# Import mongo objects
from mongoengine.queryset.visitor import Q
from mongoengine import *

# Import schemas
from ..schemas.key import Key
from ..schemas.user import User

# Import validation
from ..utils.validation import validate_authenticated_admin

# List of possible request parameters
possible_params: list = ["tag_number", "series_id", "sequence_id",
                         "building", "key_type", "location", "is_available", "comment"]

# Define the blueprint
blueprint_keys: Blueprint = Blueprint(
    name="blueprint_keys", import_name=__name__)


# region Routes

@blueprint_keys.route("/keys", methods=["GET"])
def get_all_keys() -> Response:
    """Get all keys in the database

    Returns:
        Response: A json array of all keys in the database
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    # Get all keys in the database
    result: list = Key.objects()

    # If there was nothing in the database, return an empty list
    if not result:
        return jsonify([])

    # Finally, return the result as json
    return jsonify(result)


@blueprint_keys.route("/keys/<string:tag_number>", methods=["GET"])
def get_key(tag_number: str) -> Response:
    """Get a specific key in the database

    Args:
        tag_number (str): The tag number for the key of interest

    Returns:
        Response: A json of the specific key. Otherwise, a response
        indicating failure.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the key
        key: Key = Key.objects.get(tag_number=tag_number)

        # Return the key as json
        return jsonify(key)

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag {tag_number} does not exist!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with getting key: {e}", 400


@blueprint_keys.route("/keys/<string:tag_number>/owner", methods=["GET"])
def get_key_owner(tag_number: str) -> Response:
    """Get the owner of a specific key in the database

    Args:
        tag_number (str): The tag number for the key of interest

    Returns:
        Response: A json of the specific key's owner. Otherwise, a response
        indicating failure.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the key
        key: Key = Key.objects.get(tag_number=tag_number)

        # Next, find all owners of the key
        owned_users: list = User.objects(Q(owned_keys__in=[key]))

        # If there is at least one user who owns this key, return the (first) owner as json
        if owned_users:
            return jsonify(owned_users[0])
        
        # Else, return failure
        return f"Error! Key does not have an owner!", 404

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag {tag_number} does not exist!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with getting key: {e}", 400


@blueprint_keys.route("/keys", methods=["POST"])
def add_key() -> Response:
    """Add a key to the database

    Returns:
        Response: A response indicating whether adding the key was successful
        or not.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    # Get the json from the body
    data: dict = request.get_json()

    try:

        # Prepare tag number
        # tag_number: str = str(data["tag_number"]).strip()

        # Ensure that this key has a unique tag number
        if Key.objects(Q(tag_number=data["tag_number"])):
            return f"Error! A key with tag number {data['tag_number']} already exists!", 400

        # Ensure that this key has a unique series id and sequence id
        if Key.objects(Q(series_id=data["series_id"]) & Q(sequence_id=data["sequence_id"])):
            return f"Error! A key with series id {data['series_id']} and sequence id {data['sequence_id']} already exists!", 400

        # Build locations
        location_list = str(data["location"]).split(",")
        for index, loc in enumerate(location_list):
            location_list[index] = loc.strip()

        # Construct new key
        new_key: Key = Key(
            tag_number=str(data["tag_number"]).strip(),
            series_id=str(data["series_id"]).strip(),
            sequence_id=int(data["sequence_id"]),
            building=str(data["building"]).strip(),
            key_type=str(data["key_type"]).strip(),
            location=location_list,
            is_available=str(data["is_available"]).lower() == "true",
            comment=str(data["comment"]).strip()
        )

        # Now save it into the database
        new_key.save()

        # Report done
        tagNum = str(data["tag_number"]).strip()
        return f"Successfully added key with tag number {tagNum}", 200

    # Handle bad values
    except ValidationError as verror:
        return f"Error on updating user: {verror}. Regex errors suggest mistakenly using special characters!", 400

    # Handle dictionary key error
    except KeyError as kerror:
        return f"Error on adding key: {kerror}", 400

    # Handle type error
    except TypeError as terror:
        return f"Error on adding key: {terror}", 400

    # Catch all other errors
    except Exception as e:
        return f"Error with adding key: {e}", 400


@blueprint_keys.route("/keys/<string:old_tag_number>", methods=["PATCH"])
def update_key(old_tag_number: str) -> Response:
    """Update a specific key's properties in the database

    Args:
        tag_number (str): The tag number for the key of interest

    Returns:
        Response: A response indicating whether updating the key was successful
        or not.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    # Get the json from the body
    data: dict = request.get_json()

    try:
        # Find the key
        key: Key = Key.objects.get(tag_number=old_tag_number)

        ####################################################################################
        #delete if statements checking if in data (ex. if series_id in data)
        #keep the checks for uniqueness
        #if passing those checks, key.update(data)
        #where ever this is called, need to change parameters to pass in old tag number and new tag number
        ####################################################################################

        # Ensure that this key has a unique tag number
        # maybe add statement checking if it is the previous tag number
        if Key.objects(Q(tag_number=data["tag_number"])) and data["tag_number"] != old_tag_number:
            return f"Error! A key with tag number {data['tag_number']} already exists!", 400

        # Ensure that this key has a unique series id and sequence id
        # maybe add statement checking if it is the previous series and sequence id
        if Key.objects(Q(series_id=data["series_id"]) & Q(sequence_id=data["sequence_id"])) and key.series_id != data["series_id"] and key.sequence_id != data["sequence_id"]:
            return f"Error! A key with series id {data['series_id']} and sequence id {data['sequence_id']} already exists!", 400

        # Update tag number
        # if "tag_number" in data:
        #     # Ensure that this key has a unique tag number
        #     if Key.objects(Q(tag_number=data["tag_number"])):
        #         return f"Error! A key with tag number {data['tag_number']} already exists!", 400

        key.update(set__tag_number=str(data["tag_number"]).strip())

        # Update series id
        key.update(set__series_id=str(data["series_id"]).strip())

        # Update sequence id
        key.update(set__sequence_id=int(data["sequence_id"]))

        # Update building
        key.update(set__building=str(data["building"]).strip())

        # Update key type
        key.update(set__key_type=str(data["key_type"]).strip())

        # Update location
        if "location" in data:
            # Build locations
            location_list = str(data["location"]).split(",")
            for index, loc in enumerate(location_list):
                # Remove unnecessary elements from loc
                location_list[index] = loc.replace("[", "").replace("]", "").replace("'", "").strip()
            key.update(set__location=location_list)
        
        # Update comment
        key.update(set__comment=str(data["comment"]).strip())

        # Report done
        return f"Succesfully updated key with tag number {data['tag_number']}", 200

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag {old_tag_number} does not exist!", 404

     # Handle bad values
    except ValidationError as verror:
        return f"Error on updating key: {verror}. Regex errors suggest mistakenly using special characters!", 400

    # Handle dictionary key error
    except KeyError as kerror:
        return f"Error on updating key: {kerror}", 400

    # Handle type error
    except TypeError as terror:
        return f"Error on updating key: {terror}", 400

    # Catch all other errors
    except Exception as e:
        return f"Error with updating key: {e}", 400


@blueprint_keys.route("/keys/<string:tag_number>/return", methods=["PATCH"])
def return_key(tag_number: str) -> Response:
    """Safely return a key back to the system

    Args:
        tag_number (str): The tag number for the key of interest

    Returns:
        Response: A response indicating whether returning the key was successful
        or not.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the key
        key: Key = Key.objects.get(tag_number=tag_number)

        # We need to find all users who have this key owned
        owned_users: list = User.objects(Q(owned_keys__in=[key]))

        # If there is at least one user who owns this key, fail
        # because we cannot safely return the key
        if owned_users:
            return f"Error! Cannot return key because {owned_users[0].pid} owns this still!", 400

        # Mark the key as available
        key.update(set__is_available=True)

        # Report done
        return f"Sucessfully returned key with tag number {tag_number}", 200

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag {tag_number} does not exist!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with returning key: {e}", 400


@blueprint_keys.route("/keys/<string:tag_number>", methods=["DELETE"])
def delete_key(tag_number: str) -> Response:
    """Delete a specific key in the database

    Args:
        tag_number (str): The tag number for the key of interest

    Returns:
        Response: A response indicating whether deleting the key was successful
        or not.
    """

    # Require admin priviledges (abort if failure)
    validate_authenticated_admin()

    try:
        # Find the key
        key: Key = Key.objects.get(tag_number=tag_number)

        # We need to find all users who have this key owned
        owned_users: list = User.objects(Q(owned_keys__in=[key]))

        # Delete this key off the owned keys array for all users
        for user in owned_users:
            user.owned_keys.remove(key)  # remove the key
            user.save()                  # save user details in database

        # Now delete the key off the system entirely
        key.delete()

        # Report done
        return f"Successfully deleted key with tag number {tag_number}", 200

    # Handle key not found
    except Key.DoesNotExist:
        return f"Error! Key with tag {tag_number} does not exist!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with deleting key: {e}", 400

# endregion
