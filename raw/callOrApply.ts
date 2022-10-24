Function.prototype.call = function (context, ...args) {
	if (typeof this !== 'function') {
		throw new Error('Function.prototype.call - what is trying to be bound is not callable');
	}
	context = context || window;
	context.fn = this;
	var result = eval('context.fn(...args)');
	delete context.fn;
	return result;
}

Function.prototype.apply = function (context, args) {
	if (typeof this !== 'function') {
		throw new Error('Function.prototype.apply - what is trying to be bound is not callable');
	}
	context = context || window;
	context.fn = this;
	var result = eval('context.fn(...args)');
	delete context.fn;
	return result;
}