console.time('coroutine')
const newsList = Array.from({ length: 100000 }, () => ({
  uid: '8be34939-bc25-4b9e-999d-2daf19fbea7b',
  title:
    'Adipisicing do eu magna ex non est eu labore nisi duis enim elit.',
  tags: ['reprehenderit', 'cupidatat', 'ad', 'ea', 'labore'],
}))

const run = (coroutine, threhold = 1, options = { timeout: 160 }) => new Promise(
  (resolve, reject) => {
    var iterator = coroutine()
    var step = (deadline) => {
      try {
        var minTime = Math.max(0.5, threhold)
        while (deadline.timeRemaining() > minTime) {
          var { value, done } = iterator.next()
          if (done) {
            resolve(value)
            return
          }
        }
      } catch (error) {
        reject(error)
        return
      }
      window.requestIdleCallback(step, options)
    }

    window.requestIdleCallback(step, options)
  })

const reduce = function* (array, fn, initial) {
  let result = initial || array[0]
  for (let i = 0; i < array.length; i++) {
    result = yield* fn(result, array[i], i, array)
  }
  return result
}

const sliceTask = function (fn, interval = 10) {
  let yieldInterval = 0
  return function* sliced(...args) {
    var result = fn(...args)
    if (++yieldInterval % interval == 0) {
      yieldInterval = 0
      yield
    }
    return result
  }
}

const reduceAsync = (list, reducer, initial) => {
  var compute = function* () {
    return yield* reduce(list, sliceTask(reducer, 20), initial)
  }
  return run(compute)
}

reduceAsync(
  newsList,
  function reducer(acc, item) { 
    // do something... 
  },
  new Map()
).then(res => {
  console.log('done!', res)
})