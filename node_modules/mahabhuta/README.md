# Mahabhuta
jQuery-like document processing engine for server-side DOM processing on Node.js

This is a wrapper around Cheerio to perform a series of jQuery-like operations on an HTML document.  It allows one to package a set of reusable, discrete, DOM-manipulations that run server-side on Node.js.

The name comes because Mahabhuta was developed as part of AkashaCMS.  Where Akasha is the Sanskrit word for the primordial element from which the universe was constructed, Mahabhuta is the collective name for all five elements (earth, air, fire, water, spiritual-essence-space).  Because Mahabhuta focuses on processing HTML elements the name fits.

Mahabhuta uses the [Cheerio](https://www.npmjs.com/package/cheerio) library for its jQuery-like API.  It doesn't support the full jQuery API, but a subset that the Cheerio team feels is useful.  Mahabhuta is used in [AkashaCMS](http://akashacms.com/) to provide DOM manipulation during page rendering.

## Purpose

Generally speaking, what's done with Mahabhuta is to either invent special tags (e.g. `<youtube-video-embed>`), and provide a function to process that tag, or to do special DOM manipulation.

Consider a page like this:

```
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
<meta charset="utf-8" />
<!-- Use the .htaccess and remove these lines to avoid edge case issues. More info: h5bp.com/i/378 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<ak-page-title/>
<ak-header-metatags/>
<ak-sitemapxml/>
<ak-siteverification/>
<ak-stylesheets/>
<ak-headerJavaScript/>
</head>
<body>
<ak-navigation-bar/>
<ak-insert-content/>
<!-- JavaScript at the bottom for fast page loading -->
<ak-footerJavaScript/>
<ak-google-analytics/>
</body>
</html>
```

What Mahabhuta does is give you the ability to process special tags like these, converting each into a corresponding HTML snippet.  The result is a fully fleshed out functional page suitable for display in a browser.

Another plausible use is to search for all `img` tags with a special class, and either add (or don't add) the image to `og:image` meta tags.

```
<img class="... ogshow ..." src="..."/>
```

This tag might be detected, and then added to the page header as an `og:image` tag so that social network sites can detect images to show when the page is shared.

## Installation

Add `mahabhuta` to your `package.json` and type:

```
$ npm install
```

Or simply type

```
$ npm install mahabhuta
```
