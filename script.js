$(document).ready(function(){
    test('doubt',function(){
        function test_doubt() {
            // This is a little tricky: what we're trying to do is test doubt() itself.
            // We do this by temporarily replacing QUnit's ok() with our implementation,
            // which does nothing more than collect its arguments. Then we restore ok()
            // to its former glory.
            var old_ok = ok, ok_result, ok_msg;
            ok = function(a,msg){
                ok_result = a;
                ok_msg = msg;
            };
            doubt.apply(null, arguments);
            ok = old_ok;
            //console.log(ok_msg);
            return {ok:ok_result, msg:ok_msg};
        }
        var doubt_result;
        
        doubt_result = test_doubt(function(){throw TypeError('');},EvalError);
        ok(!doubt_result.ok, 'fail throw TypeError, require EvalError (ok)');
        
        doubt(function(){throw Error('');},'pass throw Error, require Error');
        doubt_result = test_doubt(function(){return;});
        ok(!doubt_result.ok, 'fail normal return, require Error (ok)');
        match(doubt_result.msg, /not thrown/, 'fail normal return, require Error (msg)');
        
        doubt(function(){throw TypeError('');},TypeError,'pass throw TypeError, require TypeError');
        doubt_result = test_doubt(function(){throw TypeError('');},EvalError);
        ok(!doubt_result.ok, 'fail throw TypeError, require EvalError (ok)');
        match(doubt_result.msg, /expected exception of type EvalError/, 'fail throw TypeError, require EvalError (msg)');
        
        doubt(function(){throw Error('uno');},/uno/,'pass throw Error("uno"), require exception with msg "uno"');
        doubt_result = test_doubt(function(){throw Error('uno');},/dos/);
        ok(!doubt_result.ok, 'fail throw Error("uno"), require exception with msg "dos" (ok)');
        match(doubt_result.msg, /expected exception with message matching \/dos/, 'fail throw Error("uno"), require exception with msg "dos" (msg)');
        
        doubt(function(){throw TypeError('uno');},TypeError,/uno/,'pass throw TypeError, require TypeError with msg "uno"');
        doubt_result = test_doubt(function(){throw TypeError('dos');},EvalError,/dos/);
        ok(!doubt_result.ok, 'fail throw TypeError("uno"), require EvalError with message "dos" (ok)');
        match(doubt_result.msg, /expected exception of type EvalError/, 'fail throw TypeError("uno"), require EvalError with message "dos" (msg)');
        
        doubt_result = test_doubt(function(){return;},EvalError,/dos/);
        ok(!doubt_result.ok, 'fail normal return, require EvalError with message "dos" (ok)');
        match(doubt_result.msg, /expected exception of type EvalError/, 'fail normal return, require EvalError with message "dos" (msg)');
    });
});