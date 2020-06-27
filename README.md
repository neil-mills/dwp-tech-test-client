# DWP Technical Test

## Client

### Approach

I have wrapped the REST API with GraphQL to create a single query `londonUsers` which returns users either living in London or within a 50 mile proximity to London.

As it was not a requirement of the test to use a JS Framework, I have created a single `app.ts` file which queries my GraphQL API using Apollo Client and then renders the user data response to the page.

### Tech Choices

- I have used Apollo Client to handle data fetching from my GraphQL API.
- I have chosen to use Typescript over Javascript.
- For testing I have used the Jest library.
- I have used SCSS for styling.
- I have used Webpack to bundle my project

### Launching the dev app.

Running `npm run start` spins up the app on port 8000 in development mode.

### Testing

Run `npm run test` or `npm run test:coverage`

### GraphQL API

The API repo is at at https://github.com/neil-mills/dwp-tech-test-server

### Hosted application

The application has been deployed to Heroku at https://dwp-tech-test.herokuapp.com/