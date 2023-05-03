#!/usr/bin/env python3

# System imports
import sys
sys.path.insert(1, "../")

# Other imports
import csv
from schemas.key import Key
from mongoengine import connect


# Methods

def build_db_from_csv(filename: str) -> list:
    """
        Reads a csv file and returns a list of
        Key objects
    """

    # The list of keys
    result: list = []

    # Tag number counter
    tag_count = 1

    # Parse CSV
    with open(filename, "r", newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:

            # Prepare fields
            tag_number: str = tag_count
            series_id: str = row["series_id"]
            sequence_id: int = int(row["sequence_id"])
            building: str = row["building"]
            key_type: int = row["key_type"]
            location: list = row["location"].split("/")
            is_available: bool = True

            # Create new key object
            key: Key = Key(
                tag_number = tag_number,
                series_id = series_id,
                sequence_id = sequence_id,
                building = building,
                key_type = key_type,
                location = location,
                is_available = is_available
            )

            # Append to list
            result.append(key)

            # Increment tag number count
            tag_count = tag_count + 1
    
    return result


# main code
if __name__ == "__main__":

    # Setup database connection
    connect(db="keymanagementdb", host="localhost", port=27017)

    # Build key list
    key_list: list = build_db_from_csv("csv_files/working_set.csv")  

    # Get size of the key list
    print(len(key_list))

    # Insert all keys
    for key in key_list:
        key.save()  # calling save will add the document to the "keys" collection
    