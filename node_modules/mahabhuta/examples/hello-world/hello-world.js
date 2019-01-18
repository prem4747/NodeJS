'use strict';

const mahabhuta = require('../../index');

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
