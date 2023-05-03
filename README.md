# Key Management System capstone

The key management system is a website designed to manage and record the owner of keys within a university. Ideally, this will create a uniform and automated platform to access all key data.

I have removed certain files and past documentation in the interest of security and privacy. If you have any questions or concerns, please contact me at pasha.ranak@gmail.com

As this repo was used for a university project, it should NOT be used in any other academic assignment as code here could be picked up by plagiarism detectors.

****************************************************

## Contributors

* Maheer Aeron
* Nikita Patel
* Joel Anglister
* Nahom Atsbeha
* Omar Kalbouneh 
* Kirsten Chesley 
* Ryan Dyke
* Haylin Kwok
* Pasha Ranakusuma


## Getting Started
### Setting up SSH keys

Click [this guide](https://docs.github.com/en/enterprise-server@3.1/authentication/connecting-to-github-with-ssh) to setup an SSH key for your github account. Skip to [this](https://docs.github.com/en/enterprise-server@3.1/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) if you already have an SSH keypair generated.


### Installing required programs (you may want to use newer versions by the time you read this and update the readme)

* [Node.js](https://nodejs.org/en/)
* [Python 3.10.2](https://www.python.org/downloads/)
* [VSCode](https://code.visualstudio.com/download)

### Recommended VS Code Extensions

* [Python linting and language support](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
* [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
* [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)
* [Gitlens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
* [React Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

### Setup Repo
1. Clone the repo using `git clone git@github.com:maheeraeron/keymanagementsystem.git`

### Setup Backend
1. Navigate to `backend` directory
2. Install virtualenv ``pip install virtualenv``. Prevents bloating/overwriting of current packages
3. Create virtual environment
  - Windows:
    ```
    python -m venv venv    
    ```
  - macOS/linux:
    ```
    python3 -m venv venv
    ```
4. Create virtual environment
  - Windows:
    ```
    ./venv/Scripts/activate 
    ```
  - macOS/linux:
    ```
    source venv/bin/activate
    ```
 5. Install dependencies `pip install -r requirements.txt`

### Setup frontend
1. Navigate to `frontend` directory
2. Install node packages ``npm install`` (Note: this installs from packages.json, which gets updated every time you install a new package)

You will likely need to develop outside of RLOGIN and on your local environment instead, since RLOGIN will not let you install or use the pip command, usually. Having a linux terminal via WSL2 will be useful.

## Development workflow

### Starting frontend
1. Open a new terminal in VS code
2. Navigate to frontend directory
3. Run `npm start`

### Starting backend
1. Open another terminal in VS code
2. Navigate to backend directory
3. Run virtual environment
  - Windows:
    ```
    ./venv/Scripts/activate 
    ```
  - macOS/linux:
    ```
    source venv/bin/activate
	```
4. Navigate to src directory
5. Run `flask run` 
//flask run will only work if there is a app.py or wsgi.py in the same folder. So you may need to run it in the backend directory or other folder which contains that.

## Getting access to the website

* Go to https://keymanagement.discovery.cs.vt.edu/home to see the website in production, you will need a PID to log in.
* To see the website locally, use `npm start` as described above (note that only the frontend on your localhost will update, see how to update the backend below)

## Changing roles

* When you first log into the website, your initial role will be `requestor`. You'll want to set your role as `administrator` or `sudo` to see most of the features offered. To do so, follow the following steps:

1. Log in to cloud.cs.vt.edu (Using your CS account credentials)
2. Click on `discovery` and then `Project: keymanagementsystem`
3. Click on `database`
4. Click on the 3 dots in the top right, then click `Execute Shell`
5. From there, use the following commands:

  a. mongosh

  b. use keymanagementdb

  c. show collections (use this to show all the databases)

  d. db.users.find() (use this command to see a list of all users)

  e. db.users.updateOne({pid: '<pid>'}, {$set: {role: '<role>'}}) (pid and role are in quotes)
  

If you do not have access to the keymanagement namespace on cs cloud, you will need to contact a prior project member or professor.
## Deploying to Cloud

* To deploy to cloud, follow these steps (used to update backend, but can also be used to update the frontend on https://keymanagement.discovery.cs.vt.edu/home)

* Deploying the backend:
1. Install Docker Desktop and have it running in the background (must also install wsl 2)
2. In your terminal, navigate to the `backend` directory
3. Use the following commands:

  a. docker login container.cs.vt.edu (If it asks for credentials, use your CS account credentials)

  b. docker build -t (image name) . (For the backend, the image name is container.cs.vt.edu/maheeraeron/keymanagementsystem/flask-api:latest. Make sure to include that last period in the command.)

  c. docker push (image name)

4. Go to cloud.cs.vt.edu
5. Click on `discovery`, then 'discovery' again on the top panel, and then `Project: keymanagementsystem`
6. Click on `keymanagement-webapi` (note the image name under `Image:`)
7. Click on the 3 dots in the top right, then click `Redeploy`

* Your backend changes should now be reflected when you run local host
* For frontend, use the same steps, navigating to the `frontend` directory and using the image name on the frontend (which can be found under `keymanagement-website`)

The images are hosted privately on container.cs.vt.edu. To see them, go to "packages and registries" > "container registry" on your project page. This will show the two containers we use. flask-api and react-app. These are pointed to and accessed by cs.cloud.vt.edu. For more info, checkout the wiki (https://wiki.cs.vt.edu/wiki/Howto::Docker_Registry) or contact the CS cloud admin listed below.

## Important notes

* Arguably, for the potential that this project has in becoming a critical service for Virginia Tech, this is not an easy project.
For the sake of time constraints, it is recommended that those coming to this project have a decent amount of experience 
with MongoDB, React (for frontend), Flask (for WebAPI), and Node.JS (as the application server)

* I recommend you brush up on your systems design knowledge and other web design fundamentals. These include solid understanding about kubernetes clusters, docker containerization, reverse proxies,
load balancers, persistent volumes, Cross Origin Resource sharing restrictions, REST APIs, etc.

* Use `process.env.REACT_APP_API_URL` in React whenever you are specifying the API endpoint. You can check the .env file and change it to what you have if you like. 

* Using the backend on local development will not work. CAS authentication requires that the backend is hosted on a vt.edu address. [(Read this for a potential workaround?)](https://www.middleware.vt.edu/sso/cas.html)

* The frontend, backend and database are each hosted as separate workload pods in the CS cloud. They are working under the discovery kubernetes cluster under the `keymanagement` namespace.

* DO NOT push to master unless we have all agreed to merge.

* Consider doing 1 week sprints. For a critical service like this, it is difficult to always meet the user's needs. You should maintain frequent contact with the client and demonstrate different features so that you all can work together to accuratley target their needs.

* Be ready for surprise requirements. Software is an iterative process and it is never finished. The best way to handle this project is prioritize communication and frequent meetings.

*To assist in development, ask Jeanette for the most recent copy of the Dean's Key Log excel file. Having it will let you have real data to test on.

## Semester 2 HelpSession / Q+A with Maheer.

We edit the mongo in the first video.

https://youtu.be/wB9f0s9tb_g

https://youtu.be/0Mj8TILVYKQ

## TODO (ordered by priority -- start from top down)

* Setup a CI platform so that pushes to master can automatically, build, test and deploy to the CS cloud. This will save tremendous time.

* Setup production Dockerfiles for both the front-end and backend. Suggestions are to use a Web Server software like Nginx or Apache for serving the built files on both ends.

* Consider changing the backend framework to a stricter, opinionated, scaleable framework like ASP.NET or Django.

* Fix date bug when a new record is made but a day is added (known javascript issue)

* Make edit profile page look pretty

* Show detailed descriptions whenever bad input occurs

* Allow data tables to export to XLSX instead of CSV

* Come up with a plan to have all departments in the COE conform to a uniform schema for representing their key data. This will take a majority of your time.

