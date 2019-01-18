'use strict';

const mahabhuta = require('../index');
const globfs    = require('globfs');
const ejs       = require('ejs');
const path      = require('path');
const util      = require('util');
const fs        = require('fs-extra');
// const literal   = require('template-literal');

exports.mahabhuta = new mahabhuta.MahafuncArray("mahabhuta partials built-in", {});

class Partial extends mahabhuta.CustomElement {
    get elementName() { return "partial"; }
    async process($element, metadata, dirty) {
        var data  = $element.data();
        var fname = $element.attr("file-name");
        var body  = $element.html();

        var d = {};
        for (var mprop in metadata) { d[mprop] = metadata[mprop]; }
        var data = $element.data();
        for (var dprop in data) { d[dprop] = data[dprop]; }
        d["partialBody"] = body;

        // console.log(`mahabhuta Partial partialBody=${d["partialBody"]}`);

        if ($element.attr("dirty")) dirty();

        return module.exports.configuration.renderPartial(fname, d);
    }
}

module.exports.mahabhuta.addMahafunc(new Partial());

module.exports.configuration = {
    partialDirs: [], 

    // Replaceable function to handle rendering
    renderPartial: async function (fname, attrs) {
        
        let partialDirs;

        if (typeof module.exports.configuration.partialDirs === 'undefined'
         || !module.exports.configuration.partialDirs
         || module.exports.configuration.partialDirs.length <= 0) {
            partialDirs = [ __dirname ];
         } else {
            partialDirs = module.exports.configuration.partialDirs;
         }

        var partialFound = await globfs.findAsync(partialDirs, fname);
        if (!partialFound) throw new Error(`No partial found for ${fname} in ${util.inspect(partialDirs)}`);
        // Pick the first partial found
        partialFound = partialFound[0];
        // console.log(`module.exports.configuration renderPartial ${partialFound}`);
        if (!partialFound) throw new Error(`No partial found for ${fname} in ${util.inspect(partialDirs)}`);
    
        var partialFname = path.join(partialFound.basedir, partialFound.path);
        var stats = await fs.stat(partialFname);
        if (!stats.isFile()) {
            throw new Error(`doPartialAsync non-file found for ${fname} - ${partialFname}`);
        }
        var partialText = await fs.readFile(partialFname, 'utf8');
        if (/\.ejs$/i.test(partialFname)) {
            try { return ejs.render(partialText, attrs); } catch (e) {
                throw new Error(`EJS rendering of ${fname} failed because of ${e}`);
            }
        } /* else if (/\.literal$/i.test(partialFname)) {
            try {
                const t = literal(partialText);
                return t(attrs);
            } catch (e) {
                throw new Error(`Literal rendering of ${fname} failed because of ${e}`);
            }
        } */ else if (/\.html$/i.test(partialFname)) {
            // NOTE: The partialBody gets lost in this case
            return partialText;
        } else {
            throw new Error("No rendering support for ${fname}");
        }
    }
};

module.exports.doPartialAsync = async function (fname, attrs) {

    throw new Error("Deprecated");

    // find the partial
    // render the partial using the data provided

    // TBD configuration for partialDirs
    // console.log(`doPartialAsync ${util.inspect(fname)} ${util.inspect(module.exports.configuration.partialDirs)}`);
    var partialFound = await globfs.findAsync(module.exports.configuration.partialDirs, fname);
    // console.log(`doPartialAsync ${partialFound}`);
    if (!partialFound) throw new Error(`No partial directory found for ${fname}`);
    // Pick the first partial found
    partialFound = partialFound[0];
    if (!partialFound) throw new Error(`No partial directory found for ${fname}`);

    var partialFname = path.join(partialFound.basedir, partialFound.path);
    // console.log(`doPartialAsync before reading ${partialFname}`);
    var stats = await fs.stat(partialFname);
    if (!stats.isFile()) {
        throw new Error(`doPartialAsync non-file found for ${fname} - ${partialFname}`);
    }
    var partialText = await fs.readFile(partialFname, 'utf8');
    // console.log(`doPartialAsync after reading ${partialFname} text length=${partialText.length}`);

    // TODO based on file extension render through a template engine
    // TODO Need support for a broader spectrum of template engines

    // dirty();
    if (/\.ejs$/i.test(partialFname)) {
        try { return ejs.render(partialText, attrs); } catch (e) {
            throw new Error(`EJS rendering of ${fname} failed because of ${e}`);
        }
    } /* else if (/\.literal$/i.test(partialFname)) {
        try {
            const t = literal.compile(partialText);
            return t(attrs);
        } catch (e) {
            throw new Error(`Literal rendering of ${fname} failed because of ${e}`);
        }
    } */ else if (/\.html$/i.test(partialFname)) {
        // NOTE: The partialBody gets lost in this case
        return partialText;
    } else {
        throw new Error("No rendering support for ${fname}");
    }
};


module.exports.doPartialSync = function(fname, attrs) {
    throw new Error("Deprecated");

    var partialFound = globfs.findSync(module.exports.configuration.partialDirs, fname);
    if (!partialFound) throw new Error(`No partial directory found for ${fname}`);
    // Pick the first partial found
    partialFound = partialFound[0];

    // console.log(`doPartialSync found ${util.inspect(partialFound)} for ${util.inspect(module.exports.configuration.partialDirs)} ${fname}`);

    var partialFname = path.join(partialFound.basedir, partialFound.path);
    // console.log(`doPartialSync before reading ${partialFname}`);
    var stats = fs.statSync(partialFname);
    if (!stats.isFile()) {
        throw new Error(`doPartialSync non-file found for ${fname} - ${partialFname}`);
    }
    var partialText = fs.readFileSync(partialFname, 'utf8');

    // TODO based on file extension render through a template engine
    // TODO Need support for a broader spectrum of template engines

    // dirty();
    if (/\.ejs$/i.test(partialFname)) {
        try { return ejs.render(partialText, attrs); } catch (e) {
            throw new Error(`EJS rendering of ${fname} failed because of ${e}`);
        }
    } /* else if (/\.literal$/i.test(partialFname)) {
        try {
            const t = literal.compile(partialText);
            return t(attrs);
        } catch (e) {
            throw new Error(`Literal rendering of ${fname} failed because of ${e}`);
        }
    } */ else if (/\.html$/i.test(partialFname)) {
        // NOTE: The partialBody gets lost in this case
        return partialText;
    } else {
        throw new Error("No rendering support for ${fname}");
    }
};
