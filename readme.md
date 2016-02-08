# Karma Angularity Solution

Requisite configuration and modules to test Angularity projects with Karma

## Angularity

[Angularity](http://angularity.github.io/) is an opinionated project structure for building applications in **AngularJS**.

This project is for use with the [Webpack](https://webpack.github.io/) implementation, and is **not** suitable for the original [Browserify-Sass Angularity](https://github.com/angularity/node-angularity/) implementation.

## Rationale

The original [Browserify-Sass Angularity](https://github.com/angularity/node-angularity/) was a global installation that included the [Karma](https://www.npmjs.com/package/karma) unit testing framework. This is **not** the case with the new [Webpack](https://webpack.github.io/) implementation.

Use this package, along with the [Webpack Angularity](https://github.com/angularity/webpack-angularity-solution) implementation, to unit tests Angularity projects.

## Limitations

* This package is **not** a global installation. You need to install as a development dependency in every single project you wish to build.

* This package does **not** contain [Karma](http://karma-runner.github.io/), you will need to install separately (see below).

* This package presumes [npm scripts](https://docs.npmjs.com/misc/scripts). If you want to run outside of scripts you will need some additional global installs (see below).

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

Now install this package as a **local dev-dependency**.

```
npm install --save-dev karma-angularity-solution
```

### Co-requisites

Install [webpack-angularity-solution](https://github.com/angularity/webpack-angularity-solution) as a **local dev-dependency** in order to build the test bundle.

```
npm install --save-dev webpack-angularity-solution
```

Note that you do **not** need any global installs if you only use [npm scripts](https://docs.npmjs.com/misc/scripts). But if you operate outside of npm scripts you will find that you are missing [Karma](http://karma-runner.github.io/0.13/intro/installation.html), and [cross-env](https://www.npmjs.com/package/cross-env) as global installs.

### Each project

#### `package.json`

Use the following dev-dependencies and scripts in your project.

```json
{
  "scripts": {
    "test": "cross-env MODE=test npm run build && karma start",
    "ci": "cross-env KARMA_REPORTER=teamcity MODE=test npm run build && karma start"
  },
  "devDependencies": {
    "webpack-angularity-solution": "latest"
    "karma-angularity-solution": "latest"
  }
}
```

Some explanation:

* **cross-env**

	Any setting passed to `cross-env` corresponds to environment variables. By convention they are `UPPERCASE`. These environment variables are private to the executable that follows so you don't need to worry about name conflicts across different projects.

#### `karma.conf.js`

Create a Karma configuration file that delegates to the `karma-angularity-solution` package. Use options taken from the same environment variables used in your `package.json` scripts.

```javascript
/* global process:true */

module.exports = require('karma-angularity-solution')(process.env);
```

Some explanation:

* **Options by `process.env`**

	This `process.env` may be passed in entirety. The solution will automatically convert any upper-case option `SOME_OPTION` to camel-case `someOption` and parse strings to the correct type. Note however that Array parsing is **not** supported.

## Usage

Run the `scripts` that are defined in your `package.json` by using `npm run ...`.

For example:

* run unit tests using `npm run test`

* run with the TeamCity reporter using `npm run ci`

### Options

* `port:int` Optional port (that overrides `angularity.json`)

* `reporter:string` Optional reporter name, or Array thereof (defaults to `"spec"`)

* `browser:string` Optional browser, or Array thereof (defaults to `"Chrome"`)

* `logLevel:string` Optional log-level (defaults to `"LOG_INFO"`)