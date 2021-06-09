# InvestApp
This a a decision-making task that involves trust. Two or more players are place in a scenario where they can choose to invest a certain amount in each 'day' of the game. If they make an individual investment, they will receive double what they put in. If they choose to contribute to the group investment then each group member receives the sum of all individual contributions (e.g., if there are two players and one makes a $15 contribution and the other a $40 contribution then both players receive $55). The goal is to be the player with the most money at the end. The task uses ideas from [game theory](https://en.wikipedia.org/wiki/Game_theory) to explore trust.

## Fork
This project is a fork of [@ryantantiern](https://github.com/ryantantiern)'s [day-trader](https://github.com/ryantantiern/day-trader) project. This is an Angular-based web application based on the [MEAN](https://en.wikipedia.org/wiki/MEAN_(solution_stack) stack.

The project has been moved from Angular 4 to Angular 12. Significant rewriting and reorganisation has taken place, especially moving aspects of the code to [async/await](https://javascript.info/async-await).

## App environment setup
The project includes `client-settings.js.default` and `ecosystem.config.js.default` in the root directory. These are empty templates that you will need to provide environment variables to, dropping the `.default` that has been appended to them. `client-settings.js` will be required for all configurations of the application. `ecosystem.config.js` can be ingested by the [PM2] process manager.

The `.gitignore` file is set-up to ignore `client-settings.js` and `ecosystem.config.js` files to avoid credential leakage. You might need to adjust this for your deployment scenario. As the application makes use of environment variables, you will _not_ be able to run it 'out of the box'. You must complete `client-settings.js` and you will need to ensure that the environment variables specified in `ecosystem.config.js` are provided by some means (whether by PM2, some other process manager or your environment more generally).

## External required tools
You'll need to create an application on [pusher.com](https://pusher.com/) for message passing. The free account is fine. You'll need various API parameters from this.
You'll need to have a MongoDB instance to talk to. This can be hosted on the same machine, or elsewhere. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free account will provide enough storage. You'll need to provide the connection string for the database you've set up as an environment variable.

## Heroku
The application has been successfully deployed on [Heroku](https:///www.heroku.com)'s free tier. These are the environment variables that you must set for it to start successfully (this goes for Heroku, but also any other hosting environment):

```
HOSTNAME (i.e., your Heroku URL)
MONGODB_URI (i.e., a connection string for a MongoDB instance)
PORT (that you want to serve on – note Heroku will serve at port 443. Choose a port > 1024)
PUSHER_APP_ID (For the pusher service)
PUSHER_CLUSTER (as above)
PUSHER_KEY (as above)
PUSHER_SECRET (as above) 
```
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build. (You will want a production build for anything but development.)

## Tests
Test infrastructure is in place, but no substantive tests are written. `ng test` therefore does nothing of consequence.
