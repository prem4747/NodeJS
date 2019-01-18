'use strict';

const mahabhuta = require('../index');

// TODO JavaScript script tags
// TODO some metadata like rel=canonical
// TODO ograph && twitter cards
// TODO bootstrap-specific -- responsive embed support

exports.mahabhuta = new mahabhuta.MahafuncArray("mahabhuta metadata built-in", {});

class SiteVerification extends mahabhuta.CustomElement {
	get elementName() { return "site-verification"; }
	async process($element, metadata, dirty) {
        var ret = '';
        var google = $element.attr('google');
        if (google) {
            ret += `<meta name="google-site-verification" content="${google}"/>`;
        }
        // TBD site verification for other services
        return ret;
    }
}
exports.mahabhuta.addMahafunc(new SiteVerification());

class DNSPrefetch extends mahabhuta.CustomElement {
	get elementName() { return "dns-prefetch"; }
	async process($element, metadata, dirty) {
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
    }
}
exports.mahabhuta.addMahafunc(new DNSPrefetch());

class XMLSitemap extends mahabhuta.CustomElement {
    get elementName() { return "xml-sitemap"; }
    async process($element, metadata, dirty) {
        // http://microformats.org/wiki/rel-sitemap
        var href = $element.attr("href");
        if (!href) href = "/sitemap.xml";
        var title = $element.attr("title");
        if (!title) title = "Sitemap";
        return `<link rel="sitemap" type="application/xml" title="${title}" href="${href}" />`;
    }
}
exports.mahabhuta.addMahafunc(new XMLSitemap());

class ExternalStylesheet extends mahabhuta.CustomElement {
    get elementName() { return "external-stylesheet"; }
    async process($element, metadata, dirty) {
        var href = $element.attr('href');
        if (!href) throw new Error("No href supplied");
        var media = $element.attr('media');
        if (media) {
            return `<link rel="stylesheet" type="text/css" href="${href}" media="${media}"/>`;
        } else {
            return `<link rel="stylesheet" type="text/css" href="${href}"/>`;
        }
    }
}
exports.mahabhuta.addMahafunc(new ExternalStylesheet());

class RSSHeaderMeta extends mahabhuta.Munger {
    get selector() { return "rss-header-meta"; }

    async process($, $link, metadata, dirty, done) {
        if ($('html head').get(0)) {
            var href = $link.attr('href');
            if (!href) {
                throw new Error("No href in rss-header-meta tag");
            }
            $('head').append(`<link rel="alternate" type="application/rss+xml" href="${href}"/>`);
            $link.remove();
        }
    }
}
exports.mahabhuta.addMahafunc(new RSSHeaderMeta());

class BodyAddClass extends mahabhuta.Munger {
    get selector() { return "body-add-class"; }
    async process($, $link, metadata, dirty, done) {
        if ($('html body').get(0)) {
            var clazz = $link.attr('class');
            if (!clazz) {
                throw new Error("No class in body-add-class tag");
            }
            if (!$('html body').hasClass(clazz)) {
                $('html body').addClass(clazz);
            }
            $link.remove();
        }
    }
}
exports.mahabhuta.addMahafunc(new BodyAddClass());
