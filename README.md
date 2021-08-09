# Packosphere

A community built and maintained alternative to [Atmosphere](http://atmospherejs.com). Initially created with 🖤 by [@copleykj](https://github.com/copleykj).

![https://imgur.com/aUSz9P7.png](https://imgur.com/aUSz9P7.png)

## Why

Since it's creation by [Percolate Studios](http://percolatestudio.com/), Atmosphere has been closed source and the community was unable to explore the code, fix it's bugs, or create new and awesome features. It remained in this state even after being aquired by MDG as well as Tiny's aquisiton of Meteor.

Packosphere is the realization of a dream to have an open and transparent Package explorer for Meteor packages. It's source is yours to inspect and modify and you are fully welcome to get involved with creating new innovative features or fixing it's bugs.

## Stack

- Meteor (of course)
- TypeScript
- Tailwind
- React
- Grapher

## Development

> When you first clone and run this repo, it will start to sync the Meteor package database to the local database. This will take a non trivial amount of time (from 30 minutes to upwards of 1.5 hours). You'll probably wanna go get a cup of coffee, or 3, and come back.

1. Configure editor by making sure eslint and editor-config is installed.
2. Clone this repository.

   ```sh
   git clone --recurse-submodules https://github.com/Meteor-Community-Packages/Packosphere.git
   ```

3. Create settings.json file containing an empty object

   ```sh
   echo {} > settings.json
   ```

4. Install NPM dependencies.

   ```sh
   meteor npm i
   ```

5. Start the app.

   ```sh
   npm start
   ```

## Attributions

The space helmet logo use by The Meteor Community was created by [@arggh](https://github.com/arggh)
