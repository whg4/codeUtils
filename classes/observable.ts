interface Observer {
	next: (value?: any) => void;
	complete: () => void;
	error: (value?: any) => void;
}

interface Subscription {
	unsubscribe: () => void;
}

type SubscribeFn = (observer: Observer) => Subscription | void;

// Observable的主要作用是对观察值运用一系列函数，只要在执行Subscribe时才会真正调用这些函数，即求值是惰性的

class Observable {
	_subscribe;
	constructor(subscribe: SubscribeFn) {
		this._subscribe = subscribe;
	}

	subscribe(observer: Observer): Subscription {
		return this._subscribe(observer);
	}

	static timeout(time) {
		return new Observable(function (observer) {
			const handle = setTimeout(() => {
				observer.next();
				observer.complete();
			}, time);

			return {
				unsubscribe: () => {
					clearTimeout(handle);
				}
			}
		});
	}

	static fromEvent(dom, eventName) {
		return new Observable(function subscribe(observer) {
			const handle = (ev) => {
				observer.next(ev);
			}
			dom.addEventListener(eventName, handle);
			return {
				unsubscribe: () => {
					dom.removeEventListener(eventName, handle);
				}
			}
		})
	}

	map(prejection: (v) => any) {
		const self = this;
		return new Observable(function (observer) {
			const subscription = self.subscribe({
				next: (v) => {
					// NOTICE: unhandle prejection error case
					observer.next(prejection(v));
				},
				complete: () => observer.complete(),
				error: (err) => observer.error(err)
			})

			return subscription;
		});
	}

	filter(predicate: (v) => boolean) {
		const self = this;
		return new Observable(function (observer) {
			const subscription = self.subscribe({
				next: (v) => {
					if (predicate(v)) {
						observer.next(v);
					}
				},
				complete: () => observer.complete(),
				error: (err) => observer.error(err)
			})
			return subscription;
		});
	}

	concat(...observable: Observable[]) {
		return new Observable(function (observer) {
			const myObservables = observable.slice();
			let currentSub: Subscription | null = null;
			const processObservable = () => {
				if (myObservables.length === 0) {
					observer.complete();
				} else {
					const observable = myObservables.shift();
					currentSub = observable!?.subscribe({
						next: (v) => {
							observer.next(v);
						},
						error: (err) => {
							observer.error(err);
							currentSub?.unsubscribe();
						},
						complete: () => {
							processObservable();
						}
					});
				}
			}
			processObservable();
			return {
				unsubscribe: () => {
					currentSub!?.unsubscribe();
				}
			}
		});
	}

	retry(num: number) {
		const self = this;
		return new Observable(function (observer) {
			let currentSub: Subscription | null = null;
			const processObservable = (currentAttemptNumber: number) => {
				currentSub = self.subscribe({
					next: (v) => {
						observer.next(v);
					},
					complete: () => observer.complete(),
					error: (err) => {
						if (currentAttemptNumber === 0) {
							observer.error(err);
						} else {
							processObservable(currentAttemptNumber - 1);
						}
					}
				})
			}

			processObservable(num);
			return {
				unsubscribe: () => {
					currentSub!?.unsubscribe();
				}
			}
		});
	}

}
