---
layout: ebook-page.html.ejs
title: Project setup
publicationDate: July 1, 2017
---

# Setting up Node.js

Mahabhuta is written for the Node.js platform.  While that means it executes JavaScript programs, letting you leverage your jQuery and JavaScript knowledge on server-side software, it also means your computer must have Node.js to run Mahabhuta.  Therefore the first step is to set up Node.js on your laptop and/or server.

I won't go into this in very much depth because there is excellent documentation elsewhere.

* Official download location: https://nodejs.org/en/download/
* Official documentation on installing from O/S package managers: https://nodejs.org/en/download/package-manager
* Comprehensive list of books and video courses on Node.js programming: http://davidherron.com/book/2015-09-14/books-and-videos-so-you-can-easily-learn-nodejs-programming
* NVM is an excellent tool for managing Node.js versions on your laptop: https://github.com/creationix/nvm

# Initializing a Mahabhuta project

Your use of Mahabhuta is probably going to be part of a larger project.  For example, while Mahabhuta is a major feature in AkashaCMS it is not the entirety of that project.  If you're using AkashaRender/AkashaCMS, Mahabhuta comes along for free and you don't need to do anything special.  Instead you may want to use Mahabhuta on its own, so read on.

Every Node.js project starts with running this command:

```
$ npm init
```

This initializes a `package.json` file with a few basic settings.  The `package.json` describes the project, its dependencies, and can even describe the processes you can do with the project.

You declare the Mahabhuta dependency as so:

```
$ npm install mahabhuta --save
```

# A small Mahabhuta example

In an empty directory, create a file named `hello-world.js` containing the following:

```
'use strict';

const mahabhuta = require('mahabhuta');

var mahafuncs = new mahabhuta.MahafuncArray("example", {});

class HelloWorld extends mahabhuta.CustomElement {
	get elementName() { return "hello-world"; }
	process($element, metadata, dirty) {
		return Promise.resolve("Hello, world!");
	}
}
mahafuncs.addMahafunc(new HelloWorld());

mahabhuta.config({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

mahabhuta.process(`
    <html>
    <head>
    <title>Hi</title>
    </head>
    <body>
    <hello-world></hello-world>
    </body>
    </html>
`, {}, mahafuncs, (err, html) => {
    if (err) console.error(err);
    else console.log(html);
});
```

In that directory run:

```
$ npm init
    answer all the questions
$ npm install mahabhuta --save
$ node hello-world
<html>
<head>
<title>Hi</title>
</head>
<body>
Hello, world!
</body>
</html>
```

Notice that the tag, `<hello-world>`, was replaced by the text: `Hello, world!`

This was accomplished by the _HelloWorld_ CustomElement object shown above.

The _MahafuncArray_ object is used to store an array of what we call, for lack of a better name, Mahafunc's.  A Mahafunc is the unit of processing in Mahabhuta.  There is a base class, Mahafunc, and two subclasses one of which we see here, CustomElement.  

CustomElement instances match elements named by the `elementName` method.  For each matching element the `process` function is called, and the result of the Promise it returns are inserted into the output.

What we've done is define a MahafuncArray containing one Mahafunc.  It's easy to create hundreds of Mahafunc's each serving one DOM-processing purpose.

```
mahabhuta.config({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});
```

This does some necessary configuration of Mahabhuta.  Under the covers Mahabhuta uses Cheerio, and the configuration parameters are actually from Cheerio.

```
mahabhuta.process(`
    <html>
    <head>
    <title>Hi</title>
    </head>
    <body>
    <hello-world></hello-world>
    </body>
    </html>
`, {}, mahafuncs, (err, html) => {
    if (err) console.error(err);
    else console.log(html);
});
```

Here we process some HTML, using the MahafuncArray we just defined.  The second parameter is a metadata object, whose contents can be used to pass data into the Mahafunc's.  The callback either gives an error, or some HTML.

This should give a taste of what you can do with Mahabhuta.  In the next chapter we'll go more deeply into what it can do.

# Mahabhuta setup in AkashaCMS projects

As we said, the `akasharender` package names `mahabhuta` as a dependency, and therefore Mahabhuta is automatically installed in every AkashaCMS project.  The AkashaRender package and every AkashaCMS plugin includes an MahafuncArray for the DOM processing required by that plugin.

For documentation see https://akashacms.com/akasharender/plugin-writing.html
