# A small [QUnit](http://docs.jquery.com/QUnit) fork.

It just adds two functions: `doubt()` and `match()`. Kind of recursively, `doubt()` has its own tests, which [you can run here](http://rentzsch.github.com/qunit/).

## `doubt()`

`doubt()` allows you to ensure an expected exception is thrown. In its simplest usage, it takes a function:

	doubt(function(){throw 'bummer';});
	//=> pass: exception thrown

	doubt(function(){return 'bummer';});
	//=> fail: no exception thrown


But it does oh-so-much-more. Like exception class matching:

	doubt(function(){throw Error('bummer');}, Error);
	//=> pass: expecting Error exception, got it

	doubt(function(){throw TypeError('bummer');}, Error);
	//=> fail: expecting Error exception, got TypeError instead

And exception-message regex matching:

	doubt(function(){throw Error('bummer');},/bum/);
	//=> pass: 'bum' found in exception message

	doubt(function(){throw Error('bummer');},/hobo/);
	//=> fail: 'hobo' not in exception message

In addition, `doubt()` goes out of its way to issue nice descriptions of exactly what you were looking for -- and what it received -- when a test fails. For example, the error message for the last previous test was `expected exception with message matching /hobo/, got Error with message "bummer"`. Awesome, huh?

You can also mix exception class checks with exception message checks in any order, but only one each:

	doubt(function(){throw Error('bummer');},Error,/bum/);
	//=> pass: class and message match
	
	doubt(function(){
	    throw RangeError('index 3 outside of array "blind mice"');
	},/outside/,RangeError);
	//=> pass: class and message match

	doubt(function(){
	    xyzzy = bar;
	},/shangri la/,ReferenceError);
	//=> fail: class matches, but message doesn't.

Oh, and like `ok()` and `equals()`, `doubt()` can also accept a String message to output along with the assertion result:

	doubt(function(){decodeURI('%foosball');},URIError,'decoding bogus URI fails');

So `decoding bogus URI fails` will appear next to the assertion's output (in green, hopefully).

## `match()`

`match()` works like `equals()` when used with strings, except it allows RegExps:

	match('hello world',/^hell/); // pass
	match('hello world',/goodbye/); // fail