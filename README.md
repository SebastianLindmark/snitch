# Snitch

<<<<<<< HEAD
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
=======
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
>>>>>>> chore: initial commit from @angular/cli
