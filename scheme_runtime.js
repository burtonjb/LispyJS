function s_eval(expression, environment = global_env) {
	if (typeof(expression) === 'string') {
		//this is a variable reference
		return environment[expression];
	} else if (typeof(expression) === 'number') {
		return expression;
	} else if (expression[0] === 'if') {

	} else if (expression[0] === 'define') {
		var _ = expression[0]; //this is 'define'. It just gets thrown out
		var symbol = expression[1]; // this is the name for the variable
		var value = expression[2]; // this is the value for the variable
		environment[symbol] = s_eval(value, environment);
	} else {
		//Any other case is a procedure call
		var proc = s_eval(expression[0], environment);
		var args = [];
		for (var i = 1; i < expression.length; i++) {
			args.push(s_eval(expression[i], environment));
		}
		return proc(args);
	}
}

console.log(s_eval(parse("(begin (define r 10) (define pi 3.1415) (* pi (* r r)))")))

