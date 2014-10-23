/*
---
Substitute.js: The substitute JavaScript class
...
*/

/*
---

name: substitute.js

description: Javascript class substituting keywords in string using an object

license: MIT-style license.

copyright: Copyright (c) 2014 [Vojtech Vaclav Portes] (http://substitute.justart.org).

authors: Vojtech Vaclav Portes (http://me.justart.org)

...
*/

function Substitute(arguments){ 
	if (typeof arguments === 'undefined' || typeof arguments !== 'object') {
		var arguments = new Object();
	}
  var allowed = new Array('EVALUATE', 'NESTED_OBJECTS');
  if (typeof arguments.element === 'undefined') {
    arguments['element'] = document.getElementsByTagName('body')[0];
  }
  if (typeof arguments.object === 'undefined') {
    arguments['object'] = new Object();
  }
  if (typeof arguments.options === 'object' && Array.isArray(arguments.options) === true) {
    for (key in arguments.options) {
      var val = arguments.options[key];
      if (allowed.indexOf(val) < 0) {
        arguments.options.splice(key);
      }
    } 
  } else {
    arguments['options'] = new Array();  
  } 

  this.callbackInit = arguments.callbackInit;
  this.callbackRevert = arguments.callbackRevert;
  this.element = arguments.element;
  this.options = arguments.options;
  this.object = arguments.object;
  this.backup_obj = {};
  this.backup();
}

Substitute.prototype = {
  init: function () {  	
		for (key in this.options) {
      var val = this.options[key];
      switch (val) {
        case 'EVALUATE':
          this.evaluate(this.object);
          break;
        case 'NESTED_OBJECTS':
        	this.object = this.flatten(this.object);
        	break;
      }
    }
    var string = this.substitute(this.element.innerHTML, this.object);
    this.element.innerHTML = string;		
		if ( this.callbackInit && typeof ( this.callbackInit ) == "function" ) { 
			this.callbackInit();
		}
  },
  backup: function () {
    var i = Object.keys(this.backup_obj).length;
    this.element.setAttribute('data-substitute-index', 's_' + i);
    this.backup_obj[this.element.getAttribute('data-substitute-index')] = this.element.innerHTML;
  },
  revert: function () {
		if (this.element.getAttribute('data-substitute-index') !== null) {
			this.element.innerHTML = this.backup_obj[this.element.getAttribute('data-substitute-index')];
			if ( this.callbackRevert && typeof ( this.callbackRevert ) == "function" ) { 
				this.callbackRevert();
			}
		}
  },
  substitute: function (element, object, regexp) {
    var o = this;
    return String(element).replace(regexp || (/\\?(?:\{)?\{\{([^{}]+)\}\}(?:\})?/g), function(match, name){
      var encode = true;
      if (match.indexOf('{{{') === 0) {
				encode = false;
			}
      if (match.charAt(0) == '\\') return match.slice(1);
			var string = object[name]; 
			return (string != null) ? ((encode) ? o.htmlEncode(string) : string) : '';
		});
	},
	evaluate: function (object) {
		for (key in object) {
			if (typeof object[key] === 'function') {
				var val = object[key]();
				object[key] = this.substitute(val, object);
			}
		}
		for (key in object) {
			var val = object[key];
			object[key] = this.substitute(val, object);
		}
	},
	htmlEncode: function  (str) {
		return str.replace(/[&<>"']/g, function($0) {
			return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
		}); 
	},
	flatten: function (o) {
	  var prefix = arguments[1] || "", out = arguments[2] || {}, name;
	  for (name in o) {
	    if (o.hasOwnProperty(name)) {
	      if (typeof o[name] === "object") {
	        if (Array.isArray(o[name])) {
	          this.flatten(o[name], prefix + name + '[array]', out);
	        } else {
	          this.flatten(o[name], prefix + name + '.', out);
	        }
	      } else {
	        if ((prefix + name).indexOf('[array]') > 0) {
	          var a = prefix.replace('[array]', '[' + name + ']');
	          out[a] = o[name];
	        } else {
	          out[prefix + name] = o[name];        
	        }
	      };
	    }
	  }
	  return out;
	}	
} 