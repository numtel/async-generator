// Adapted from:
// http://modernweb.com/2014/02/10/replacing-callbacks-with-es6-generators/

// When using async functions that return promises,
function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      console.log('Slept for ' + time)
      resolve()
    }, time)
  })
}

/*
// The following syntax should also work but I can't figure out how to make
//  the asyncToGenerator optional transformer work :(
// http://babeljs.io/docs/usage/transformers/#async-to-generator

async function longTask() {
  console.log('getting started')
  await delay(1000)
  console.log('half-way')
  await delay(1000)
  console.log('all-done')
  return 42
}

*/

//create a wrapper around a callback based function, to have it call next()
function async(generatorFunction) {
  return new Promise((resolve, reject) => {
    var generatorItr = generatorFunction(resume)

    function resume(callbackValue) {
      try{
        var result = generatorItr.next(callbackValue)
      } catch(err) {
        return reject(err)
      }
      if(result.done === true) resolve(result.value)
    }

    //start the iterator
    resume()
  })
}

function longTask() {
  return async(function*(resume) {
    console.log('getting started')
    yield delay(100).then(resume)
    console.log('half-way')
    yield delay(220).then(resume)
    console.log('all-done')
    return 42
  })
}

longTask().then(result => console.log('longTask', result))

