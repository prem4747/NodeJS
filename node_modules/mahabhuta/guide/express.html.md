---
layout: ebook-page.html.ejs
title: Using Mahabhuta in an Express application
publicationDate: July 1, 2017
---

While Mahabhuta came into being as part of AkashaCMS, a static HTML website generator, DOM processing in a dynamically generated website should be very useful.  It's fairly easy to integrate Mahabhuta into Express as a "template engine".  While Mahabhuta's model is very unlike template engines, it does manipulate HTML to produce different HTML.  That makes it easy enough to fit Mahabhuta into Express as a template engine.

Integrating Mahabhuta with Express is easy.  The following is written for Express v4, and there is an example application in the Mahabhuta repository.

If you've followed the normal outline of an Express application you'll have a line reading:

```
var app = express();
```

Following this you'll register template engines, the `views` directory, and define the default View Engine.  Here's how it goes in the sample application:

```
const mahabhuta = require('mahabhuta');
const mahaMetadata = require('mahabhuta/maha/metadata');
const mahaPartial = require('mahabhuta/maha/partial');
...

var app = express();

const mahafuncs = new mahabhuta.MahafuncArray("akasharender built-in", {});

// Add your own mahabhuta functions before these
mahafuncs.addMahabhuta(mahaMetadata.mahabhuta);
mahafuncs.addMahabhuta(mahaPartial.mahabhuta);

mahabhuta.registerExpress(app, "maha", mahafuncs);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'maha');
```

That's it.  Configured this way, you put files in the `views` directory using the extension `.maha`.  These files will be HTML, but will be processed by whatever CustomElement and Munger operations you've defined.

In the sample application we have this route:

```
router.get('/', function(req, res, next) {
  res.render('hello-world', { title: 'Express' });
});
```

And in `views/hello-world.maha` we have this:

```
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <external-stylesheet href='/stylesheets/style.css' ></external-stylesheet>
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Hello, World!  Welcome to <%= title %></p>
  </body>
</html>
```

Since we have used the Mahabhuta built-in functions, the `external-stylesheet` tag is a recognized CustomElement.

Then, we can access that route as so:

```
$ curl -f http://localhost:3000/
<!DOCTYPE html>
<html>
  <head>
    <title><%= title="" %=""></%=></title>
    <link rel="stylesheet" type="text/css" href="/stylesheets/style.css">
  </head>
  <body>
    <h1><%= title="" %=""></%=></h1>
    <p>Hello, World!  Welcome to <%= title="" %=""></%=></p>
  </body>
</html>
```

Notice that the output is the same as in `hello-world.maha` except that the `external-stylesheet` tag has been replaced.

Notice that the EJS tags in `hello-world.maha` did not get processed, and instead came out a little weird.  Mahabhuta did that to them, and they should have been processed before getting to the DOM processing.
