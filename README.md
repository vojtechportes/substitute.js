Javascript class substituting keywords in string using an object. With Substitute.js you are also able to use few basic helpers and evaluate functions inside object.

--

## 1. Docs

___Declaration___

new Substitute(arguments)

___Arguments___

arguments parameter is an object.

	1. element
	2. options
	3. object
	4. callbackInit
	5. callbackRevert

___Methods:___

	1. init()
	2. revert()

___Placeholders:___

	1. {{string}} - print value with escaping
	2. {{{string}}} - print value without escaping
	3. {{string(helper,...)}}, {{{string(helper,...)}}} - print value with, without escaping using helpers

___Options:___

	1. EVALUATE

___Helpers:___

	1. lower
	2. upper
	3. firstUpper
	4. trim
	5. repeat:count
	6. replace:find:replace
	7. substring:start:length
	8. stripTags
	9. round
	10. parseInt
  
## Example

**Example**

    var obj = {
      'string_1': function(){ return 'The sky was dark. {{{string_2}}}'; },
      'string_2': '<strong>It was November. Although it was not yet late.</strong>',
      'string_3': 'run ',
    };
    
    var s = new Substitute({
			element: document.getElementById('substitute'),
			object: obj,
			options: ['EVALUATE'],
			callbackInit: (function(){ document.getElementById('status').className = 'replaced'; }),
			callbackRevert: (function(){ document.getElementById('status').className = 'reverted'; }),
		});
    
    function init() {
      s.init();
    }
    function revert() {
      s.revert();
    }