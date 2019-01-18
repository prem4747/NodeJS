---
layout: ebook-page.html.ejs
title: Using the built-in Mahafuncs
publicationDate: July 1, 2017
---

Included with Mahabhuta is a small collection of useful Mahafunc's.  They serve both as an example of Mahafunc implementation, and as basic HTML manipulations to simplify your projects.

The MahafuncArray for these built-in Mahafuncs is available as:

```
const mahaMetadata = require('mahabhuta/maha/metadata');
const mahaPartial = require('mahabhuta/maha/partial');
```

Typically you'll have a master MahafuncArray containing other MahafuncArray instances for each group of Mahafunc's.  The Mahabhuta built-in MahafuncArray should be the last in the master list.

```
var mahamaster = new mahabhuta.MahafuncArray("master", {});
mahamaster.addMahafunc(group1.mahabhuta);
mahamaster.addMahafunc(group2.mahabhuta);
mahamaster.addMahafunc(group3.mahabhuta);
mahamaster.addMahafunc(mahaMetadata.mahabhuta);
mahamaster.addMahafunc(mahaPartial.mahabhuta);
```

This is to ensure we take advantage of the over-rideability principle.

# SiteVerification -- site-verification

Various services want you to validate ownership of a website or domain by putting special tags in the HTML.  At the moment we only support Google site verification.

USAGE:

```
<site-verification google="code from Google"/>
```

# DNSPrefetch -- dns-prefetch

> DNS prefetching is a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth. This prefetching is performed in the background, so that the DNS is likely to have been resolved by the time the referenced items are needed.  This reduces latency when the user clicks a link.  (from: https://developer.mozilla.org/en-US/docs/Web/HTTP/Controlling_DNS_prefetching)

In other words, this can speed up the user experience by instructing the web browser what content can be prefetched.

USAGE:

```
<dns-prefetch control="on|off" dnslist="url1, url2, url3"/>
```

The first parameter controls whether dns-prefetch is used, by generating this tag:

```
<meta http-equiv="x-dns-prefetch-control" content="on|off">
```

The second parameter is a comma-separated list of URL's which end up generating a corresponding list of these tags:

```
<link rel="dns-prefetch" href="http://www.spreadfirefox.com/">
```

# XMLSitemap -- xmp-sitemap

Several years ago the search engines cooperated on developing an XML based sitemap format that eases the process of indexing websites.  This is extremely important as it helps the search engines properly index your website.

USAGE:

```
<xml-sitemap title="Title Text" href="/path/to/sitemap.xml"/>
```

# ExternalStylesheet -- external-stylesheet

This assists with referencing CSS stylesheets outside the page, that must be loaded from another file.

USAGE:

```
<external-stylesheet href="url" media="optional media type"/>
```

# RSSHeaderMeta -- rss-header-meta

When publishing an RSS feed there are two things to get correct on the page.  One is the HTML block containing the RSS icon, and the link to the RSS feed itself.  The other is metadata to put in the header.  It's helpful for the page layout to declare both of those in the same place.  But then there's the issue of getting the metadata tag into the header.

The `<rss-header-meta>` tag adds the correct tag into the header, if/when the header exists.  It rummages around in the DOM to find the `<head>` section, inserting there this tag:

```
<link rel="alternate" type="application/rss+xml" href="${href}"/>
```

If it finds the `<head>` tag, it inserts the `<link>` tag, and then deletes itself from the DOM.  If this does not happen, then the `<rss-header-meta>` tag is not deleted from the DOM.  Your processing pipeline might, like is done in AkashaCMS, run the Mahafuncs in multiple stages.  In one stage the `<head>` section won't exist, while it will exist in a later stage.

USAGE:

```
<rss-header-meta href="url"/>
```

# Partial's -- partial

Instantiate it with:

```
const mahaPartial = require('mahabhuta/maha/partial');
...
mahamaster.addMahafunc(mahaPartial.mahabhuta);
```

The Partial concept is very powerful, since it lets you substitute a large piece of template into one location on the page.  For example you might have boilerplate code that's replicated on every page, such as the group of JavaScript and CSS references, or a navigation toolbar that's the same on every page.  By using a Partial you can avoid replicating that code, and instead keep it in one place.

Implementation is a little more complex than for the other tags, as it will require hooking in some code to find the template file.

USAGE:

```
<partial data-param1="value1" data-param2="value2" file-name="partial.html">
body content of the partial
</partial>
```

The file named in `file-name` is the _partial_ which is invoked, and once it's rendered the resulting HTML is substituted for the tag.  While this can be run standalone, this feature can be integrated into a larger system.

**Collecting Metdata** This first step creates a new metadata object, merging data from the `metadata` passed in through Mahabhuta with the value of `data-` attributes in the tag.  The `data-` attributes are a universal feature in HTML supplying data values.  Inside the `partial` Mahafunc, the `$element.data()` function is called to gather those items and to merge them into the `metadata`.

**Partial Body** Text content of the tag is collected with `$element.html()`, and appears in the `metadata` in the `partialBody` field.

**Rendering the Partial** The point of collecting metadata and the `partialBody` is to render the _partial_ using a template engine.  The metadata can be substituted into the _partial_ as dictated by the template.  The example `file-name` above, `partial.html`, would not be processed by a template engine, however, and would simply be what replaces the tag.  There are two methods to render the _partial_ through a template engine, one uses the default built-in renderer, and the other uses an external renderer.

**Default internal Partial renderer** With no further configuration the file named in `file-name` is looked for in the current directory.  Files ending in `.ejs` are rendered using the EJS template engine, and files ending in `.literal` are rendered using the _template-literal_ engine.  Files ending in `.html` are used intact with no modifications.  In either case the resulting HTML is substituted for the tag.  If the file ends in any other extension, an error is thrown.

**Supplying a list of directories to search in** It's possible to set up an array of directories to search for the _partial_ file.  Make `mahaPartial.configuration.partialDirs` an array giving directory names to earch, and the first one found will be used.

**Configuring an external Partial renderer** The above method is powerful but limited.  What if you want to use other template engines, or to use Markdown or Asciidoc in your _Partial_?  A generalized rendering process for Partial's is best handled by an external Renderer.  For example Mahabhuta's sister project, AkashaRender, supplies a rendering process exploiting its Renderer objects.  

To integrate your own rendering process, overwrite the `mahaPartial.configuration.renderPartial` function with your own.  The function signature is `(fname, attrs)` where `fname` is the file passed in `file-name` and `attrs` is the merged metadata object.  The function must return a Promise that when fulfilled produces the rendered HTML.

