'use strict';

const mahabhuta = require('./index');
const globfs    = require('globfs');

exports.mahabhuta = new mahabhuta.MahafuncArray("mahabhuta built-in", {});

class SiteVerification extends mahabhuta.CustomElement {
	get elementName() { return "site-verification"; }
	process($element, metadata, dirty) {
        return co(function* () {
            var ret = '';
            var google = $element.attr('google');
            if (google) {
                ret += `<meta name="google-site-verification" content="${google}"/>`;
            }
            // TBD site verification for other services
            return ret;
        });
    }
}
exports.mahabhuta.addMahafunc(new SiteVerification());

class DNSPrefetch extends mahabhuta.CustomElement {
	get elementName() { return "dns-prefetch"; }
	process($element, metadata, dirty) {
        return co(function* () {
            var control = $element.attr("control");
            var dnslist = $element.attr("dnslist");
            if (!control && !dnslist) {
                throw new Error("No control and no dnslist parameters");
            }
            if (!dnslist) {
                throw new Error("No dnslist parameters");
            }
            var dns = dnslist.split(',');

            var ret = '';

            if (control) {
                ret += `<meta http-equiv="x-dns-prefetch-control" content="${control}"/>`;
            }
            dns.forEach(item => { ret += `<link rel="dns-prefetch" href="${item}"/>`; });

            return ret;
        });
    }
}
exports.mahabhuta.addMahafunc(new DNSPrefetch());

class XMLSitemap extends mahabhuta.CustomElement {
	get elementName() { return "xml-sitemap"; }
	process($element, metadata, dirty) {
        return co(function* () {
            // http://microformats.org/wiki/rel-sitemap
            var href = $element.attr("href");
            if (!href) href = "/sitemap.xml";
            var title = $element.attr("title");
            if (!title) title = "Sitemap";
            return `<link rel="sitemap" type="application/xml" title="${title}" href="${href}" />`;
        });
    }
}
exports.mahabhuta.addMahafunc(new XMLSitemap());

class ExternalStylesheet extends mahabhuta.CustomElement {
	get elementName() { return "external-stylesheet"; }
	process($element, metadata, dirty) {
        return co(function* () {
            var href = $element.attr('href');
            if (!href) throw new Error("No href supplied");
            var media = $element.attr('media');
            if (media) {
                return `<link rel="stylesheet" type="text/css" href="${href}" media="${media}"/>`;
            } else {
                return `<link rel="stylesheet" type="text/css" href="${href}"/>`;
            }
        });
    }
}
exports.mahabhuta.addMahafunc(new ExternalStylesheet());

class RSSHeaderMeta extends mahabhuta.Munger {
    get selector() { return "rss-header-meta"; }

    process($, $link, metadata, dirty, done) {
        if ($('html head').get(0)) {
            return co(function* () {
                var href = $link.attr('href');
                if (!href) {
                    throw new Error("No href in rss-header-meta tag");
                }
                $('head').append(`<link rel="alternate" type="application/rss+xml" href="${href}"/>`);
                $link.remove();
            });
        } else return Promise.resolve();
    }
}
exports.mahabhuta.addMahafunc(new RSSHeaderMeta());

class BodyAddClass extends mahabhuta.Munger {
    get selector() { return "body-add-class"; }
    process($, $link, metadata, dirty, done) {
        if ($('html body').get(0)) {
            return co(function* () {
                var clazz = $link.attr('class');
                if (!clazz) {
                    throw new Error("No class in body-add-class tag");
                }
                if (!$('html body').hasClass(clazz)) {
                    $('html body').addClass(clazz);
                }
                $link.remove();
            });
        } else return Promise.resolve();
    }
}
exports.mahabhuta.addMahafunc(new BodyAddClass());


const ejs      = require('ejs');

class Partial extends mahabhuta.CustomElement {
    get elementName() { return "partial"; }
    process($element, metadata, dirty) {
        return co(function* () {
            var data  = $element.data();
            var fname = $element.attr("file-name");
            var body  = $element.html();

            var d = {};
            for (var mprop in metadata) { d[mprop] = metadata[mprop]; }
            var data = $element.data();
            for (var dprop in data) { d[dprop] = data[dprop]; }
            d["partialBody"] = body;

            // console.log(`mahabhuta Partial partialBody=${partialBody}`);

            // find the partial
            // render the partial using the data provided

            // TBD configuration for partialDirs
            var partialFound = yield globfs.findAsync(module.exports.configuration.partialDirs, fname);
            if (!partialFound) throw new Error(`No partial directory found for ${fname}`);
            // Pick the first partial found
            partialFound = partialFound[0];

            var partialFname = path.join(partialFound.basedir, partialFound.path);
            var partialText = yield fs.readFile(partialFname, 'utf8');

            // TBD based on file extension render through a template engine
            // TBD Need support for a broader spectrum of template engines

            dirty();
            if (/\.ejs$/i.test(partialFname)) {
                try { return ejs.render(partialText, d); } catch (e) {
                    throw new Error(`EJS rendering of ${fname} failed because of ${e}`);
                }
            } else if (/\.html$/i.test(partialFname)) {
                // NOTE: The partialBody gets lost in this case
                return partialText;
            } else {
                throw new Error("No rendering support for ${fname}");
            }

            /* if (module.exports.configuration.renderPartial) {
                dirty();
                return yield module.exports.configuration.renderPartial(fname, body, d);
            } else {
                throw new Error(`CONFIGURATION ERROR: Unable to render partial ${fname}`);
            } */
        });
    }
}
exports.mahabhuta.addMahafunc(new Partial());

module.exports.configuration = {};

// JavaScript script tags

// some metadata like rel=canonical

// ograph && twitter cards

// bootstrap-specific -- responsive embed support
