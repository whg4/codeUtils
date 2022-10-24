/**
 * new被调用后做了三件事情:
		1.让实例可以访问到私有属性
		2.让实例可以访问构造函数原型(constructor.prototype)所在原型链上的属性
		3.如果构造函数返回的结果不是引用数据类型
 */

const newOperator = (ctor, ...args) => {
	if (typeof ctor !== 'function') {
		throw 'newOperator function the first param must be a function';
	}
	// 创建一个对象的__proto__指向构造函数的原型
	const obj = Object.create(ctor.prototype);
	// 执行构造函数
	const res = ctor.apply(obj, args);
	// 如果构造函数返回的结果不是引用数据类型，则返回obj
	const isObject = typeof res === 'object' && typeof res !== null;
	const isFunction = typeof res === 'function';
	return isObject || isFunction ? res : obj;
}