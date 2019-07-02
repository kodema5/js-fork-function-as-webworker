var fork = (function() {

const fork = (fn, libs=[]) => {
    if (!fn) throw 'fn must be a function or "string"'

    let baseUrl = (/^.*\//).exec(document.location.href)[0]
    let src = buildSource(fn, libs, baseUrl)
    let worker = buildWorker(src)
    let asyncFn = buildAsyncFunction(worker)
    return asyncFn
}


const buildSource = (fn, libs=[], baseUrl='/') => (`
    importScripts(${libs.map(a=>`'${baseUrl + a}'`).join()})
    const fn = (${fn})

    onmessage = function(e) {
        if (!e) return
        let { id, args } = e.data || {}

        {(async ()=> {
            var p = {id:id}
            try {
                let y = await (fn.apply(null, args))
                p.data = y
            } catch(e) {
                p.error = e
            }
            postMessage(p)
        })()}
    }
`)


const buildWorker = (src) => {
    const blob = new Blob([src], {type:'text/javascript'})
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    URL.revokeObjectURL(url)
    return worker
}


const buildAsyncFunction = (worker) => {
    let callbackId = 0
    let callbacks = {}

    const fn = (...args) => new Promise((ok, err) => {
        let id = ++callbackId
        worker.postMessage({id, args})
        callbacks[id] = {ok, err}
    })

    worker.onmessage = (e) => {
        if (!e) return
        let {id, data, error} = e.data || {}
        if (!id) return

        let cb = callbacks[id]
        if (!cb) return
        delete callbacks[id]

        let {ok, err} = cb
        return error ? err(error) : ok(data)
    }

    fn.terminate = () => worker.terminate()

    return fn
}


return fork

})()




// var add = fork((a,b) => a + b)
// {(async() => {
//     console.log(await add(1,2))
//     add.terminate()
// })()}


// var mul = fork('mul', ['lib-to-import.js'])
// {(async() => {
//     console.log(await mul(6,2))
//     mul.terminate()
// })()}
