/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

(function(){
    

var rsplit = function(string, regex) {
	var result = regex.exec(string),retArr = new Array(), first_idx, last_idx, first_bit;
	while (result != null)
	{
		first_idx = result.index; last_idx = regex.lastIndex;
		if ((first_idx) != 0)
		{
			first_bit = string.substring(0,first_idx);
			retArr.push(string.substring(0,first_idx));
			string = string.slice(first_idx);
		}		
		retArr.push(result[0]);
		string = string.slice(result[0].length);
		result = regex.exec(string);	
	}
	if (! string == '')
	{
		retArr.push(string);
	}
	return retArr;
},
chop =  function(string){
    return string.substr(0, string.length - 1);
},
extend = function(d, s){
    for(var n in s){
        if(s.hasOwnProperty(n))  d[n] = s[n]
    }
}


EJS = function( options ){
	options = typeof options == "string" ? {view: options} : options
    this.set_options(options);
	if(options.precompiled){
		this.template = {};
		this.template.process = options.precompiled;
		EJS.update(this.name, this);
		return;
	}
    if(options.element)
	{
		if(typeof options.element == 'string'){
			var name = options.element
			options.element = document.getElementById(  options.element )
			if(options.element == null) throw name+'does not exist!'
		}
		if(options.element.value){
			this.text = options.element.value
		}else{
			this.text = options.element.innerHTML
		}
		this.name = options.element.id
		this.type = '['
	}else if(options.url){
        options.url = EJS.endExt(options.url, this.extMatch);
		this.name = this.name ? this.name : options.url;
        var url = options.url
        //options.view = options.absolute_url || options.view || options.;
		var template = EJS.get(this.name /*url*/, this.cache);
		if (template) return template;
	    if (template == EJS.INVALID_PATH) return null;
        try{
            this.text = EJS.request( url+(this.cache ? '' : '?'+Math.random() ));
        }catch(e){}

		if(this.text == null){
            throw( {type: 'EJS', message: 'There is no template at '+url}  );
		}
		//this.name = url;
	}
	var template = new EJS.Compiler(this.text, this.type);

	template.compile(options, this.name);

	
	EJS.update(this.name, this);
	this.template = template;
};
/* @Prototype*/
EJS.prototype = {
	/**
	 * Renders an object with extra view helpers attached to the view.
	 * @param {Object} object data to be rendered
	 * @param {Object} extra_helpers an object with additonal view helpers
	 * @return {String} returns the result of the string
	 */
    render : function(object, extra_helpers){
        object = object || {};
        this._extra_helpers = extra_helpers;
		var v = new EJS.Helpers(object, extra_helpers || {});
		return this.template.process.call(object, object,v);
	},
    update : function(element, options){
        if(typeof element == 'string'){
			element = document.getElementById(element)
		}
		if(options == null){
			_template = this;
			return function(object){
				EJS.prototype.update.call(_template, element, object)
			}
		}
		if(typeof options == 'string'){
			params = {}
			params.url = options
			_template = this;
			params.onComplete = function(request){
				var object = eval( request.responseText )
				EJS.prototype.update.call(_template, element, object)
			}
			EJS.ajax_request(params)
		}else
		{
			element.innerHTML = this.render(options)
		}
    },
	out : function(){
		return this.template.out;
	},
    /**
     * Sets options on this view to be rendered with.
     * @param {Object} options
     */
	set_options : function(options){
        this.type = options.type || EJS.type;
		this.cache = options.cache != null ? options.cache : EJS.cache;
		this.text = options.text || null;
		this.name =  options.name || null;
		this.ext = options.ext || EJS.ext;
		this.extMatch = new RegExp(this.ext.replace(/\./, '\.'));
	}
};
EJS.endExt = function(path, match){
	if(!path) return null;
	match.lastIndex = 0
	return path+ (match.test(path) ? '' : this.ext )
}




/* @Static*/
EJS.Scanner = function(source, left, right) {
	
    extend(this,
        {left_delimiter: 	left +'%',
         right_delimiter: 	'%'+right,
         double_left: 		left+'%%',
         double_right:  	'%%'+right,
         left_equal: 		left+'%=',
         left_comment: 	left+'%#'})

	this.SplitRegexp = left=='[' ? /(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/ : new RegExp('('+this.double_left+')|(%%'+this.double_right+')|('+this.left_equal+')|('+this.left_comment+')|('+this.left_delimiter+')|('+this.right_delimiter+'\n)|('+this.right_delimiter+')|(\n)') ;
	
	this.source = source;
	this.stag = null;
	this.lines = 0;
};

EJS.Scanner.to_text = function(input){
	if(input == null || input === undefined)
        return '';
    if(input instanceof Date)
		return input.toDateString();
	if(input.toString) 
        return input.toString();
	return '';
};

EJS.Scanner.prototype = {
  scan: function(block) {
     scanline = this.scanline;
	 regex = this.SplitRegexp;
	 if (! this.source == '')
	 {
	 	 var source_split = rsplit(this.source, /\n/);
	 	 for(var i=0; i<source_split.length; i++) {
		 	 var item = source_split[i];
			 this.scanline(item, regex, block);
		 }
	 }
  },
  scanline: function(line, regex, block) {
	 this.lines++;
	 var line_split = rsplit(line, regex);
 	 for(var i=0; i<line_split.length; i++) {
	   var token = line_split[i];
       if (token != null) {
		   	try{
	         	block(token, this);
		 	}catch(e){
				throw {type: 'EJS.Scanner', line: this.lines};
			}
       }
	 }
  }
};


EJS.Buffer = function(pre_cmd, post_cmd) {
	this.line = new Array();
	this.script = "";
	this.pre_cmd = pre_cmd;
	this.post_cmd = post_cmd;
	for (var i=0; i<this.pre_cmd.length; i++)
	{
		this.push(pre_cmd[i]);
	}
};
EJS.Buffer.prototype = {
	
  push: function(cmd) {
	this.line.push(cmd);
  },

  cr: function() {
	this.script = this.script + this.line.join('; ');
	this.line = new Array();
	this.script = this.script + "\n";
  },

  close: function() {
	if (this.line.length > 0)
	{
		for (var i=0; i<this.post_cmd.length; i++){
			this.push(pre_cmd[i]);
		}
		this.script = this.script + this.line.join('; ');
		line = null;
	}
  }
 	
};


EJS.Compiler = function(source, left) {
    this.pre_cmd = ['var ___ViewO = [];'];
	this.post_cmd = new Array();
	this.source = ' ';	
	if (source != null)
	{
		if (typeof source == 'string')
		{
		    source = source.replace(/\r\n/g, "\n");
            source = source.replace(/\r/g,   "\n");
			this.source = source;
		}else if (source.innerHTML){
			this.source = source.innerHTML;
		} 
		if (typeof this.source != 'string'){
			this.source = "";
		}
	}
	left = left || '<';
	var right = '>';
	switch(left) {
		case '[':
			right = ']';
			break;
		case '<':
			break;
		default:
			throw left+' is not a supported deliminator';
			break;
	}
	this.scanner = new EJS.Scanner(this.source, left, right);
	this.out = '';
};
EJS.Compiler.prototype = {
  compile: function(options, name) {
  	options = options || {};
	this.out = '';
	var put_cmd = "___ViewO.push(";
	var insert_cmd = put_cmd;
	var buff = new EJS.Buffer(this.pre_cmd, this.post_cmd);		
	var content = '';
	var clean = function(content)
	{
	    content = content.replace(/\\/g, '\\\\');
        content = content.replace(/\n/g, '\\n');
        content = content.replace(/"/g,  '\\"');
        return content;
	};
	this.scanner.scan(function(token, scanner) {
		if (scanner.stag == null)
		{
			switch(token) {
				case '\n':
					content = content + "\n";
					buff.push(put_cmd + '"' + clean(content) + '");');
					buff.cr();
					content = '';
					break;
				case scanner.left_delimiter:
				case scanner.left_equal:
				case scanner.left_comment:
					scanner.stag = token;
					if (content.length > 0)
					{
						buff.push(put_cmd + '"' + clean(content) + '")');
					}
					content = '';
					break;
				case scanner.double_left:
					content = content + scanner.left_delimiter;
					break;
				default:
					content = content + token;
					break;
			}
		}
		else {
			switch(token) {
				case scanner.right_delimiter:
					switch(scanner.stag) {
						case scanner.left_delimiter:
							if (content[content.length - 1] == '\n')
							{
								content = chop(content);
								buff.push(content);
								buff.cr();
							}
							else {
								buff.push(content);
							}
							break;
						case scanner.left_equal:
							buff.push(insert_cmd + "(EJS.Scanner.to_text(" + content + ")))");
							break;
					}
					scanner.stag = null;
					content = '';
					break;
				case scanner.double_right:
					content = content + scanner.right_delimiter;
					break;
				default:
					content = content + token;
					break;
			}
		}
	});
	if (content.length > 0)
	{
		// Chould be content.dump in Ruby
		buff.push(put_cmd + '"' + clean(content) + '")');
	}
	buff.close();
	this.out = buff.script + ";";
	var to_be_evaled = '/*'+name+'*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {'+this.out+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";
	
	try{
		eval(to_be_evaled);
	}catch(e){
		if(typeof JSLINT != 'undefined'){
			JSLINT(this.out);
			for(var i = 0; i < JSLINT.errors.length; i++){
				var error = JSLINT.errors[i];
				if(error.reason != "Unnecessary semicolon."){
					error.line++;
					var e = new Error();
					e.lineNumber = error.line;
					e.message = error.reason;
					if(options.view)
						e.fileName = options.view;
					throw e;
				}
			}
		}else{
			throw e;
		}
	}
  }
};


//type, cache, folder
/**
 * Sets default options for all views
 * @param {Object} options Set view with the following options
 * <table class="options">
				<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
				<tr>
					<td>type</td>
					<td>'<'</td>
					<td>type of magic tags.  Options are '&lt;' or '['
					</td>
				</tr>
				<tr>
					<td>cache</td>
					<td>true in production mode, false in other modes</td>
					<td>true to cache template.
					</td>
				</tr>
	</tbody></table>
 * 
 */
EJS.config = function(options){
	EJS.cache = options.cache != null ? options.cache : EJS.cache;
	EJS.type = options.type != null ? options.type : EJS.type;
	EJS.ext = options.ext != null ? options.ext : EJS.ext;
	
	var templates_directory = EJS.templates_directory || {}; //nice and private container
	EJS.templates_directory = templates_directory;
	EJS.get = function(path, cache){
		if(cache == false) return null;
		if(templates_directory[path]) return templates_directory[path];
  		return null;
	};
	
	EJS.update = function(path, template) { 
		if(path == null) return;
		templates_directory[path] = template ;
	};
	
	EJS.INVALID_PATH =  -1;
};
EJS.config( {cache: true, type: '<', ext: '.ejs' } );



/**
 * @constructor
 * By adding functions to EJS.Helpers.prototype, those functions will be available in the 
 * views.
 * @init Creates a view helper.  This function is called internally.  You should never call it.
 * @param {Object} data The data passed to the view.  Helpers have access to it through this._data
 */
EJS.Helpers = function(data, extras){
	this._data = data;
    this._extras = extras;
    extend(this, extras );
};
/* @prototype*/
EJS.Helpers.prototype = {
    /**
     * Renders a new view.  If data is passed in, uses that to render the view.
     * @param {Object} options standard options passed to a new view.
     * @param {optional:Object} data
     * @return {String}
     */
	view: function(options, data, helpers){
        if(!helpers) helpers = this._extras
		if(!data) data = this._data;
		return new EJS(options).render(data, helpers);
	},
    /**
     * For a given value, tries to create a human representation.
     * @param {Object} input the value being converted.
     * @param {Object} null_text what text should be present if input == null or undefined, defaults to ''
     * @return {String} 
     */
	to_text: function(input, null_text) {
	    if(input == null || input === undefined) return null_text || '';
	    if(input instanceof Date) return input.toDateString();
		if(input.toString) return input.toString().replace(/\n/g, '<br />').replace(/''/g, "'");
		return '';
	}
};
    EJS.newRequest = function(){
	   var factories = [function() { return new ActiveXObject("Msxml2.XMLHTTP"); },function() { return new XMLHttpRequest(); },function() { return new ActiveXObject("Microsoft.XMLHTTP"); }];
	   for(var i = 0; i < factories.length; i++) {
	        try {
	            var request = factories[i]();
	            if (request != null)  return request;
	        }
	        catch(e) { continue;}
	   }
	}
	
	EJS.request = function(path){
	   var request = new EJS.newRequest()
	   request.open("GET", path, false);
	   
	   try{request.send(null);}
	   catch(e){return null;}
	   
	   if ( request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
	   
	   return request.responseText
	}
	EJS.ajax_request = function(params){
		params.method = ( params.method ? params.method : 'GET')
		
		var request = new EJS.newRequest();
		request.onreadystatechange = function(){
			if(request.readyState == 4){
				if(request.status == 200){
					params.onComplete(request)
				}else
				{
					params.onComplete(request)
				}
			}
		}
		request.open(params.method, params.url)
		request.send(null)
	}


})();
;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


var Product = require('./product'),
    util = require('./util');


function Cart(data) {
    var i, len;

    this._eventCache = {};
    this._products = [];

    if (data) {
        for (i = 0, len = data.length; i < len; i++) {
            this.add(data[i]);
        }
    }
}


Cart.prototype.on = function on(name, fn) {
    var cache = this._eventCache[name];

    if (!cache) {
        cache = this._eventCache[name] = [];
    }

    cache.push(fn);
};


Cart.prototype.off = function off(name, fn) {
    var cache = this._eventCache[name],
        i, len;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            if (cache[i] === fn) {
                cache = cache.splice(i, 1);
            }
        }
    }
};


Cart.prototype.fire = function on(name) {
    var cache = this._eventCache[name],
        i, len, fn;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            fn = cache[i];

            if (typeof fn === 'function') {
                fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
};


Cart.prototype.add = function add(data) {
    var that = this,
        product = new Product(data),
        idx = (this._products.push(data) - 1);

    product.on('change', function (key, value) {
        that.fire('change', idx, key, value);
    });

    this.fire('add', idx, data);
    return idx;
};


Cart.prototype.get = function get(idx) {
    return this._products[idx];
};


Cart.prototype.getAll = function getAll() {
    return this._products;
};


Cart.prototype.total = function total(options) {
    var products = this.getAll(),
        result = 0,
        i, len;

    for (i = 0, len = products.length; i < len; i++) {
        result += parseFloat(products[i].amount, 2);
    }

    if (options && options.unformatted) {
        return result;
    } else {
        return util.currency(result, 'USD');
    }
};


Cart.prototype.remove = function remove(idx) {
    var data = this._products.splice(idx, 1);

    if (data) {
        this.fire('remove', idx, data[0]);
    }

    return !!data.length;
};


Cart.prototype.destroy = function destroy() {
    this._products = [];
    this.fire('destroy');
};




module.exports = Cart;
},{"./product":4,"./util":5}],2:[function(require,module,exports){
'use strict';


var config = module.exports = {

    name: 'PPMiniCart',

    parent: (typeof document !== 'undefined') ? document.body : null,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    cookiePath: '/',

    bn: 'MiniCart_AddToCart_WPS_US',

    template: '<form method="post" action="<%= config.action %>" target="<%= config.target %>">' +
        '<input type="hidden" name="cmd" value="_cart" />' +
        '<input type="hidden" name="upload" value="1" />' +
        '<input type="hidden" name="bn" value="<%= config.bn %>" />' +
        '<ul>' +
        '<% for (var items = cart.getAll(), i= 0, len = items.length; i < len; i++) { %>' +
        '<li class="minicart-item">' +
        '<a class="minicart-name" href="<%= items[i].link %>"><%= items[i].item_name %></a>' +
        '<span class="minicart-number"><%= items[i].item_number %></span>' +
        '<input class="minicart-quantity" name="quantity_<%= i %>" autocomplete="off" />' +
        '<input class="minicart-remove" type="button" />' +
        '<span class="minicart-price"><%= items[i].amount.toFixed(2) %></span>' +
        '<input type="hidden" name="item_name_<%= i %>" value="<%= items[i].item_name %>" />' +
        '<input type="hidden" name="item_number_<%= i %>" value="<%= items[i].item_number %>" />' +
        '<input type="hidden" name="amount_<%= i %>" value="<%= items[i].amount %>" />' +
        '</li>' +
        '<% } %>' +
        '</ul>' +
        '<div>' +
        '<div class="minicart-subtotal"><%= config.strings.subtotal %> <span class="minicart-subtotal-amount"><%= cart.total() %></span></div>' +
        '<input class="minicart-submit" type="submit" value="<%= config.strings.button %>" data-test-processing="<%= config.strings.processing %>" />' +
        '</div>' +
        //'<input type="hidden" name="business" value="example@minicartjs.com" />' +
        //'<input type="hidden" name="currency_code" value="USD" />' +
        //'<input type="hidden" name="return" value="http://www.minicartjs.com/?success#PPMiniCart=reset" />' +
        //'<input type="hidden" name="cancel_return" value="http://www.minicartjs.com/?cancel" />' +
        '</form>',

    styles: '' +
        '#PPMiniCart form { position: absolute; top: 50%; left: 50%; width: 300px; max-height: 400px; margin-left: -150px; margin-top: -200px; padding: 10px; background: #fff url(http://www.minicartjs.com/build/images/minicart_sprite.png) no-repeat -125px -60px; border: 1px solid #999; border-radius: 5px; box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2); font: 13px/normal arial, helvetica; color: #333; }' +
        '#PPMiniCart ul { margin: 45px 0 13px; padding: 0; list-style-type: none; border-bottom: 1px solid #ccc; }' +
        '#PPMiniCart .minicart-item { position: relative; height: 30px; }' +
        '#PPMiniCart .minicart-item a { text-decoration: none; }' +
        '#PPMiniCart .minicart-quantity { position: absolute; left: 190px; width: 30px; }' +
        '#PPMiniCart .minicart-remove { position: absolute; top: 5px; left: 230px; width: 14px; height: 14px; background: url(http://www.minicartjs.com/build/images/minicart_sprite.png) no-repeat -134px -4px; border: 0; cursor: pointer; }' +
        '#PPMiniCart .minicart-price { position: absolute; left: 0; width: 300px; text-align: right; }' +
        '#PPMiniCart .minicart-subtotal { float: left; font-weight: bold; }' +
        '#PPMiniCart .minicart-submit { float: right; padding: 1px 4px; background: #ffa822 url(http://www.minicartjs.com/build/images/minicart_sprite.png) repeat-x left center; border: 1px solid #d5bd98; border-right-color: #935e0d; border-bottom-color: #935e0d; border-radius: 2px; }',

    strings: {
        button: 'Checkout',
        subtotal: 'Subtotal: ',
        discount: 'Discount: ',
        processing: 'Processing...'
    }

};


module.exports.load = function load(userConfig) {
    // TODO: This should recursively merge the config values
    for (var key in userConfig) {
        config[key] = userConfig[key];
    }

    return config;
};
},{}],3:[function(require,module,exports){
'use strict';


var Cart = require('./cart'),
    config = require('./config'),
    util = require('./util'),
    minicart = {},
    cartModel, isShowing;



function redraw() {
    minicart.el.innerHTML = util.template(config.template, minicart);
    minicart.show();
}


minicart.render = function render(userConfig) {
    var wrapper, head, style;

    minicart.config = config.load(userConfig);

    cartModel = minicart.cart = new Cart();
    cartModel.on('add', redraw);
    cartModel.on('change', redraw);
    cartModel.on('remove', redraw);

    wrapper = minicart.el = document.createElement('div');
    wrapper.id = config.name;

    if (config.styles) {
        style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = config.styles;
        } else {
            style.appendChild(document.createTextNode(config.styles));
        }

        head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    redraw();

    config.parent.appendChild(wrapper);
};


minicart.show = function show() {
    if (!isShowing) {
        config.parent.classList.add('showing');
        isShowing = true;
    }
};


minicart.hide = function hide() {
    if (isShowing) {
        config.parent.classList.remove('showing');
        isShowing = false;
    }
};


minicart.toggle = function toggle() {
    minicart[isShowing ? 'hide' : 'show']();
};


minicart.reset = function reset() {
    minicart.hide();
    cartModel.destroy();

    redraw();
};




// Export for either the browser or node
(function (win) {
    if (!win.paypal) {
        win.paypal = {};
    }

    win.paypal.minicart = minicart;
})(window || module.exports);




},{"./cart":1,"./config":2,"./util":5}],4:[function(require,module,exports){
'use strict';


function Product(data) {
    this._data = data;
    this._eventCache = {};
}


Product.prototype.on = function on(name, fn) {
    var cache = this._eventCache[name];

    if (!cache) {
        cache = this._eventCache[name] = [];
    }

    cache.push(fn);
};


Product.prototype.off = function off(name, fn) {
    var cache = this._eventCache[name],
        i, len;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            if (cache[i] === fn) {
                cache = cache.splice(i, 1);
            }
        }
    }
};


Product.prototype.fire = function on(name) {
    var cache = this._eventCache[name], i, len, fn;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            fn = cache[i];

            if (typeof fn === 'function') {
                fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
};


Product.prototype.get = function get(key) {
    return this._data[key];
};


Product.prototype.set = function set(key, value) {
    var item = this._data[key] = value,
        data = {};

    data[key] = value;

    this.fire('change', data);
};


Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};




module.exports = Product;
},{}],5:[function(require,module,exports){
/*global EJS:true */

'use strict';


var config = require('./config'),
    util = {};


(function (window, document) {


    util.template = function template(str, data) {
        return new EJS({text: str}).render(data);
    };


    util.event = (function () {
        /**
         * Events are added here for easy reference
         */
        var cache = [];

        // NOOP for Node
        if (!document) {
            return {
                add: function () {},
                remove: function () {}
            };
        // Non-IE events
        } else if (document.addEventListener) {
            return {
                /**
                 * Add an event to an object and optionally adjust it's scope
                 *
                 * @param obj {HTMLElement} The object to attach the event to
                 * @param type {string} The type of event excluding "on"
                 * @param fn {function} The function
                 * @param scope {object} Object to adjust the scope to (optional)
                 */
                add: function (obj, type, fn, scope) {
                    scope = scope || obj;

                    var wrappedFn = function (e) { fn.call(scope, e); };

                    obj.addEventListener(type, wrappedFn, false);
                    cache.push([obj, type, fn, wrappedFn]);
                },


                /**
                 * Remove an event from an object
                 *
                 * @param obj {HTMLElement} The object to remove the event from
                 * @param type {string} The type of event excluding "on"
                 * @param fn {function} The function
                 */
                remove: function (obj, type, fn) {
                    var wrappedFn, item, len = cache.length, i;

                    for (i = 0; i < len; i++) {
                        item = cache[i];

                        if (item[0] === obj && item[1] === type && item[2] === fn) {
                            wrappedFn = item[3];

                            if (wrappedFn) {
                                obj.removeEventListener(type, wrappedFn, false);
                                delete cache[i];
                            }
                        }
                    }
                }
            };

        // IE events
        } else if (document.attachEvent) {
            return {
                /**
                 * Add an event to an object and optionally adjust it's scope (IE)
                 *
                 * @param obj {HTMLElement} The object to attach the event to
                 * @param type {string} The type of event excluding "on"
                 * @param fn {function} The function
                 * @param scope {object} Object to adjust the scope to (optional)
                 */
                add: function (obj, type, fn, scope) {
                    scope = scope || obj;

                    var wrappedFn = function () {
                        var e = window.event;
                        e.target = e.target || e.srcElement;

                        e.preventDefault = function () {
                            e.returnValue = false;
                        };

                        fn.call(scope, e);
                    };

                    obj.attachEvent('on' + type, wrappedFn);
                    cache.push([obj, type, fn, wrappedFn]);
                },


                /**
                 * Remove an event from an object (IE)
                 *
                 * @param obj {HTMLElement} The object to remove the event from
                 * @param type {string} The type of event excluding "on"
                 * @param fn {function} The function
                 */
                remove: function (obj, type, fn) {
                    var wrappedFn, item, len = cache.length, i;

                    for (i = 0; i < len; i++) {
                        item = cache[i];

                        if (item[0] === obj && item[1] === type && item[2] === fn) {
                            wrappedFn = item[3];

                            if (wrappedFn) {
                                obj.detachEvent('on' + type, wrappedFn);
                                delete cache[i];
                            }
                        }
                    }
                }
            };
        }
    })();


    util.storage = (function () {
        var name = config.name;

        // NOOP for Node
        if (!window) {
            return {
                load: function () {},
                save: function () {},
                remove: function () {}
            };
        // Use HTML5 client side storage
        } else if (window.localStorage) {
            return {

                /**
                 * Loads the saved data
                 *
                 * @return {object}
                 */
                load: function () {
                    var data = localStorage.getItem(name),
                        todayDate, expiresDate;

                    if (data) {
                        data = JSON.parse(decodeURIComponent(data));
                    }

                    if (data && data.expires) {
                        todayDate = new Date();
                        expiresDate = new Date(data.expires);

                        if (todayDate > expiresDate) {
                            util.storage.remove();
                            return;
                        }
                    }

                    // A little bit of backwards compatibility for the moment
                    if (data && data.value) {
                        return data.value;
                    } else {
                        return data;
                    }
                },


                /**
                 * Saves the data
                 *
                 * @param items {object} The list of items to save
                 * @param duration {Number} The number of days to keep the data
                 */
                save: function (items, duration) {
                    var date = new Date(),
                        data = [],
                        wrappedData, item, len, i;

                    if (items) {
                        for (i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            data.push({
                                product: item.product,
                                settings: item.settings
                            });
                        }

                        date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
                        wrappedData = {
                            value: data,
                            expires: date.toGMTString()
                        };

                        localStorage.setItem(name, encodeURIComponent(JSON.stringify(wrappedData)));
                    }
                },


                /**
                 * Removes the saved data
                 */
                remove: function () {
                    localStorage.removeItem(name);
                }
            };

            // Otherwise use cookie based storage
        } else {
            return {

                /**
                 * Loads the saved data
                 *
                 * @return {object}
                 */
                load: function () {
                    var key = name + '=',
                        data, cookies, cookie, value, i;

                    try {
                        cookies = document.cookie.split(';');

                        for (i = 0; i < cookies.length; i++) {
                            cookie = cookies[i];

                            while (cookie.charAt(0) === ' ') {
                                cookie = cookie.substring(1, cookie.length);
                            }

                            if (cookie.indexOf(key) === 0) {
                                value = cookie.substring(key.length, cookie.length);
                                data = JSON.parse(decodeURIComponent(value));
                            }
                        }
                    } catch (e) {}

                    return data;
                },


                /**
                 * Saves the data
                 *
                 * @param items {object} The list of items to save
                 * @param duration {Number} The number of days to keep the data
                 */
                save: function (items, duration) {
                    var date = new Date(),
                        data = [],
                        item, len, i;

                    if (items) {
                        for (i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            data.push({
                                product: item.product,
                                settings: item.settings
                            });
                        }

                        date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
                        document.cookie = config.name + '=' + encodeURIComponent(JSON.stringify(data)) + '; expires=' + date.toGMTString() + '; path=' + config.cookiePath;
                    }
                },


                /**
                 * Removes the saved data
                 */
                remove: function () {
                    this.save(null, -1);
                }
            };
        }
    })();


    util.currency = function (amount, code) {
        var currencies = {
                AED: { before: '\u062c' },
                ANG: { before: '\u0192' },
                ARS: { before: '$' },
                AUD: { before: '$' },
                AWG: { before: '\u0192' },
                BBD: { before: '$' },
                BGN: { before: '\u043b\u0432' },
                BMD: { before: '$' },
                BND: { before: '$' },
                BRL: { before: 'R$' },
                BSD: { before: '$' },
                CAD: { before: '$' },
                CHF: { before: '' },
                CLP: { before: '$' },
                CNY: { before: '\u00A5' },
                COP: { before: '$' },
                CRC: { before: '\u20A1' },
                CZK: { before: 'Kc' },
                DKK: { before: 'kr' },
                DOP: { before: '$' },
                EEK: { before: 'kr' },
                EUR: { before: '\u20AC' },
                GBP: { before: '\u00A3' },
                GTQ: { before: 'Q' },
                HKD: { before: '$' },
                HRK: { before: 'kn' },
                HUF: { before: 'Ft' },
                IDR: { before: 'Rp' },
                ILS: { before: '\u20AA' },
                INR: { before: 'Rs.' },
                ISK: { before: 'kr' },
                JMD: { before: 'J$' },
                JPY: { before: '\u00A5' },
                KRW: { before: '\u20A9' },
                KYD: { before: '$' },
                LTL: { before: 'Lt' },
                LVL: { before: 'Ls' },
                MXN: { before: '$' },
                MYR: { before: 'RM' },
                NOK: { before: 'kr' },
                NZD: { before: '$' },
                PEN: { before: 'S/' },
                PHP: { before: 'Php' },
                PLN: { before: 'z' },
                QAR: { before: '\ufdfc' },
                RON: { before: 'lei' },
                RUB: { before: '\u0440\u0443\u0431' },
                SAR: { before: '\ufdfc' },
                SEK: { before: 'kr' },
                SGD: { before: '$' },
                THB: { before: '\u0E3F' },
                TRY: { before: 'TL' },
                TTD: { before: 'TT$' },
                TWD: { before: 'NT$' },
                UAH: { before: '\u20b4' },
                USD: { before: '$' },
                UYU: { before: '$U' },
                VEF: { before: 'Bs' },
                VND: { before: '\u20ab' },
                XCD: { before: '$' },
                ZAR: { before: 'R' }
            },
            currency = currencies[code] || {},
            before = currency.before || '',
            after = currency.after || '';

        return before + amount.toFixed(2) + after;
    };


    util.getInputValue = function getInputValue(input) {
        var tag = input.tagName.toLowerCase();

        if (tag === 'select') {
            return input.options[input.selectedIndex].value;
        } else if (tag === 'textarea') {
            return input.innerText;
        } else {
            if (input.type === 'radio') {
                return (input.checked) ? input.value : null;
            } else if (input.type === 'checkbox') {
                return (input.checked) ? input.value : null;
            } else {
                return input.value;
            }
        }
    };

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);



module.exports = util;
},{"./config":2}]},{},[1,2,3,4,5])
;