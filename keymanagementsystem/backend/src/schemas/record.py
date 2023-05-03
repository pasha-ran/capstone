"""
    The schema for a record
"""

# Import libraries
from datetime import datetime

# Import mongo objects
from mongoengine import Document, IntField, DateTimeField, StringField

# Import schemas
from .key import MIN_STRING_LENGTH, VALID_TAG_REGEX
from .user import MIN_PID_LENGTH, MAX_PID_LENGTH

# Restrictions
MAX_COMMENT_LENGTH = 240
VALID_EXCHANGES = ["acquired", "returned", "reported"]  # exchanges can only be these

class Record(Document):
    """
    Defines a record document in the ledger
    """

    # Needed to define the name of the collection
    # By default, it would be named "Record" not "ledger"
    meta = {"collection": "ledger"}

    # Fields

    # In a record, this doesn't need to be unique
    # tag_number = IntField(required=True, min_value=MIN_TAG_VALUE, max_value=MAX_TAG_VALUE)
    tag_number = StringField(required=True, min_length=MIN_STRING_LENGTH, 
                            regex=VALID_TAG_REGEX)

    pid = StringField(required=True, min_length=MIN_PID_LENGTH, max_length=MAX_PID_LENGTH)

    date = DateTimeField(required=True, default=datetime.now())

    exchange = StringField(required=True, choices=VALID_EXCHANGES)

    comment = StringField(required=True, max_length=MAX_COMMENT_LENGTH)
