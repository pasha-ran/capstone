"""
    The schema for keys
"""

# Import mongo objects
from mongoengine import Document, ListField, StringField, IntField, BooleanField

# Restrictions
# MIN_TAG_VALUE = 1
VALID_TAG_REGEX = r"^[0-9]+[0-9.]*$"

MAX_SERIES_LENGTH = 10
VALID_SERIES_REGEX = r"^[\-a-zA-Z0-9]+$"

MIN_SEQUENCE_VALUE = 1
MAX_SEQUENCE_VALUE = 9999

MAX_BUILDING_LENGTH = 20
VALID_BUILDING_REGEX = r"^[\-a-zA-Z0-9\s]+$"

# key types can only be these
VALID_KEY_TYPES = ["Door", "Display case", "File cabinet"]

MAX_LOCATION_LENGTH = 15
VALID_LOCATION_REGEX = r"^[\-a-zA-Z0-9 ]+$"

MIN_STRING_LENGTH = 1


class Key(Document):
    """
        Defines a key document
    """

    # Needed to define the name of the collection
    # By default, it would be named "key" not "keys"
    meta = {'collection': 'keys'}

    # Fields
    tag_number = StringField(required=True, min_length=MIN_STRING_LENGTH, 
                            regex=VALID_TAG_REGEX, unique=True)

    series_id = StringField(required=True, min_length=MIN_STRING_LENGTH,
                            max_length=MAX_SERIES_LENGTH, regex=VALID_SERIES_REGEX)

    sequence_id = IntField(
        required=True, min_value=MIN_SEQUENCE_VALUE, max_value=MAX_SEQUENCE_VALUE)

    building = StringField(
        required=True, min_length=MIN_STRING_LENGTH,
        max_length=MAX_BUILDING_LENGTH, regex=VALID_BUILDING_REGEX)

    key_type = StringField(required=True, choices=VALID_KEY_TYPES)

    location = ListField(StringField(min_length=MIN_STRING_LENGTH,
                                     max_length=MAX_LOCATION_LENGTH, regex=VALID_LOCATION_REGEX), required=True)

    is_available = BooleanField(required=True)

    comment = StringField(required=False, min_length=0)