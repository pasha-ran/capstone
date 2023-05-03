"""
    The schema for a user
"""

# Import mongo objects
from mongoengine import Document, ListField, StringField, ReferenceField

# Import schemas
from .key import Key


# Restrictions
MIN_PID_LENGTH = 3  # based on NIS policy
#MAX_PID_LENGTH = 17 # based on NIS policy
MAX_PID_LENGTH = 320 # Set to this, to include long emails for mock pid

MIN_FULL_NAME_LENGTH = 1
MAX_FULL_NAME_LENGTH = 60

VALID_FULL_NAME_REGEX = r"^[a-zA-Z\s]+$"
VALID_ROLES = ["requestor", "administrator",
               "sudo"]



class User(Document):
    """
        Defines a User document
    """

    # Needed to define the name of the collection
    # By default, it would be named "User" not "Users"
    meta = {'collection': 'users'}

    # Fields

    pid = StringField(required=True, min_length=MIN_PID_LENGTH, max_length=MAX_PID_LENGTH)

    full_name = StringField(required=True, min_length=MIN_FULL_NAME_LENGTH,
                            max_length=MAX_FULL_NAME_LENGTH, regex=VALID_FULL_NAME_REGEX)

    role = StringField(required=True, choices=VALID_ROLES)

    owned_keys = ListField(ReferenceField(Key), required=False)
