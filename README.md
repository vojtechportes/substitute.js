# Substitute.js
(version 1.01)

Javascript class substituting keywords in string using an object. With Substitute.js you are also able to use few basic helpers and evaluate functions inside object.

--

## 1. Docs

___Declaration___

new Substitute(arguments)

___Arguments___

arguments parameter is an object.

  1. element - element on which will be substitution proceeded
  2. options
  3. object - which object will be used to substitute placeholders
  4. callbackInit - callback when substitution is done
  5. callbackRevert - callbacak when rever of substitution is done

___Methods:___

  1. init()
  2. revert()

___Placeholders:___

  1. **{{string}}** - print value with escaping
  2. **{{string.key...}}** / **{{{string[0]...}}}** - print nested object or array value with / without escaping
  3. **{{{string}}}** - print value without escaping
  4. **{{string(helper,...)}}**, **{{{string(helper,...)}}}** - print value with, without escaping using helpers

___Options:___

  1. NESTED_OBJECTS
  2. EVALUATE

**NESTED_OBJECT** will allow you to use nested objects
**EVALUATE** will evaluate 1) functions on objects keys; 2) placeholders in object values 
	
Order of used options is important. If you want to use NESTED_OBJECT, it has to be declard before EVALUATE option.

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
  
## 2. Example

``` js
    
    /* Javascript example */
		var obj = {
      'string_1': function(){ return 'The sky was dark. {{{string_2}}}'; },
      'string_2': '<strong>It was November. Although it was not yet late.</strong>',
      'string_3': 'run ',
      'object_1': {'string_1' '{{{string_1}}}', 'string_2': 'I closed the door and put the shop'},
      'array_1': ['It was late', 'And dark']
    };
    
    var s = new Substitute({
			element: document.getElementById('substitute'),
			object: obj,
			options: ['NESTED_OBJECTS', 'EVALUATE'],
			callbackInit: (function(){ document.getElementById('status').className = 'replaced'; }),
			callbackRevert: (function(){ document.getElementById('status').className = 'reverted'; }),
		});
    
    function init() {
      s.init();
    }
    function revert() {
      s.revert();
    }

``` 

``` html
	
	/* HTML example */
	...
	<div>
		<p>{{{array_1[0]}}} - {{{array_1[1]}}}</p>
		<p>{{{object_1.string_1}}}</p>
		<p>{{string_1}}</p>
		<p>{{{string_1(stripTags)}}}</p>
		<p>{{{string_1(substring:0:20)}}}</p>
		<p>{{{string_3(repeat(3),firstUpper,trim)}}}</p>
	</div>
	
```   