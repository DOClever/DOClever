# Create Microsoft Office Word Document Reference

## Contents: ##

- [Creating the document object](#basic)
- [The document object's settings](#settings)
- [The paragraph API](#prgapi)

<a name="basic"></a>
## Creating the document object: ##

First, if you didn't have it yet, get access to the officegen module:

```js
var officegen = require ( 'officegen' );
```

Now you have few ways to use it to create a docx based document. The simple way is to use this code:

```js
var docx = officegen ( 'docx' );
```

But if you want to pass some settings then you should use the following format:

```js
var docx = officegen ({
	type: 'docx', // We want to create a Microsoft Word document.
	... // Extra options goes here.
});
```

<a name="settings"></a>
### The document object's settings: ###

- author (string) - The document's author (part of the Document's Properties in Office).
- creator (string) - Alias. The document's author (part of the Document's Properties in Office).
- description (string) - The document's properties comments (part of the Document's Properties in Office).
- keywords (string) - The document's keywords (part of the Document's Properties in Office).
- orientation (string) - Either 'landscape' or 'portrait'. The default is 'portrait'.
- subject (string) - The document's subject (part of the Document's Properties in Office).
- title (string) - The document's title (part of the Document's Properties in Office).

You can always change some of these settings after creating the docx object using there methods:

```js
docx.setDocTitle ( '...' );
docx.setDocSubject ( '...' );
docx.setDocKeywords ( '...' );
docx.setDescription ( '...' );
docx.setDocCategory ( '...' );
docx.setDocStatus ( '...' );
```

<a name="prgapi"></a>
## The paragraph API: ##

To create a new paragraph object:

```js
var pObj = docx.createP ( options );
```

When the options are:

- align (string) - Can be either 'left' (the default), 'right', 'center' or 'justify'.

### Paragraph's methods: ###

```js
pObj.addText ( textString, options );
```

When the options are:

- back (string) - background color code, for example: 'ffffff' (white) or '000000' (black).
	- shdType (string) - Optional pattern code to use: 'clear' (no pattern), 'pct10', 'pct12', 'pct15', 'diagCross', 'diagStripe', 'horzCross', 'horzStripe', 'nil', 'thinDiagCross', 'solid', etc.
	- shdColor (string) - The front color for the pattern (used with shdType).
- bold (boolean) - true to make the text bold.
- border (string) - the border type: 'single', 'dashDotStroked', 'dashed', 'dashSmallGap', 'dotDash', 'dotDotDash', 'dotted', 'double', 'thick', etc.
- color (string) - color code, for example: 'ffffff' (white) or '000000' (black).
- italic (boolean) - true to make the text italic.
- underline (boolean) - true to add underline.
- font_face (string) - the font to use.
- font_size (number) - the font size in points.
- highlight (string) - highlight color. Either 'black', 'blue', 'cyan', 'darkBlue', 'darkCyan', 'darkGray', 'darkGreen', 'darkMagenta', 'darkRed', 'darkYellow', 'green', 'lightGray', 'magenta', 'none', 'red', 'white' or 'yellow'.
