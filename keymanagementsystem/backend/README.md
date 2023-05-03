# Backend Documentation

The backend was built using Flask, which is a microframework for building web applications. 

WARNING: As a microframework, flask is very limited. There is no strict opinions on how to structure and organize your code, but this is a double edged sword. Scalability for multiple resources becomes a major issue, and Python is not the best language for strict type checking. 

I suggest switching to Django for an opinionated structure, or better yet, ASP.NET for strict type checking and scalability. ASP.NET is an industry standard and you can use Apero CAS for CAS authentication instead (officially supported from VT Middleware Services).

MongoDB is used as our database. However, given the complexity and strict requirements for this project, migrating to a strict relational database like SQL may be a better fit!

## Important files

* `wsgi.py` is the main entry point for this application. It creates an instance of the Flask app from `src/init.py`, which utilizes the `factory` design pattern for rapidly switching between development and production versions of the API.

* `config.py` contains configuration settings that the app will use. The base `Config` class initializes the base configurations. The child `ProductionConfig`, `DevelopmentConfig` and `TestingConfig` is where you can define specific environment variables based on the respective build mode.

* For `config.py`, during development, you may want to go into `DevelopmentConfig` and switch the MongoDB host to `localhost`. In the CS cloud, the IP address for the database is automatically referred to as `database`.

* Also, for `config.py`, the ADMIN_EMAIL is set to `test@test.com`. This is to prevent unnecessary spamming to an administrator until this project is picked up again.

-> Addendum to above. That is not strictly true. The admin email can be updated on the website without adjusting the config.py. see the methods provided in blueprint_email

* The `deploy_to_cloud.ps1` script is a janky attempt to simplify the docker commands to build and push the docker images to docker hub. This may not work for users not running Windows 10/11 Pro because Powershell will not recognize the `grep` command.

* `requirements.txt` is absolutely necessary. It serves a similar function to `package.json` in that it defines the third party dependencies used for the backend.


## File structure
* The rest of the code sits in the  src/ 

* The routes folder contains Flask Blueprint objects, which define API routes to access and manipulate specific resources throughout the system. IMPORTANT: Please follow RESTful API naming conventions [(guide)](https://restfulapi.net/resource-naming/)

* The schemas folder contains files that model objects in our database. Each file is named after a singular-noun of the corresponding collection in MongoDB (except for record.py, read the code to find out more)

* The utils folder contains utility scripts that may be useful for the project. This also includes a `db_setup_keys.py` file which is separate, standalone module used for creating an inital collection of Key documents in mongo db. You'll want to export the Mongo data by creating a dumps file [(how to use mongodump)](https://www.mongodb.com/docs/database-tools/mongodump/). You'll then want to use `kubectl cp` to copy these to the database container in the cloud. (Alternative is to install VIM in the WebAPI container to edit this file appropriately, then you can write the key data directly to the database).


## Coding Tips
* Python does not enforce type checking. This can get very annoying for a large scale project which is why I still suggest switching to something like ASP.NET. To get around this, make sure all variables and functions are type annotated as best as you can.

* Refer to some of the functions in the blueprint_* files in routes/ to see proper function documentation. Python has a very different style for documenting functions compared to OO-styled languages like Java and C#.

Users in the database are created automatically when a person signs in with their PID for the first time, or when an ADMIN manually creates a user. Since, some people cannot be asked to sign in or some users might not have a pid, anticipate that many users will need to be manually created.

## Useful resources
* [Cloud quickstart](https://wiki.cs.vt.edu/wiki/Cloud_Quickstart)
