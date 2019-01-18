---
layout: ebook-page.html.ejs
title: Introduction
# bookHomeURL: 'toc.html'
---

Back in 2011 when I was first learning about Node.js, I came across a video/talk by an excited Yahoo engineer.  He talked about the awesome power of server-side DOM-based processing of HTML before sending the page to the browser.  The claim is that by doing most of the page assembly on the server overall performance is improved -- the server has better bandwidth to the supporting services to retrieve content to render, and therefore all the round-trips to gather that stuff runs more quickly on the server than in a browser.  Especially when that browser is in the middle of a farm field in the boondocks.

Two clues tell us his idea doesn't seem to have taken off.  First, the typical Node.js server-side framework is based on template processing, not DOM processing.  Second, many think it's way-cool to deliver JavaScript to the browser and have the browser make server requests for data used to construct the page.

I have troubles with both ideas.  First, template processing is not very precise in that what we're constructing is an HTML DOM tree represented by text.  The fact that it looks like text leads us to a mistaken belief we should use text processing techniques.  The HTML is actually a DOM object structure masquerading as text, and we should act on it with software that treats it as objects.  Second, I find the server-side-is-faster argument to be compelling.  Compelling enough to have developed Mahabhuta.

The name? "Mahabhuta" is the Sanskrit name for the five elements, with Akasha being one of those elements. The Mahabhuta engine deals with HTML Elements, so it seems like a fitting name.  Mahabhuta was originally developed for AkashaCMS, hence the association.  It can be used by other software.

The Mahabhuta framework offers a jQuery-like API for DOM-processing of HTML.  In AkashaCMS it is used as part of the rendering pipeline for static HTML pages, but with appropriate glue code it can be used with Express or other frameworks.  The jQuery portion relies on Cheerio, which implements a jQuery subset and is much faster than the real jQuery.

Mahabhuta makes it easy to do these sorts of HTML DOM manipulations

* **CustomElement** Define a custom tag, like `<embed-video>`, which is converted into a suitable block of HTML.  In this case the custom element is completely replaced by the new HTML code.
* **ElementTweaker** Make changes to an HTML element without replacing it.
* **Munger** Make larger-scale changes to a page.  In this case the programmer is given access to the entire page DOM, allowing any change to be implemented.

Each of those subclasses a class named **Mahafunc**, with each serving as the base class with which the programmer implements the manipulations required to accomplish the desired goal.  An array of Mahafunc's is supplied to Mahabhuta, which executes each in turn.  A Mahafunc can indicate to Mahabhuta that its manipulation left the DOM "dirty", meaning that the Mahafunc array must be re-executed after it is finished.  This handles cases such as a CustomElement inserts another CustomElement, and ensures the new CustomElement is processed.
