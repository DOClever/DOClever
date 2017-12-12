
var officegen = require('../');

var fs = require('fs');

var ppsx = officegen ( 'ppsx' );

ppsx.on ( 'finalize', function ( written ) {
			console.log ( 'Finish to create a PowerPoint slideshow file.\nTotal bytes created: ' + written + '\n' );
		});

ppsx.on ( 'error', function ( err ) {
			console.log ( err );
		});

ppsx.setDocTitle ( 'Sample ppsx Document' );

slide = ppsx.makeNewSlide ();
slide.name = 'The first slide!';
slide.back = 'ff0000';
slide.color = '000000';
slide.addText ( 'Hello World!', { x: 60, y: 10, font_size: 56, cx: 1000 } );
slide.addText ( 'Office generator', { y: 85, font_size: 48 } );
slide = ppsx.makeNewSlide ();
slide.back = { type: 'solid', color: '00ff00' };
slide = ppsx.makeNewSlide ();
slide = ppsx.makeNewSlide ();

var out = fs.createWriteStream ( 'tmp/out.ppsx' );

out.on ( 'error', function ( err ) {
	console.log ( err );
});

ppsx.generate ( out );

