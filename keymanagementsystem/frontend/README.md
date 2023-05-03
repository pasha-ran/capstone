# Frontend Documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Most of the code is thoroughly commented with Javadoc style comments.

## Important files

* All packages used throughout the project are recording in package.json and package-lock.json. That's why you can use `npm install` to stay up to date with the latest libraries that the team uses.

* The `deploy_to_cloud.ps1` script is a janky attempt to simplify the docker commands to build and push the docker images to docker hub. This may not work for users not running Windows 10/11 Pro because Powershell will not recognize the `grep` command.

Addendum to above: The deploy_to_cloud.ps1 script should generally not be used anymore, especially since the containers are hosted on gitlab as opposed to a public docker hub. See the commands on the main readme.

* index.js at the top level is technically main entry point of the React application. However, all this does is surrounds the App component with React-Router's BrowserRouter provider

* App.js is where you ideally want to focus as the REAL entry point of the React application. This file imports all of the pages, contexts and defines all of the routing. It also controls the ClientInfo context
## File structure

* All code sits in the src/ folder

* The assets folder should be used for holding image files and other graphics

* The components folder should be used to define React components that are reuseable. DO NOT USE CLASS COMPONENTS! Facebook/Meta will deprecate this soon. They prefer you use functional components and use hooks to maintain state

* The containers folder contains `pages` on the website. The idea is to use multiple components to compose a web page into a container/page (you can rename this if this bugs you)

* The contexts folder is for React Contexts [(documentation)](https://reactjs.org/docs/context.html). These are meant to serve as global variables that update state dynamically from App.js.

* The services folder defines a service layer for API calls. This makes it easier for the front-end team to make API calls without having to understand the intracies and boilerplate for the JS Fetch API. All service class functions should return a JSON like {ok: (true or false), msg: (response message or empty), data: (JSON data from response or null)}

## Relevant libraries used
* [React MUI Datatable](https://github.com/gregnb/mui-datatables)
* [React MUI Dialog](https://github.com/andrewrosss/react-mui-dialog)
* [React Router V6](https://reactrouter.com/)
* [Material UI](https://mui.com/)
* [Formik](https://formik.org/)

## Frontend specific Todos

* Authentication handling should be revisted and utilize custom hooks AND contexts. This may be the clue to solving the "Unauthorized Page" flickering issue you see throughout the website.

Many of the pages use janky methods, such as updating a counter at points in the code, as opposed to proper Hooks with useState.
