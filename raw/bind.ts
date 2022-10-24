/**
 * 对于普通函数，绑定this指向
	 对于构造函数，要保证原函数的原型对象上的属性不能丢失
 */
Function.prototype.bind = function (context, ...args) {
	if (typeof this !== 'function') {
		throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
	}
	const self = this;
	const fBound = function (...bindArgs) {
		// 如果当前函数是通过new调用的，this指向实例，否则指向context
		return self.apply(
			this instanceof self
				? this
				: context, args.concat(bindArgs));
	}
	fBound.prototype = Object.create(self.prototype);
	return fBound;
}