//
// officegen: All the code to generate ??? files.
//
// Please refer to README.md for this module's documentations.
//
// NOTE:
// - Before changing this code please refer to the hacking the code section on README.md.
//
// Copyright (c) 2013 ???;
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

var baseobj = require("./basicgen.js");
var msdoc = require("./msofficegen.js");

///
/// @brief Extend officegen object with ??? support.
///
/// This method extending the given officegen object to create ??? document.
///
/// @param[in] genobj The object to extend.
/// @param[in] new_type The type of object to create.
/// @param[in] options The object's options.
/// @param[in] gen_private Access to the internals of this object.
/// @param[in] type_info Additional information about this type.
///
function makeMyType ( genobj, new_type, options, gen_private, type_info ) {
	// Prepare genobj for MS-Office:
	msdoc.makemsdoc ( genobj, new_type, options, gen_private, type_info );
	gen_private.plugs.makeOfficeGenerator ( 'mytype', 'mytype', {} );

	// ----- API for ??? documents: -----
}

baseobj.registerDocType ( 'mytype', makeMyType );

