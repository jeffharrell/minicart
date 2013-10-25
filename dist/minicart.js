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
	Pubsub = require('./util/pubsub'),
	Storage = require('./util/storage'),
    constants = require('./constants'),
    currency = require('./util/currency'),
	mixin = require('./util/mixin');


function Cart(name, duration) {
    var data, items, settings, len, i;

	this._items = [];
	this._settings = {};

	Pubsub.call(this);
	Storage.call(this, name, duration);

	if ((data = this.load())) {
		items = data.items;
		settings = data.settings;

		if (items) {
			for (i = 0, len = items.length; i < len; i++) {
				this.add(items[i]);
			}
		}

		if (settings) {
			this._settings = settings;
		}
    }
}


mixin(Cart.prototype, Pubsub.prototype);
mixin(Cart.prototype, Storage.prototype);


Cart.prototype.add = function add(data) {
    var that = this,
		items = this.items(),
        product, idx, key, len, i;

	// Prune cart settings data from the product
	for (key in data) {
		if (constants.SETTINGS.test(key)) {
			this._settings[key] = data[key];
			delete data[key];
		}
	}

	// Look to see if the same product has already been added
	for (i = 0, len = items.length; i < len; i++) {
		if (items[i].isEqual(data)) {
			product = items[i];
			product.set('quantity', product.get('quantity') + (parseInt(data.quantity, 10) || 1));
			idx = i;
			break;
		}
	}

	// If not, then add it
	if (!product) {
		product = new Product(data);
		idx = (this._items.push(product) - 1);

		product.on('change', function (key, value) {
			that.save();
			that.fire('change', idx, key, value);
		});

		this.save();
		this.fire('add', idx, data);
	}

    return idx;
};


Cart.prototype.items = function get(idx) {
    return (typeof idx === 'number') ? this._items[idx] : this._items;
};


Cart.prototype.settings = function settings(name) {
	return (name) ? this._settings[name] : this._settings;
};


Cart.prototype.total = function total(config) {
    var products = this.items(),
        result = 0,
        i, len;

    for (i = 0, len = products.length; i < len; i++) {
        result += products[i].total();
    }

	return currency(result, this.settings('currency_code'), config);
};


Cart.prototype.remove = function remove(idx) {
    var data = this._items.splice(idx, 1);

    if (data) {
		this.save();
        this.fire('remove', idx, data[0]);
    }

    return !!data.length;
};


Cart.prototype.save = function save() {
	var items = this.items(),
		data = [],
		i, len;

	for (i = 0, len = items.length; i < len; i++) {
		data.push(items[i].get());
	}

	Storage.prototype.save.call(this, {
		items: data,
		settings: this.settings()
	});
};


Cart.prototype.destroy = function destroy() {
	Storage.prototype.destroy.call(this);

    this._items = [];
    this.fire('destroy');
};




module.exports = Cart;

},{"./constants":3,"./product":5,"./util/currency":6,"./util/mixin":9,"./util/pubsub":10,"./util/storage":11}],2:[function(require,module,exports){
'use strict';


var mixin = require('./util/mixin');


var defaults = module.exports = {

    name: 'PPMiniCart',

    parent: (typeof document !== 'undefined') ? document.body : null,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    template: '<form method="post" action="<%= config.action %>" target="<%= config.target %>">	<ul>		<% for (var items = cart.items(), i= 0, len = items.length; i < len; i++) { %>			<li class="minicart-item">				<a class="minicart-name" href="<%= items[i].link %>"><%= items[i].get("item_name") %></a>				<ul class="minicart-attributes">					<% if (items[i].get("item_number")) { %>						<li><%= items[i].get("item_number") %></li>					<% } %>					<% for (var options = items[i].options(), j = 0, len2 = options.length; j < len2; j++) { %>						<li><%= options[j].key %>: <%= options[j].value %></li>					<% } %>				</ul>				<input class="minicart-quantity" data-minicart-idx="<%= i %>" name="quantity_<%= i %>" value="<%= items[i].get("quantity") %>" autocomplete="off" />				<input class="minicart-remove" data-minicart-idx="<%= i %>" type="button" />				<span class="minicart-price"><%= items[i].total({ format: true }) %></span>				<input type="hidden" name="item_name_<%= i %>" value="<%= items[i].get("item_name") %>" />				<input type="hidden" name="item_number_<%= i %>" value="<%= items[i].get("item_number") %>" />				<input type="hidden" name="amount_<%= i %>" value="<%= items[i].get("amount") %>" />			</li>		<% } %>	</ul>	<div>		<div class="minicart-subtotal">			<%= config.strings.subtotal %>			<span class="minicart-subtotal-amount"><%= cart.total({ format: true, currencyCode: true }) %></span>		</div>		<input class="minicart-submit" type="submit" value="<%= config.strings.button %>" data-test-processing="<%= config.strings.processing %>" />	</div>	<input type="hidden" name="cmd" value="_cart" />	<input type="hidden" name="upload" value="1" />	<input type="hidden" name="bn" value="MiniCart_AddToCart_WPS_US" />	<% var settings = cart.settings(); for (var key in settings) { %>		<input type="hidden" name="<%= key %>" value="<%= settings[key] %>" />	<% } %></form>',

    styles: '.minicart-showing #PPMiniCart {	display: block;}#PPMiniCart {	display: none;}#PPMiniCart form {	position: absolute;	top: 50%;	left: 50%;	width: 300px;	max-height: 400px;	margin-left: -150px;	margin-top: -200px;	padding: 10px;	background: #fff url(http://www.minicartjs.com/build/images/minicart_sprite.png) no-repeat -125px -60px;	border: 1px solid #999;	border-radius: 5px;	box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);	font: 13px/normal arial, helvetica;	color: #333;}#PPMiniCart ul {	margin: 45px 0 13px;	padding: 0;	list-style-type: none;	border-bottom: 1px solid #ccc;}#PPMiniCart .minicart-item {	position: relative;	height: 30px;	padding: 6px;	border-top: 1px solid #f2f2f2;}#PPMiniCart .minicart-item a {	position: absolute;	top: 6px;	left: 0;	width: 185px;	text-decoration: none;}#PPMiniCart .minicart-attributes {	position: absolute;	top: 20px;	left: 0;	margin: 0;	color: #999;	border: 0;}#PPMiniCart .minicart-attributes li {	display: inline;}#PPMiniCart .minicart-attributes li:after {	content: ",";}#PPMiniCart .minicart-attributes li:last-child:after {	content: "";}#PPMiniCart .minicart-quantity {	position: absolute;	left: 190px;	width: 30px;}#PPMiniCart .minicart-remove {	position: absolute;	top: 10px;	left: 230px;	width: 14px;	height: 14px;	background: url(http://www.minicartjs.com/build/images/minicart_sprite.png) no-repeat -134px -4px;	border: 0;	cursor: pointer;}#PPMiniCart .minicart-price {	display: block;	text-align: right;}#PPMiniCart .minicart-subtotal {	float: left;	font-weight: bold;}#PPMiniCart .minicart-submit {	float: right;	padding: 1px 4px;	background: #ffa822 url(http://www.minicartjs.com/build/images/minicart_sprite.png) repeat-x left center;	border: 1px solid #d5bd98;	border-right-color: #935e0d;	border-bottom-color: #935e0d;	border-radius: 2px;	cursor: pointer;}',

    strings: {
        button: 'Checkout',
        subtotal: 'Subtotal:',
        discount: 'Discount:',
        processing: 'Processing...'
    }

};


module.exports.load = function load(userConfig) {
    return mixin(defaults, userConfig);
};

},{"./util/mixin":9}],3:[function(require,module,exports){
'use strict';


module.exports = {

    COMMANDS: { _cart: true, _xclick: true, _donations: true },

    SETTINGS: /^(?:business|currency_code|lc|paymentaction|no_shipping|cn|no_note|invoice|handling_cart|weight_cart|weight_unit|tax_cart|page_style|image_url|cpp_|cs|cbt|return|cancel_return|notify_url|rm|custom|charset)/,

	SHOWING: 'minicart-showing'

};

},{}],4:[function(require,module,exports){
'use strict';

// TODO:
// - UI tests
// - cross browser support


var Cart = require('./cart'),
	View = require('./view'),
    config = require('./config'),
    minicart = {},
	cartModel,
	confModel,
	viewModel;


minicart.render = function render(userConfig) {
	confModel = config.load(userConfig);
	cartModel = new Cart(confModel.name, confModel.duration);

	viewModel = new View({
		config: confModel,
		cart: cartModel
	});

	cartModel.on('add', viewModel.addItem, viewModel);
	cartModel.on('change', viewModel.changeItem, viewModel);
	cartModel.on('remove', viewModel.removeItem, viewModel);
};


minicart.show = function () {
	viewModel && viewModel.show();
};


minicart.hide = function () {
	viewModel && viewModel.hide();
};


minicart.toggle = function () {
	viewModel && viewModel.toggle();
};


minicart.reset = function reset() {
    cartModel.destroy();

	viewModel.hide();
	viewModel.redraw();
};




// Export for either the browser or node
if (typeof window === 'undefined') {
	module.exports = minicart;
} else {
	if (!window.paypal) {
		window.paypal = {};
	}

	window.paypal.minicart = minicart;
}

},{"./cart":1,"./config":2,"./view":13}],5:[function(require,module,exports){
'use strict';


var currency = require('./util/currency'),
	Pubsub = require('./util/pubsub'),
	mixin = require('./util/mixin');


var parser = {
	quantity: function (value) {
		value = parseInt(value, 10);

		if (isNaN(value) || !value) {
			value = 1;
		}

		return value;
	},
	amount: function (value) {
		return parseFloat(value) || 0;
	},
	href: function (value) {
		if (value) {
			return value;
		} else {
			return (typeof window !== 'undefined') ? window.location.href : null;
		}
	}
};


function Product(data) {
	data.quantity = parser.quantity(data.quantity);
	data.amount = parser.amount(data.amount);
	data.href = parser.href(data.href);

    this._data = data;
	this._options = null;
	this._amount = null;
	this._total = null;

	Pubsub.call(this);
}


mixin(Product.prototype, Pubsub.prototype);


Product.prototype.get = function get(key) {
    return (key) ? this._data[key] : this._data;
};


Product.prototype.set = function set(key, value) {
	var setter = parser[key];

	this._data[key] = setter ? setter(value) : value;
	this._options = null;
	this._amount = null;
	this._total = null;

    this.fire('change', key);
};


Product.prototype.options = function options() {
	var result, key, value, amount, i, j;

	if (!this._options) {
		result = [];
		i = 0;

		while ((key = this.get('on' + i))) {
			value = this.get('os' + i);
			amount = 0;
			j = 0;

			while (typeof this.get('option_select' + j) !== 'undefined') {
				if (this.get('option_select' + j) === value) {
					amount = parser.amount(this.get('option_amount' + j));
					break;
				}

				j++;
			}

			result.push({
				key: key,
				value: value,
				amount: amount
			});

			i++;
		}

		this._options = result;
	}

	return this._options;
};


Product.prototype.discount = function discount() {
	var flat = parser.amount(this.get('discount_amount')),
		rate = parser.amount(this.get('discount_rate')),
		num = parseInt(this.get('discount_num'), 10) || 0,
		limit = Math.max(num, this.get('quantity') - 1),
		result = 0,
		amount;

	if (flat) {
		result += flat;
		result += parser.amount(this.get('discount_amount2') || flat) * limit;
	} else if (rate) {
		amount = this.amount();

		result += rate * amount / 100;
		result += parser.amount(this.get('discount_rate2') || rate) * amount * limit / 100;
	}

	return result.toFixed(2);
};


Product.prototype.amount = function amount(config) {
	var result, options, len, i;

	if (!this._amount) {
		result = this.get('amount');
		options = this.options();

		for (i = 0, len = options.length; i < len; i++) {
			result += options[i].amount;
		}

		this._amount = result;
	}

	return currency(this._amount, null, config);
};

Product.prototype.total = function total(config) {
	var result;

	if (!this._total) {
		result  = this.get('quantity') * this.amount();
		result -= this.discount();

		this._total = parser.amount(result);
	}

	return currency(this._total, null, config);
};


Product.prototype.isEqual = function isEqual(data) {
	var match = false;

	if (data instanceof Product) {
		data = data._data;
	}

	if (this.get('item_name') === data.item_name) {
		if (this.get('item_number') === data.item_number) {
			if (this.get('amount') === parser.amount(data.amount)) {
				var i = 0;

				match = true;

				while (typeof data['os' + i] !== 'undefined') {
					if (this.get('os' + i) !== data['os' + i]) {
						match = false;
						break;
					}

					i++;
				}
			}
		}
	}

	return match;
};


Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};




module.exports = Product;

},{"./util/currency":6,"./util/mixin":9,"./util/pubsub":10}],6:[function(require,module,exports){
'use strict';


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
};


module.exports = function currency(amount, code, config) {
    var value = currencies[code || 'USD'] || {},
        before = value.before || '',
        after = value.after || '',
        length = value.length || 2,
		result = amount;

	if (config && config.format) {
		result = before + result.toFixed(length) + after;
	}

	if (config && config.currencyCode && code) {
		result += ' ' + code;
	}

    return result;
};

},{}],7:[function(require,module,exports){
'use strict';


module.exports = (function (window, document) {

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

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);
},{}],8:[function(require,module,exports){
'use strict';


var forms = module.exports = {

    parse: function parse(form) {
        var raw = form.elements,
            data = {},
            pair, value, i, len;

        for (i = 0, len = raw.length; i < len; i++) {
            pair = raw[i];

            if ((value = forms.getInputValue(pair))) {
                data[pair.name] = value;
            }
        }

        return data;
    },


    getInputValue: function getInputValue(input) {
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
    }

};
},{}],9:[function(require,module,exports){
'use strict';


var mixin = module.exports = function mixin(dest, source) {
	var value;

	for (var key in source) {
		value = source[key];

		if (value && value.constructor === Object) {
			mixin(dest[key], value);
		} else {
			dest[key] = value;
		}
	}

	return dest;
};

},{}],10:[function(require,module,exports){
'use strict';


function Pubsub() {
	this._eventCache = {};
}


Pubsub.prototype.on = function on(name, fn, scope) {
	var cache = this._eventCache[name];

	if (!cache) {
		cache = this._eventCache[name] = [];
	}

	cache.push([fn, scope]);
};


Pubsub.prototype.off = function off(name, fn) {
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


Pubsub.prototype.fire = function on(name) {
	var cache = this._eventCache[name], i, len, fn, scope;

	if (cache) {
		for (i = 0, len = cache.length; i < len; i++) {
			fn = cache[i][0];
			scope = cache[i][1] || this;

			if (typeof fn === 'function') {
				fn.apply(scope, Array.prototype.slice.call(arguments, 1));
			}
		}
	}
};


module.exports = Pubsub;

},{}],11:[function(require,module,exports){
'use strict';


(function (window, document) {

	var proto;


	var Storage = module.exports = function Storage(name, duration) {
		this._name = name;
		this._duration = duration || 30;
	};


	proto = Storage.prototype;


	// Node
	if (!window) {

		proto.load = function () {};
		proto.save = function (items) {};
		proto.destroy = function () {};

	// HTML5
	} else if (window.localStorage) {

		proto.load = function () {
			var data = localStorage.getItem(this._name),
				today,
				expires;

			if (data) {
				data = JSON.parse(decodeURIComponent(data));
			}

			if (data && data.expires) {
				today = new Date();
				expires = new Date(data.expires);

				if (today > expires) {
					this.remove();
					return;
				}
			}

			return data && data.value;
		};

		proto.save = function (data) {
			var expires = new Date(),
				wrapped = {};

			expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

			wrapped = {
				value: data,
				expires: expires.toGMTString()
			};

			localStorage.setItem(this._name, encodeURIComponent(JSON.stringify(wrapped)));
		};

		proto.destroy = function () {
			localStorage.removeItem(this._name);
		};

	// Legacy
	} else {
		proto.load = function () {
			var key = this._name + '=',
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
		};

		proto.save = function (data, expiry) {
			var expires = new Date();

			expires.setTime(expires.getTime() + (expiry || this._duration) * 24 * 60 * 60 * 1000);
			document.cookie = this._.name + '=' + encodeURIComponent(JSON.stringify(data)) + '; expires=' + expires.toGMTString() + '; path=/';
		};

		proto.destroy = function () {
			this.save(null, -1);
		};
	}

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);


},{}],12:[function(require,module,exports){
/*global EJS:true */

'use strict';


module.exports = function template(str, data) {
    return new EJS({text: str}).render(data);
};
},{}],13:[function(require,module,exports){
'use strict';


var config = require('./config'),
	events = require('./util/events'),
	template = require('./util/template'),
	forms = require('./util/forms'),
	constants = require('./constants');



function addStyles() {
	var head, style;

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
}


function addEvents(view) {
	var forms, form, i, len, keyupTimer;


	events.add(document, 'click', function (e) {
		var target = e.target;

		if (target.className === 'minicart-remove') {
			view.model.cart.remove(target.getAttribute('data-minicart-idx'));
		} else if (view.isShowing) {
			if (!(/input|button|select|option/i.test(target.tagName))) {
				while (target.nodeType === 1) {
					if (target === view.el) {
						return;
					}

					target = target.parentNode;
				}

				view.hide();
			}
		}
	});


	events.add(document, 'keyup', function (e) {
		var target = e.target;

		if (target.className === 'minicart-quantity') {
			keyupTimer = setTimeout(function () {
				var product = view.model.cart.items(parseInt(target.getAttribute('data-minicart-idx'), 10));

				if (product) {
					product.set('quantity', target.value);
				}
			}, 250);
		}
	});


	events.add(window, 'pageshow', function (e) {
		if (e.persisted) {
			view.redraw();
			view.hide();
		}
	});


	forms = document.getElementsByTagName('form');

	for (i = 0, len = forms.length; i < len; i++) {
		form = forms[i];

		if (form.cmd && constants.COMMANDS[form.cmd.value]) {
			view.bind(form);
		}
	}
}



function View(model) {
	var wrapper = document.createElement('div');
	wrapper.id = config.name;

	config.parent.appendChild(wrapper);

	this.el = wrapper;
	this.model = model;
	this.isShowing = false;
	this.redraw();

	addStyles();
	addEvents(this);
}


View.prototype.redraw = function redraw() {
	this.el.innerHTML = template(config.template, this.model);
};


View.prototype.show = function show() {
	if (!this.isShowing) {
		document.body.classList.add(constants.SHOWING);
		this.isShowing = true;
	}
};


View.prototype.hide = function hide() {
	if (this.isShowing) {
		document.body.classList.remove(constants.SHOWING);
		this.isShowing = false;
	}
};


View.prototype.toggle = function toggle() {
	this[this.isShowing ? 'hide' : 'show']();
};


View.prototype.bind = function bind(form) {
	var that = this;

	if (form.add) {
		events.add(form, 'submit', function (e) {
			e.preventDefault(e);
			that.model.cart.add(forms.parse(form));
		});
	} else if (form.display) {
		events.add(form, 'submit', function (e) {
			e.preventDefault();
			that.show();
		});
	} else {
		return false;
	}

	return true;
};


View.prototype.addItem = function addItem(idx, data) {
	this.redraw();
	this.show();

	var els = this.el.getElementsByClassName('minicart-item');
	els[idx].classList.add('minicart-item-new');
};


View.prototype.changeItem = function changeItem(idx, data) {
	this.redraw();
	this.show();

	var els = this.el.getElementsByClassName('minicart-item');
	els[idx].classList.add('minicart-item-new');
};


View.prototype.removeItem = function removeItem(idx) {
	this.redraw();

	if (this.model.cart.items().length === 0) {
		this.hide();
	} else {
		this.show();
	}
};




module.exports = View;

},{"./config":2,"./constants":3,"./util/events":7,"./util/forms":8,"./util/template":12}]},{},[2,1,3,4,5,6,7,8,9,10,11,12,13])
;