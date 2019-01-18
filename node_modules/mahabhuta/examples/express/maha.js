'use strict';

const mahabhuta = require('mahabhuta');
const ejs       = require('ejs');
const fs        = require('fs-extra-promise');
const path      = require('path');
const util      = require('util');

var mahafuncs = new mahabhuta.MahafuncArray("mahabhuta-express-example", {});

var partialDirName;

exports.partialDir = function(_partialDir) {
    partialDirName = _partialDir;
};

exports.addMahafunc = function(newMahafuncs) {
    mahafuncs.addMahafunc(newMahafuncs);
};

exports.registerExpress = function(app, ext) {
   app.engine(ext, (filePath, options, callback)  => {
       // console.log(`Mahabhuta Express Engine ${util.inspect(mahafuncs)}`);
       fs.readFile(filePath, 'utf8', (err, content) => {
           if (err) return callback(err);
           // console.log(`Mahabhuta Express Engine ${util.inspect(mahafuncs)}`);
           // console.log(`Mahabhuta Express Engine ${util.inspect(content)} ${util.inspect(options)}`)
           content = ejs.render(content.toString(), options);
           mahabhuta.process(content, options, mahafuncs, (err, html) => {
               if (err) { /* console.error(`Mahabhuta Express Engine ERROR ${err}`); */ callback(err); }
               else { /* console.log(`Mahabhuta OKAY: ${html}`); */ callback(undefined, html); }
           });
       });
   });
   // console.log(`Mahabhuta Express Engine constructor ${util.inspect(this)} ------ ${util.inspect(this.mahafuncs)}`);
};

mahabhuta.builtin.configuration.renderPartial = function(fileName, contentBody, metadata) {
    var partialPath = path.join(partialDirName, fileName);
    // console.log(`renderPartial ${fileName} ${partialPath} ${contentBody}`);
    return fs.statAsync(partialPath)
    .then(stats => {
        if (stats && stats.isFile()) {
            return fs.readFileAsync(partialPath, 'utf8');
        } else throw new Error(`Path ${partialPath} not a file`);
    })
    .then(fileData => {
        return new Promise((resolve, reject) => {
            // console.log(`renderPartial fileData ${fileData}`);
            var rendered = ejs.render(fileData, metadata, {});
            // console.log(`renderPartial rendered ${rendered}`);
            mahabhuta.process(rendered, metadata, mahafuncs, (err, html) => {
                if (err) { reject(err); }
                else {
                    // console.log(`renderPartial html ${html}`);
                    resolve(html);
                }
            });
        });
    });
};


/*
TODO make the resulting application somewhat useful.
* https://www.npmjs.com/package/lorem-hipsum
* https://www.npmjs.com/package/lorem-ipsum
* https://www.npmjs.com/package/lorem-pedia
* https://www.npmjs.com/package/lipsumator
* https://www.npmjs.com/package/placeholder-generator
* https://www.npmjs.com/package/blindipsum
* https://www.npmjs.com/package/chinesegen
* https://www.npmjs.com/package/boganipsum
* https://www.npmjs.com/package/vinoipsum
* https://www.npmjs.com/package/hall-and-oates-ipsum
* https://www.npmjs.com/package/schuler-ipsum
* https://www.npmjs.com/package/anything-ipsum
* https://www.npmjs.com/package/synergipsum
* https://www.npmjs.com/package/smithers-loremipsum
* https://www.npmjs.com/package/jack-ipsum
* https://www.npmjs.com/package/englipsum
* https://www.npmjs.com/package/kanyeloremipsum
* https://www.npmjs.com/package/kanye-ipsum
* https://www.npmjs.com/package/body-builder-ipsum
* https://www.npmjs.com/package/hipsum
* https://www.npmjs.com/package/ipsum
* https://www.npmjs.com/package/schiffer-ipsum
* https://www.npmjs.com/package/bavaria-ipsum
* https://www.npmjs.com/package/lobsteripsum
* https://www.npmjs.com/package/bacon-stream
* https://www.npmjs.com/package/neah
* https://www.npmjs.com/package/mayonnaise.js */
