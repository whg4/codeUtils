const asyncPool = (poollimit = 5, array = [], iterateFn) => {
	if (typeof iterateFn !== 'function') {
		return Promise.reject(new Error('iterateFn is not a function'));
	}

	let i = 0;
	let ret: Promise<any>[] = [];
	let executing: Promise<any>[] = [];

	const enqueue = () => {
		if (i === array.length) {
			return Promise.resolve();
		}

		const item = array[i++];
		const p = Promise.resolve().then(() => iterateFn(item, array));
		ret.push(p);

		let r = Promise.resolve();

		if (poollimit <= array.length) {
			const e = p.then(() => executing.splice(executing.indexOf(e) >>> 0, 1));
			executing.push(e);
			if (executing.length >= poollimit) {
				r = Promise.race(executing);
			}
		}

		return r.then(() => enqueue());
	}

	return enqueue().then(() => Promise.all(ret));
}