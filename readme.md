# Webpack Angularity Solution

Requisite configuration and modules to build Angularity projects with Webpack

## Angularity

[Angularity](http://angularity.github.io/) is an opinionated project structure for building applications in **AngularJS**.

This project is for use with the [Webpack](https://webpack.github.io/) implementation, and is **not** suitable for the original [Browserify-Sass Angularity](https://github.com/angularity/node-angularity/) implementation.

## Rationale

The original [Browserify-Sass Angularity](https://github.com/angularity/node-angularity/) was a global installation that included the [Karma](https://www.npmjs.com/package/karma) unit testing framework. This is **not** the case with the new [Webpack](https://webpack.github.io/) implementation.
 
Use this package, along with the [Webpack Angularity](https://github.com/angularity/webpack-angularity-solution) implementation, to unit tests Angularity projects.

## Limitations

* This package is **not** a global installation.

* This package does **not** contain [Karma](http://karma-runner.github.io/), you will need to install separately (see below).

* Favours [Teamcity](https://www.jetbrains.com/teamcity/) CI server, to the extent that it includes its reporter.

## Installation

Do **not** follow the Angularity [installation instructions](http://angularity.github.io/start/installation/).

Continue to use a Node **version manager** such as [nvm](https://github.com/creationix/nvm) for Mac, or [nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows. However you can run on **NodeJS 4.0.0**, meaning:

```
nvm install 4.0.0
nvm use 4.0.0
```

And additionally on Mac you may wish to set your default Node version:

```
nvm alias default 4.0.0
```

### Prerequisites

* Install [Karma](http://karma-runner.github.io/0.13/intro/installation.html) as a **global** package using NPM.

* Install [cross-env](https://www.npmjs.com/package/cross-env) as a **global** package using NPM, to allow you to write environment variables.

* Install [webpack-angularity-solution](https://github.com/angularity/webpack-angularity-solution) as a **local dev-dependency** in order to build the test bundle.

### Each project

#### `package.json`

Use the following dev-dependencies and scripts in your project.

```json
"scripts": {
  "test": "cross-env MYPROJECT_NO_APP=true npm run build && karma start",
  "watch-test": "cross-env MYPROJECT_KARMA_WATCH=true npm run test",
  "ci": "cross-env MYPROJECT_KARMA_REPORTER=teamcity npm run test"
},
"devDependencies": {
  "karma-angularity-solution": "latest"
}
```

Don't forget to change **`MYPROJECT`** prefix to the name of your project to avoid environment variable crosstalk.

#### `karma.config.js`

Create a Karma configuration file that delegates to the `karma-angularity-solution` package. Use options taken from the same environment variables used in your `package.json` scripts.

```javascript
/* global process:true */

module.exports = require('karma-angularity-solution')({
    port    : process.env.MYPROJECT_PORT ? (parseInt(process.env.MYPROJECT_PORT) + 1) : undefined,
    reporter: process.env.MYPROJECT_KARMA_REPORTER,
    browser : process.env.MYPROJECT_KARMA_BROWSER,
    logLevel: process.env.MYPROJECT_KARMA_LOGLEVEL
});
```

## Usage

Run the `scripts` that are defined in your `package.json` by using `npm run ...`.

For example:

* run unit tests using `npm run test`

* run unit tests using `npm run watch-test`

* run with the TeamCity reporter using `npm run ci`

### Options

* `port:int` Optional port (that overrides `angularity.json`)

* `watch:boolean` Re-run tests when there is a new build

* `reporter:string` Optional reporter name (defaults to `"spec"`)

* `browser:string` Optional browser (defaults to `"Chrome"`)

* `logLevel:string` Optional log-level (defaults to `"LOG_INFO"`)