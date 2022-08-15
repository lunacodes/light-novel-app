# My Light Novel App

This app is an in-progress exercise, in order for me to further my React, Typescript, and Node knowledge.

Demo: [My Light Novels (Heroku App)](https://my-light-novels.herokuapp.com/)

## Running the App

You'll need to have a MongoDB and Atlas URI set up. See [MongoDB - MERN Stack Tutorial](https://www.mongodb.com/languages/mern-stack-tutorial) and [MongoDB - Get Started With Atlas](https://docs.atlas.mongodb.com/getting-started/)

**Running the App**

1. Rename `.env.sample` to `.env`
2. Fill in your `ATLAS_URI` in `.env` (you can get this via MongoDB's website)
3. Run `npm run setup` then `npm run dev` from the root directory.
4. In a 2nd terminal window, `cd client` then `npm start`. Alternately, you can combine steps 3 & 4 by running `npm run startLocal` instead of `npm run dev`

**Building the App**

In the root directory, `npm run build` then `npm start`

## Tech Stack

The current tech stack for this app is as follows:

- MERN Stack (MongoDB, Express, React, NodeJs)
- Mongoose
- Typescript
- [Kitsu API](https://kitsu.docs.apiary.io/)

## To-Do

### Client

- Generate dynamic pgs for each novel
- Add search functionality
- Create User Profile area
- Add user authentication
- Write tests
- eslint: props validation
- getNovelsRequest - n_dat - data.id is undefined

### Server

- Add search functionality to `/fetch` route
- Improve typing
- Write tests
