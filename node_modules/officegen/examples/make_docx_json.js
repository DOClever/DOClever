
var officegen = require('../');

var fs = require('fs');
var path = require('path');

var docx = officegen ( 'docx' );

docx.on ( 'finalize', function ( written ) {
			console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
		});

docx.on ( 'error', function ( err ) {
			console.log ( err );
		});


var table = [
	[{
		val: "No.",
		opts: {
			cellColWidth: 4261,
			b:true,
			sz: '48',
			shd: {
				fill: "7F7F7F",
				themeFill: "text1",
				"themeFillTint": "80"
			},
			fontFamily: "Avenir Book"
		}
	},{
		val: "Title1",
		opts: {
			b:true,
			color: "A00000",
			align: "right",
			shd: {
				fill: "92CDDC",
				themeFill: "text1",
				"themeFillTint": "80"
			}
		}
	},{
		val: "Title2",
		opts: {
			align: "center",
			cellColWidth: 42,
			b:true,
			sz: '48',
			shd: {
				fill: "92CDDC",
				themeFill: "text1",
				"themeFillTint": "80"
			}
		}
	}],
	[1,'All grown-ups were once children',''],
	[2,'there is no harm in putting off a piece of work until another day.',''],
	[3,'But when it is a matter of baobabs, that always means a catastrophe.',''],
	[4,'watch out for the baobabs!','END'],
]

var tableStyle = {
	tableColWidth: 4261,
	tableSize: 24,
	tableColor: "ada",
	tableAlign: "left",
	tableFontFamily: "Comic Sans MS"
}

var data = [[{ align: 'right' }, {
		type: "text",
		val: "Simple"
	}, {
		type: "text",
		val: " with color",
		opt: { color: '000088' }
	}, {
		type: "text",
		val: "  and back color.",
		opt: { color: '00ffff', back: '000088' }
	}, {
		type: "linebreak"
	}, {
		type: "text",
		val: "Bold + underline",
		opt: { bold: true, underline: true }
	}], {
		type: "horizontalline"
	}, [{ backline: 'EDEDED' }, {
		type: "text",
		val: "  backline text1.",
		opt: { bold: true }
	}, {
		type: "text",
		val: "  backline text2.",
		opt: { color: '000088' }
	}], {
		type: "text",
		val: "Left this text.",
		lopt: { align: 'left' }
	}, {
		type: "text",
		val: "Center this text.",
		lopt: { align: 'center' }
	}, {
		type: "text",
		val: "Right this text.",
		lopt: { align: 'right' }
	}, {
		type: "text",
		val: "Fonts face only.",
		opt: { font_face: 'Arial' }
	}, {
		type: "text",
		val: "Fonts face and size.",
		opt: { font_face: 'Arial', font_size: 40 }
	}, {
		type: "table",
		val: table,
		opt: tableStyle
	}, [{}, {
		type: "image",
		path: path.resolve(__dirname, 'images_for_examples/sword_001.png')
	},{
		type: "image",
		path: path.resolve(__dirname, 'images_for_examples/sword_002.png')
	}], {
		type: "pagebreak"
	}, [{}, {
		type: "numlist"
	}, {
		type: "text",
		text: "numList1.",
	}, {
		type: "numlist"
	}, {
		type: "text",
		text: "numList2.",
	}], [{}, {
		type: "dotlist"
	}, {
		type: "text",
		text: "dotlist1.",
	}, {
		type: "dotlist"
	}, {
		type: "text",
		text: "dotlist2.",
	}], {
		type: "pagebreak"
	}
]

var pObj = docx.createByJson(data);

var out = fs.createWriteStream ( 'tmp/out_json.docx' );

out.on ( 'error', function ( err ) {
	console.log ( err );
});

docx.generate ( out );
