# betajs-scoped 0.0.12
[![Build Status](https://api.travis-ci.org/betajs/betajs-scoped.svg?branch=master)](https://travis-ci.org/betajs/betajs-scoped)
[![Code Climate](https://codeclimate.com/github/betajs/betajs-scoped/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-scoped)
[![npm version](https://img.shields.io/npm/v/betajs-scoped.svg?style=flat)](https://www.npmjs.com/package/betajs-scoped)

BetaJS-Scoped is a small module for scoped loading of modules and dependencies.



## Getting Started


You can use the library in the browser, in your NodeJS project and compile it as well.

#### Browser

```javascript
	<script src="betajs-scoped/dist/scoped.min.js"></script>
``` 

#### NodeJS

```javascript
	var Scoped = require('betajs-scoped/dist/scoped.js');
```

#### Compile

```javascript
	git clone https://github.com/betajs/betajs-scoped.git
	npm install
	grunt
```



## Basic Usage


```javascript
(function () {

var Scoped = this.subScope();

Scoped.binding("module", "global:MyLibrary");
Scoped.binding("dependency1", "global:ExternalDependency1");
Scoped.binding("dependency2", "global:ExternalDependency2");

// Library code

}).call(Scoped);
```

```javascript
Scoped.require(['ns1:dependency1', 'ns2:dependency2', 'ns3:dependency3'], function (D1, D2, D3) {
    // Execute once D1, D2, D3 are resolved.
});

Scoped.define('ns:module', ['ns1:dependency1', 'ns2:dependency2', 'ns3:dependency3'], function (D1, D2, D3) {
    // Execute once D1, D2, D3 are resolved.
    return {
        // Return ns:module definition.
    };
});

Scoped.extend('ns:module', ['ns1:dependency1', 'ns2:dependency2', 'ns3:dependency3'], function (D1, D2, D3) {
    // Execute once D1, D2, D3 are resolved.
    return {
        // Return ns:module extension.
    };
});
```


## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [http://betajs.com](http://betajs.com) |
| Git        | [git://github.com/betajs/betajs-scoped.git](git://github.com/betajs/betajs-scoped.git) |
| Repository | [http://github.com/betajs/betajs-scoped](http://github.com/betajs/betajs-scoped) |
| Blog       | [http://blog.betajs.com](http://blog.betajs.com) | 
| Twitter    | [http://twitter.com/thebetajs](http://twitter.com/thebetajs) | 



## Compatability
| Target | Versions |
| :----- | -------: |
| Firefox | 4 - Latest |
| Chrome | 15 - Latest |
| Safari | 4 - Latest |
| Opera | 12 - Latest |
| Internet Explorer | 6 - Latest |
| Edge | 12 - Latest |
| iOS | 7.0 - Latest |
| Android | 4.0 - Latest |
| NodeJS | 0.10 - Latest |


## CDN
| Resource | URL |
| :----- | -------: |
| scoped.js | [http://cdn.rawgit.com/betajs/betajs-scoped/master/dist/scoped.js](http://cdn.rawgit.com/betajs/betajs-scoped/master/dist/scoped.js) |
| scoped.min.js | [http://cdn.rawgit.com/betajs/betajs-scoped/master/dist/scoped.min.js](http://cdn.rawgit.com/betajs/betajs-scoped/master/dist/scoped.min.js) |


## Unit Tests
| Resource | URL |
| :----- | -------: |
| Test Suite | [Run](http://rawgit.com/betajs/betajs-scoped/master/tests/tests.html) |




## Main Contributors

- Oliver Friedmann

## License

Apache-2.0







