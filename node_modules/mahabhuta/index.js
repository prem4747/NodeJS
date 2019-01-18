/**
 * Copyright 2014-2016 David Herron
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

'use strict';

const cheerio = require('cheerio');
const util    = require('util');
const fs      = require('fs-extra');

var configCheerio;
var traceFlag = false;

exports.config = function(_configCheerio) {
    configCheerio = _configCheerio;
};

exports.setTraceProcessing = function(_traceFlag) {
    traceFlag = _traceFlag;
};

/**
 * Simply parse the text, returning $ so the caller can do whatever they want.
 */
exports.parse = function(text) {
    return configCheerio ? cheerio.load(text, configCheerio) : cheerio.load(text);
};

exports.Mahafunc = class Mahafunc {
    get selector() { throw new Error("The 'selector' getter must be overridden"); }

    findElements($) {
        var ret = [];
        $(this.selector).each(function(i, elem) { ret.push(elem); });
        return ret;
    }

    process() { throw new Error("The 'process' function must be overridden"); }
    processAll() { throw new Error("The 'processAll' function must be overridden"); }
}

/**
 * Implements an HTML-ish element that is replaced with
 * some other HTML.  For example, <embed-video> might take
 * an href= and other attributes to describe a video from
 * a known service, the process function discerns the HTML code
 * to use for the player, rendering that into the output.
 */
exports.CustomElement = class CustomElement extends exports.Mahafunc {

    get elementName() { throw new Error("The 'elementName' getter must be overridden"); }
    get selector() { return this.elementName; }

    process($element, metadata, setDirty, done) {
        throw new Error("The 'process' function must be overridden");
    }

    async processAll($, metadata, setDirty) {
        var custom = this;
        try {
            var elements = custom.findElements($);
            if (elements.length <= 0) return;
            for (var element of elements) {
                let replaceWith = await custom.process($(element), metadata, setDirty);
                $(element).replaceWith(replaceWith);
            }
        } catch (e) {
            console.error(`CustomElement ${custom.elementName} Errored with ${util.inspect(e)}`);
            throw e;
        }
    }
}

exports.ElementTweaker = class ElementTweaker extends exports.Mahafunc {
    process() {
        throw new Error("The 'process' function must be overridden")
    }
}

exports.Munger = class Munger extends exports.Mahafunc {
    process($, $element, metadata, setDirty, done) {
        throw new Error("The 'process' function must be overridden")
    }
    async processAll($, metadata, setDirty) {
        var munger = this;
        try {
            var elements = munger.findElements($);
            if (elements.length <= 0) return Promise.resolve();
            for (let element of elements) {
                await munger.process($, $(element), metadata, setDirty);
            }
        } catch (e) {
            console.error(`Munger ${munger.selector} Errored with ${util.inspect(e)}`);
            throw e;
        }
    }
}

exports.PageProcessor = class PageProcessor extends exports.Mahafunc {
    process($, metadata, setDirty) {
        throw new Error("The 'process' function must be overridden")
    }
}

exports.MahafuncArray = class MahafuncArray {

    constructor(name, config) {
        this._functions = [];
        this._name = name;
        this._config = config;
    }

    get name() { return this._name; }

    addMahafunc(func) {
        if (!(func instanceof exports.Mahafunc
           || func instanceof exports.MahafuncArray
           || typeof func === 'function'
           || Array.isArray(func))) {
            throw new Error("Improper addition "+ util.inspect(func));
        } else {
            this._functions.push(func);
        }
    }

    setMahafuncArray(functions) {
        if (!(Array.isArray(functions))) {
            throw new Error("Improper mahafunction array "+ util.inspect(functions));
        } else {
            this._functions = functions;
        }
    }

    async process($, metadata, dirty) {
        var mhArray = this;
        if (traceFlag)  console.log(`Mahabhuta starting array ${mhArray.name}`);
        const loops = [];
        const startProcessing = new Date();
        for (var mahafunc of mhArray._functions) {
            if (mahafunc instanceof exports.CustomElement) {
                if (traceFlag) console.log(`Mahabhuta calling CustomElement ${mhArray.name} ${mahafunc.elementName}`);
                try {
                    await mahafunc.processAll($, metadata, dirty);
                } catch (errCustom) {
                    throw new Error(`Mahabhuta ${mhArray.name} caught error in CustomElement: ${errCustom.message}`);
                }
                // loops.push(`... CustomElement ${mahafunc.elementName} ${(new Date() - startProcessing) / 1000} seconds`);
            } else if (mahafunc instanceof exports.Munger) {
                if (traceFlag)  console.log(`Mahabhuta calling Munger ${mhArray.name} ${mahafunc.selector}`);
                try {
                    await mahafunc.processAll($, metadata, dirty);
                } catch (errMunger) {
                    throw new Error(`Mahabhuta ${mhArray.name} caught error in Munger: ${errMunger.message}`);
                }
                if (traceFlag)  console.log(`Mahabhuta FINISHED Munger ${mhArray.name} ${mahafunc.selector}`);
                // loops.push(`... Munger ${mahafunc.selector} ${(new Date() - startProcessing) / 1000} seconds`);
            } else if (mahafunc instanceof exports.PageProcessor) {
                if (traceFlag)  console.log(`Mahabhuta calling ${mhArray.name} PageProcessor `);
                try {
                    await mahafunc.process($, metadata, dirty);
                } catch (errPageProcessor) {
                    throw new Error(`Mahabhuta ${mhArray.name} caught error in PageProcessor: ${errPageProcessor.message}`);
                }
                // loops.push(`... PageProcessor ${(new Date() - startProcessing) / 1000} seconds`);
            } else if (mahafunc instanceof exports.MahafuncArray) {
                let results = [];
                try {
                    results = await mahafunc.process($, metadata, dirty);
                } catch (errMahafuncArray) {
                    throw new Error(`Mahabhuta ${mhArray.name} caught error in MahafuncArray: ${errMahafuncArray.message}`);
                }

                // results.forEach(result => { loops.push(`    ... "${mahafunc.name} result" ${result} ${(new Date() - startProcessing) / 1000} seconds`); });
                // loops.push(`... MahafuncArray ${mahafunc.name} ${(new Date() - startProcessing) / 1000} seconds`);
            } else if (typeof mahafunc === 'function') {
                if (traceFlag)  console.log(`Mahabhuta calling an ${mhArray.name} "function" `);
                try {
                    await new Promise((resolve, reject) => {
                        mahafunc($, metadata, dirty, err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                } catch (errFunction) {
                    throw new Error(`Mahabhuta ${mhArray.name} caught error in function: ${errFunction.message}`);
                }
                // loops.push(`... MahafuncArray "function" ${(new Date() - startProcessing) / 1000} seconds`);
            } else if (Array.isArray(mahafunc)) {
                let mhObj = new exports.MahafuncArray("inline", mhArray._config);
                mhObj.setMahafuncArray(mahafunc);
                let results = await mhObj.process($, metadata, dirty);
                // results.forEach(result => { loops.push(`    ... "inline result" ${result} ${(new Date() - startProcessing) / 1000} seconds`); });
                // loops.push(`... MahafuncArray "inline array" ${(new Date() - startProcessing) / 1000} seconds`);
            } else {
                console.error("BAD MAHAFUNC "+ util.inspect(mahafunc));
            }
        }
        // return $.html();
        return loops;
    }
}

/**
 * Process the text using functions supplied in the array mahabhutaFuncs.
 */
exports.process = function(text, metadata, mahabhutaFuncs, done) {
    exports.processAsync(text, metadata, mahabhutaFuncs)
    .then(html => { done(undefined, html); })
    .catch(err => { done(err); });
};

exports.processAsync =  async function(text, metadata, mahabhutaFuncs) {

    if (!mahabhutaFuncs || mahabhutaFuncs.length < 0) mahabhutaFuncs = [];

    var cleanOrDirty = 'first-time';

    // Allow a pre-parsed context to be passed in
    var $ = typeof text === 'function' ? text : exports.parse(text);

    const loops = [];
    const startProcessing = new Date();
    do {
        var mhObj;
        if (Array.isArray(mahabhutaFuncs)) {
            // console.log(`ARRAY substitution`);
            mhObj = new exports.MahafuncArray("master", {});
            mhObj.setMahafuncArray(mahabhutaFuncs);
        } else if (mahabhutaFuncs instanceof exports.MahafuncArray) {
            // console.log(`MahafuncArray`);
            mhObj = mahabhutaFuncs;
        } else throw new Error(`Bad mahabhutaFuncs object supplied`);

        cleanOrDirty = 'clean';
        let results = await mhObj.process($, metadata, () => { cleanOrDirty = 'dirty'; });

        // results.forEach(result => { loops.push(mhObj.name +'  '+ result); });
        // loops.push(`MAHABHUTA processAsync ${metadata.document.path} FINISH ${(new Date() - startProcessing) / 1000} seconds ${cleanOrDirty}`);
    } while (cleanOrDirty === 'dirty');

    // loops.forEach(l => { console.log(l); });

    return $.html();
};

exports.process1 = function(text, metadata, mahafunc, done) {
    exports.process(text, metadata, [ mahafunc ], done);
};
