# Snitch

## Functional requirements

This project will provide a game live stream service accessible by everyone with a web browser. With the use of 3rd party broadcast software, streamers will be able to distribute their content to their audience. The service is free to use for everyone, where registered users either stream content or watch other users. Streamers will have the option to save previously recorded streams on their own page for users to watch later. The service works both while being signed in or not. Extra functionality is provided for users signed in, such as live chat and feed customization. Users will be able to follow other users and get notified when streamers are live.


## Technological requirements


* Angular 2.0 and TypeScript together with Bootstrap will be the choices for the front-end framework and front-end library. 
* MongoDB will be the main database of the project, storing user credentials, user customizations and followers etc. In the database video data will also be stored. MongoDB typically only allow files of maximum 4MB to be stored therefore the approach will be to chunk the video feed into several parts. This chunking process will be done automatically by an abstraction software on top of mongoDB called GridFS.
* Flask will be used to create the server API for communication between client and database.
* OAuth 2.0 will be used together with Google API for login, perhaps even Auth0.
* Sass will be used to extend CSS and hopefully contribute with some magic.


### Authors 
Sebastian Lindmark
Andreas Järvelä
