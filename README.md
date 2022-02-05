# inSite

### Hello Gamers!

Welcome to the repository for the CS407 project, **inSite**, "Where dreams come true". There are a couple things you should probably know when working on this repository.

### General Things to Know
1. New branches should be created off of `dev`. 
2. The merge sequence is `dev`&#8594;`test`&#8594;`prod`
3. The `test` branch is used for testing. Duh. Once testing is completed, you can then merge to `prod`, which is code that will be deployed
4. When trying to merge or commit to `test` or `prod`, you will need to have your changes approved by two (2) other code monkeys (contributors). Unless you're me (Chris). While I am a code monkey, since I am the repo owner, I can do whatever I want. The power has already gone to my head.
5. Please make sure your commit messages are descriptive and detailed.

All of this may be a bit of a hassle to do, but it will help us to stay organized and keep our code clean over the next few months.

### Things About the Backend
1. To run the backend in development mode, either `npm start` or `nodemon start` will do. Using nodemon is recommended as it will automatically restart the backend whenever changes are made.
2. The backend runs on port 5000.
3. In order to connect to the database, you will need to add a `config.json` file to the backend folder in your repository. the `.gitignore` file currently ignores this, as we are storing passwords for connections here, and shouldn't be pushing them to the repo.
4. To keep the backend as clean and modular as possible, the hierarchy is `router`&#8594;`controller`&#8594;`service`. The router handles routing requests to the appropriate controller. The controller handles status codes and other higher level logic. The service handles the bulk of the work and does things like accessing the database. For more information, please read [this article](https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis/).
5. There are demo files that show the current hierarchy and give examples or how things work (sidenote: Postman is recommended for testing routes, particularly anything other than a GET request).

### Things About the Frontend
1. Not much to say about this yet. Axios is fine for requests. Let's use Hooks for React instead of classes wherever we can.
2. Same as the backend, a clear file structure and organization will help things run smoother.


