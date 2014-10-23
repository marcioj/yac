# YAC

> Yet another javascript class inheritance library

[![Build Status][travis_badge]][travis]

# Instalation

## Browser

Just include `<script src="path/to/class.js"></script>` in your html.
    
## Node

Run `npm install yac` in the console, and declare `var Class = require("yac")` in the code to use it.

## Usage

### Class.extend()

To define a class just use `Class.extend` passing the properties and functions like a plain javascript object:

```js
var Cat = Class.extend({
  init: function(name) {
    this.name = name;
  },
  say: function(message) {
    return "Cat " + this.name + " says: " + message;
  }
});

var garfield = new Cat("Garfield"); // Calls Cat#init and set the "Garfield" as the name
garfield.say("meow"); // returns "Cat Garfield says: meow";
garfield instanceof Cat; // returns true
```

Subclasses are created calling `extend` in the parent class. When a function is already defined you can override it and invoke the parent class implementation using `this._super(args)`:

```js
var WildCat = Cat.extend({
  say: function(message) {
    return this._super(message.toUpperCase() + "!");
  }
});

var wildcat = new WildCat("Tom");
wildcat.say("meow"); // returns "Cat Tom says: MEOW!"
```

`extend` also supports mixins. Any object passed as parameter will be merged in the left to right direction:


```js
var Pokemon = {
  getId: function() {
    return this.id;
  },
  getType: function() {
    return this.type;
  }
}

var Meowth = Cat.extend(Pokemon, {
  init: function() {
    this._super("Meowth"); // Calls the super constructor (Cat#init), which set the cat name as "Meowth"
    this.id = 52;
    this.type = "normal";
  }
});

var meowth = new Meowth();
meowth.say("meow"); // returns "Cat Meowth says: meow";
meowth.getId(); // returns 52
meowth.getType(); // returns "normal"

```

### Class.overrideClass()

Defines methods at class level

```js
var User = Class.extend();

User.overrideClass({
  all: function() {
    return $.ajax('/users.json');
  }
});

User.all().then(function(users) {
  console.log(users);
});
```

You can also can pass multiple mixins, like in `extend`

```js
var Searchable = {
  all: function() {
    return $.ajax(this.path + '.json');
  }
}

var User = Class.extend();
var Post = Class.extend();

User.overrideClass(Searchable, {
  path: '/users'
});

Post.overrideClass(Searchable, {
  path: '/posts'
});

User.all().then(function(users) {
  console.log(users);
});

Post.all().then(function(posts) {
  console.log(posts);
});
```

# Develpoment

## Running tests

Run `npm start` and go to [http://localhost:4200/test.html](http://localhost:4200/test.html) to run the tests in the browser

Use `npm test` to run the tests in the console

## Building from source

Git clone the repo and run `npm run-script build` to build a production source in the `dist` folder

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

[travis]: https://travis-ci.org/marcioj/yac
[travis_badge]: https://travis-ci.org/marcioj/yac.svg?branch=master
