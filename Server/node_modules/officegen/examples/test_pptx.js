var officegen = require('../');
var OfficeChart = require('../lib/officechart.js');
var _ = require('lodash');
var async = require('async');

var fs = require('fs');
var path = require('path');

var pptx = officegen('pptx');

var slide;
var pObj;

pptx.on('finalize', function (written) {
  console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n');

  // clear the temporatory files
});

pptx.on('error', function (err) {
  console.log(err);
});

pptx.setDocTitle('Sample PPTX Document');


// this shows how one can get the base XML and modify it directly
var chart0 = new OfficeChart({
  title: 'Dynamically generated',
  renderType: 'bar',
  overlap: 50,
  gapWidth: 25,
  valAxisTitle: "Da Value Axis",
  catAxisTitle: "Da Cat Axis",
  catAxisReverseOrder: true,
  valAxisCrossAtMaxCategory: true,
  valAxisMajorGridlines: true,
  valAxisMinorGridlines: true,
  data: [
    {
      name: 'Income',
      labels: ['2005', '2006', '2007', '2008', '2009'],
      values: [23.5, 26.2, 30.1, 29.5, 24.6],
//            schemeColor: 'accent1'
//            color: 'ff0000',
      xml: {
        "c:spPr": {
          "a:solidFill": {
            "a:schemeClr": { "@val": "accent1"}
          },
          "a:ln": {
            "a:solidFill": {
              "a:schemeClr": { "@val": "tx1"}
            }
          }
        }
      }
    },
    {
      name: 'Expense',
      labels: ['2005', '2006', '2007', '2008', '2009'],
      values: [18.1, 22.8, 23.9, 25.1, 25],
      xml: {
        "c:spPr": {
          "a:solidFill": {
            "a:schemeClr": { "@val": "bg2"}
          },
          "a:ln": {
            "a:solidFill": {
              "a:schemeClr": { "@val": "tx1"}
            }
          }
        }
        //            color: '00ff00',
        //            schemeColor: 'bg2'
      }
    }
  ],
  fontSize: "1200"
//  xml: {
//      "c:txPr": {
//        "a:bodyPr": {},
//        "a:listStyle": {},
//        "a:p": {
//          "a:pPr": {
//            "a:defRPr": {
//              "@sz": "1200"
//            }
//          },
//          "a:endParaRPr": {
//            "@lang": "en-US"
//          }
//        }
//      }
//    }
});

var chartsData = [
  chart0,
  {
    "title": "Marginal distribution for mpg",
    "renderType": "column",
    "valAxisNumFmt": "0%",
    valAxisMaxValue: 24,
    "data": [
      {
        "name": "current",
        "labels": [
          "[NA]",
          "14.1 to 16",
          "16.1 to 18",
          "18.1 to 20",
          "20.1 to 22",
          "22.1 to 24",
          "24.1 to 26",
          "26.1 to 28",
          "28.1 to 30",
          "30.1 to 32",
          "32.1 to 34",
          "44.1 to 46"
        ],
        "values": [
          0.024390243902439025,
          0.17073170731707318,
          0.1951219512195122,
          0.21951219512195122,
          0.14634146341463414,
          0.21951219512195122,
          0,
          0.024390243902439025,
          0,
          0,
          0,
          0
        ],
        "xml": {
          "c:spPr": {
            "a:solidFill": {
              "a:schemeClr": {
                "@val": "accent1"
              }
            },
            "a:ln": {
              "a:solidFill": {
                "a:schemeClr": {
                  "@val": "tx1"
                }
              }
            }
          }

        }
      },

      {
        "name": "baseline",
        "labels": [
          "[NA]",
          "14.1 to 16",
          "16.1 to 18",
          "18.1 to 20",
          "20.1 to 22",
          "22.1 to 24",
          "24.1 to 26",
          "26.1 to 28",
          "28.1 to 30",
          "30.1 to 32",
          "32.1 to 34",
          "44.1 to 46"
        ],
        "values": [
          0.017241379310344827,
          0.008620689655172414,
          0,
          0.017241379310344827,
          0.1896551724137931,
          0.1810344827586207,
          0.29310344827586204,
          0.15517241379310345,
          0.0603448275862069,
          0.034482758620689655,
          0.034482758620689655,
          0.008620689655172414
        ],
        "xml": {
          "c:spPr": {
            "a:solidFill": {
              "a:schemeClr": {
                "@val": "bg2"
              }
            },
            "a:ln": {
              "a:solidFill": {
                "a:schemeClr": {
                  "@val": "tx1"
                }
              }
            }
          }
        }
      }
    ]
  },
  {
    title: 'My production',
    renderType: 'pie',
    data: [
      {
        name: 'Oil',
        labels: ['Czech Republic', 'Ireland', 'Germany', 'Australia', 'Austria', 'UK', 'Belgium'],
        values: [301, 201, 165, 139, 128, 99, 60],
        colors: ['ff0000', '00ff00', '0000ff', 'ffff00', 'ff00ff', '00ffff', '000000']
      }
    ]
  },

  {
    title: 'eSurvey chart',
    renderType: 'column',
    overlap: 50,
    gapWidth: 25,
    valAxisNumFmt: '$0',
    valAxisMaxValue: 24,
    data: [
      {
        name: 'Income',
        labels: ['2005', '2006', '2007', '2008', '2009'],
        values: [23.5, 26.2, 30.1, 29.5, 24.6],
        color: 'ff0000'
      },
      {
        name: 'Expense',
        labels: ['2005', '2006', '2007', '2008', '2009'],
        values: [18.1, 22.8, 23.9, 25.1, 25],
        color: '00ff00'
      }
    ]
  },

  {
    title: 'Sample bar chart',
    renderType: 'bar',
    xmlOptions: {
      "c:title": {
        "c:tx": {
          "c:rich": {
            "a:p": {
              "a:r": {
                "a:t": "Override title via XML"
              }
            }
          }
        }
      }
    },
    data: [
      {
        name: 'europe',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [2.5, 2.6, 2.8],
        color: 'ff0000'
      },
      {
        name: 'namerica',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [2.5, 2.7, 2.9],
        color: '00ff00'
      },
      {
        name: 'asia',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [2.1, 2.2, 2.4],
        color: '0000ff'
      },
      {
        name: 'lamerica',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [0.3, 0.3, 0.3],
        color: 'ffff00'
      },
      {
        name: 'meast',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [0.2, 0.3, 0.3],
        color: 'ff00ff'
      },
      {
        name: 'africa',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [0.1, 0.1, 0.1],
        color: '00ffff'
      }

    ]
  },

  {
    title: 'Group bar chart',
    renderType: 'group-bar',
    data: [
      {
        name: 'europe',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [2.5, 2.6, 2.8],
        color: 'ff0000'
      },
      {
        name: 'namerica',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [2.5, 2.7, 2.9],
        color: '00ff00'
      },
      {
        name: 'asia',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [2.1, 2.2, 2.4],
        color: '0000ff'
      },
      {
        name: 'lamerica',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [0.3, 0.3, 0.3],
        color: 'ffff00'
      },
      {
        name: 'meast',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [0.2, 0.3, 0.3],
        color: 'ff00ff'
      },
      {
        name: 'africa',
        labels: ['Y2003', 'Y2004', 'Y2005'],
        values: [0.1, 0.1, 0.1],
        color: '00ffff'
      }
    ]
  }
];


function generateOneChart(chartInfo, callback) {

  slide = pptx.makeNewSlide();
  slide.name = 'OfficeChart slide';
  slide.back = 'ffffff';
  slide.addChart(chartInfo, null, callback, callback);
}


function generateCharts(callback) {
  async.each(chartsData, generateOneChart, callback);
}

function generateSlideWithHyperlink(callback) {

}


function generateExampleSlides(callback) {
  // do the rest things here
  console.log('finalize');

  // Let's create a new slide:
  slide = pptx.makeNewSlide();

  slide.name = 'The first slide!';

  // Change the background color:
  slide.back = '000000';

  // Declare the default color to use on this slide:
  slide.color = 'ffffff';

  // Basic way to add text string:
  slide.addText('Created using Officegen version ' + officegen.version);
  slide.addText('Fast position', 0, 20);
  slide.addText('Full line', 0, 40, '100%', 20);

  // Add text box with multi colors and fonts:
  slide.addText([
    { text: 'Hello ', options: { font_size: 56 } },
    { text: 'World!', options: { font_size: 56, font_face: 'Arial', color: 'ffff00' } }
  ], { cx: '75%', cy: 66, y: 150 });
  // Please note that you can pass object as the text parameter to addText.

  // For a single text just pass a text string to addText:
  slide.addText('Office generator', { y: 66, x: 'c', cx: '50%', cy: 60, font_size: 48, color: '0000ff' });

  pObj = slide.addText('Boom\nBoom!!!', { y: 100, x: 10, cx: '70%', font_face: 'Wide Latin', font_size: 54, color: 'cc0000', bold: true, underline: true });
  pObj.options.y += 150;

  // 2nd slide:
  slide = pptx.makeNewSlide();

  // For every color property (including the back color property) you can pass object instead of the color string:
  slide.back = { type: 'solid', color: '004400' };
  pObj = slide.addText('Office generator', { y: 'c', x: 0, cx: '100%', cy: 66, font_size: 48, align: 'center', color: { type: 'solid', color: '008800' } });
  pObj.setShadowEffect('outerShadow', { bottom: true, right: true });

  slide = pptx.makeNewSlide();

  slide.show = false;
  slide.addText('Red line', 'ff0000');
  slide.addShape(pptx.shapes.OVAL, { fill: { type: 'solid', color: 'ff0000', alpha: 50 }, line: 'ffff00', y: 50, x: 50 });
  slide.addText('Red box 1', { color: 'ffffff', fill: 'ff0000', line: 'ffff00', line_size: 5, y: 100, rotate: 45 });
  slide.addShape(pptx.shapes.LINE, { line: '0000ff', y: 150, x: 150, cy: 0, cx: 300 });
  slide.addShape(pptx.shapes.LINE, { line: '0000ff', y: 150, x: 150, cy: 100, cx: 0 });
  slide.addShape(pptx.shapes.LINE, { line: '0000ff', y: 249, x: 150, cy: 0, cx: 300 });
  slide.addShape(pptx.shapes.LINE, { line: '0000ff', y: 150, x: 449, cy: 100, cx: 0 });
  slide.addShape(pptx.shapes.LINE, { line: '000088', y: 150, x: 150, cy: 100, cx: 300 });
  slide.addShape(pptx.shapes.LINE, { line: '000088', y: 150, x: 150, cy: 100, cx: 300 });
  slide.addShape(pptx.shapes.LINE, { line: '000088', y: 170, x: 150, cy: 100, cx: 300, line_head: 'triangle' });
  slide.addShape(pptx.shapes.LINE, { line: '000088', y: 190, x: 150, cy: 100, cx: 300, line_tail: 'triangle' });
  slide.addShape(pptx.shapes.LINE, { line: '000088', y: 210, x: 150, cy: 100, cx: 300, line_head: 'stealth', line_tail: 'stealth' });
  pObj = slide.addShape(pptx.shapes.LINE);
  pObj.options.line = '008888';
  pObj.options.y = 210;
  pObj.options.x = 150;
  pObj.options.cy = 100;
  pObj.options.cx = 300;
  pObj.options.line_head = 'stealth';
  pObj.options.line_tail = 'stealth';
  pObj.options.flip_vertical = true;
  slide.addText('Red box 2', { color: 'ffffff', fill: 'ff0000', line: 'ffff00', y: 350, x: 200, shape: pptx.shapes.ROUNDED_RECTANGLE, indentLevel: 1 });

  slide = pptx.makeNewSlide();

  slide.addImage(path.resolve(__dirname, 'images_for_examples/image1.png'), { y: 'c', x: 'c' });

  slide = pptx.makeNewSlide();

  slide.addImage(path.resolve(__dirname, 'images_for_examples/image2.jpg'), { y: 0, x: 0, cy: '100%', cx: '100%' });

  slide = pptx.makeNewSlide();
  slide.addImage(path.resolve(__dirname, 'images_for_examples/image3.png'), { y: 'c', x: 'c'});

  slide = pptx.makeNewSlide();

  slide.addImage(path.resolve(__dirname, 'images_for_examples/image2.jpg'), { y: 0, x: 0, cy: '100%', cx: '100%' });

  slide = pptx.makeNewSlide();

  slide.addImage(path.resolve(__dirname, 'images_for_examples/image2.jpg'), { y: 0, x: 0, cy: '100%', cx: '100%' });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_001.png'), { y: 10, x: 10 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_002.png'), { y: 10, x: 110 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_001.png'), { y: 110, x: 10 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_001.png'), { y: 110, x: 110 });

  slide = pptx.makeNewSlide();

  slide.addImage(path.resolve(__dirname, 'images_for_examples/image2.jpg'), { y: 0, x: 0, cy: '100%', cx: '100%' });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_001.png'), { y: 10, x: 10 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_002.png'), 110, 10);
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_003.png'), { y: 10, x: 210 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_004.png'), { y: 110, x: 10 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_001.png'), { y: 110, x: 110 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_003.png'), { y: 110, x: 210 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_002.png'), { y: 210, x: 10 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_004.png'), { y: 210, x: 110 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_004.png'), { y: 210, x: 210 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_004.png'), { y: '310', x: 10 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_002.png'), { y: 310, x: 110 });
  slide.addImage(path.resolve(__dirname, 'images_for_examples/sword_003.png'), { y: 310, x: 210 });


  callback();
}

function generateTable(callback) {
  slide = pptx.makeNewSlide();

  var rows = [];
  for (var i = 0; i < 12; i++) {
    var row = [];
    for (var j = 0; j < 5; j++) {
      row.push("[" + i + "," + j + "]");
    }
    rows.push(row);
  }
  slide.addTable(rows, {});
  callback();
}

function finalize() {
  var out = fs.createWriteStream('tmp/out2.pptx');

  out.on('error', function (err) {
    console.log(err);
  });

  pptx.generate(out);
}

async.series([
  generateCharts    // new
  , generateTable     // new
    ,generateExampleSlides // inherited from original project
], finalize);