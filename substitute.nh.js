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
  var allowed = new Array('EVALUATE');
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
          this.evaluate();
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
      if (match.indexOf('{{{') === 0) { encode = false; }
      if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? ((encode) ? o.htmlEncode(object[name]) : object[name]) : '';
    });
  },
  evaluate: function () {
    for (key in this.object) {
      if (typeof this.object[key] === 'function') {
        var val = this.object[key]();
        this.object[key] = this.substitute(val, this.object);
      }
    }
    return this.object;
  },
  htmlEncode: function  (str) {
    return str.replace(/[&<>"']/g, function($0) {
        return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
    }); 
  }  
} 