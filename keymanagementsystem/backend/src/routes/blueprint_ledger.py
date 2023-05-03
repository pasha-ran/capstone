"""
    Defines routes for ledger resource
"""

# Import libraries
from datetime import datetime
from functools import reduce
import dateutil.parser

# Import flask objects
from flask import Blueprint, Response, current_app, jsonify, session, \
    abort, make_response, request

# Import mongo objects
from mongoengine import *

# Import validation
from ..utils.validation import validate_authenticated

# Import schemas
from ..schemas.record import Record

# List of possible request parameters
possible_params: list = ["tag_number", "pid", "date", "exchange", "comment"]

# Define the blueprint
blueprint_ledger: Blueprint = Blueprint(
    name="blueprint_ledger", import_name=__name__)


# region Routes

@blueprint_ledger.route("/ledger", methods=["GET"])
def get_all_records() -> Response:
    """Get all records (restricted to adminstrator+ only)

    Returns:
        Response: A JSON array of all records in the ledger
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    # Get all records
    result: list = Record.objects()

    # If there was nothing in the database, return an empty list
    if not result:
        return jsonify([])

    # Finally, return the result as json
    return jsonify(result)


@blueprint_ledger.route("/ledger/<string:oid>", methods=["GET"])
def get_record(oid: str) -> Response:
    """Get a specific user (restricted to administrator+ only)

    Args:
        oid (str): The object id of the record of interest

    Returns:
        Response: A JSON of the record. Otherwise, a response indicating 
        failure
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    try:
        # Find the record
        record: Record = Record.objects.get(id=oid)

        # Return the record as json
        return jsonify(record)

    # Handle record not found
    except Record.DoesNotExist:
        return f"Error! Record with oid {oid} does not exist!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with getting record: {e}", 400


@blueprint_ledger.route("/ledger", methods=["POST"])
def add_record() -> Response:
    """Add a new record to the ledger (restricted to administrator+ only)

    Returns:
        Response: A response indicating whether adding a record to the ledger
        in the database was successful or not
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    # Get the json from the body
    data: dict = request.get_json()

    try:

        # Construct new record
        record: Record = Record(
            tag_number=str(data["tag_number"]).strip(),
            pid=str(data["pid"]).strip(),
            date=datetime.now(),
            exchange=str(data["exchange"]).lower().strip(),
            comment=str(data["comment"]).strip()
        )

        # Now save it to the database
        record.save()

        # Report done
        return f"Successfully added new record for key with tag {data['tag_number']} and pid {data['pid']}", 200

    # Handle bad values
    except ValidationError as verror:
        return f"Error on updating record: {verror}. Regex errors suggest mistakenly using special characters!", 400

    # Handle dictionary key error
    except KeyError as kerror:
        return f"Error on adding record: {kerror}", 400

    # Handle type error
    except TypeError as terror:
        return f"Error on adding record: {terror}", 400

    # Catch all other errors
    except Exception as e:
        return f"Error with adding record: {e}", 400


@blueprint_ledger.route("/ledger/<string:oid>", methods=["PATCH"])
def update_record(oid: str):
    """Update a specific record in the ledger in the database 
    (restricted to administrator+ only)

    Args:
        oid (str): The object id of the record of interest

    Returns:
        Response: A response indicating whether updating a record to the ledger
        in the database was successful or not
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    # Get the json from the body
    data: dict = request.get_json()

    try:
        # Find the record
        record: Record = Record.objects.get(id=oid)

        # Update tag_number
        if "tag_number" in data:
            record.update(set__tag_number=str(data["tag_number"]).strip())

        # Update pid
        if "pid" in data:
            record.update(set__pid=str(data["pid"]).strip())

        # Update date
        if "date" in data:

            # Need to find a way to still overwrite date's HH:MM:SS to
            # the current HH:MM:SS
            date_iso_str: str = str(data["date"])
            date = dateutil.parser.isoparse(date_iso_str)
            record.update(set__date=date)

        # Update exchange
        if "exchange" in data:
            record.update(set__exchange=str(data["exchange"]).strip())

        # Update comment
        if "comment" in data:
            record.update(set__comment=str(data["comment"]).strip())

        # Make sure the changes are saved to the database
        record.save()

        # Report done
        return f"Succesfully updated record from ledger with oid ${oid}", 200

    # Handle record not found
    except Record.DoesNotExist:
        return f"Error! Record with oid {oid} does not exist!", 404

    # Handle bad values
    except ValidationError as verror:
        return f"Error on updating record: {verror}. Regex errors suggest mistakenly using special characters!", 400

    # Handle dictionary key error
    except KeyError as kerror:
        return f"Error on updating record: {kerror}", 400

    # Handle type error
    except TypeError as terror:
        return f"Error on updating record: {terror}", 400

    # Catch all other errors
    except Exception as e:
        return f"Error with updating record: {e}", 400


@blueprint_ledger.route("/ledger/<string:oid>", methods=["DELETE"])
def delete_record(oid: str):
    """Delete a specific record in the ledger in the database 
    (restricted to administrator+ only)

    Args:
        oid (str): The object id of the record of interest

    Returns:
        Response: A response indicating whether deleting a record to the ledger
        in the database was successful or not
    """

    # Require authentication (abort if failure)
    validate_authenticated()

    try:
        # Find the record
        record: Record = Record.objects.get(id=oid)

        # Delete the record
        record.delete()

        # Report done
        return f"Succesfully removed record from ledger with oid ${oid}", 200

    # Handle record not found
    except Record.DoesNotExist:
        return f"Error! Record with oid {oid} does not exist!", 404

    # Catch all other errors
    except Exception as e:
        return f"Error with deleting record: {e}", 400


# endregion
