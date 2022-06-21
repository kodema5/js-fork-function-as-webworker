// wraps function/object/worker
//
export let wrap = (w) => {
    if (w instanceof Worker) {
        return wrap_worker(w)
    }

    let src
    if (typeof(w)==='function') {
        src = `(${proxy})(${w})`
    }
    if (w instanceof Object && w.constructor===Object) {
        src = `(${proxy})(${toSrc(w)})`
    }
    if (!src) throw new Error('unsupported type')

    let b = new Blob( [src],
        { type: 'text/javascript' })
    let u = URL.createObjectURL(b)
    let a = new Worker(u,
        "Deno" in globalThis
        ? {type:'module'}
        : {})

    return wrap_worker(a)
}

// object -> source-string
//
let toSrc = (obj) => {
    return `{ ${
        Object.entries(obj)
        .map( ([key, val]) => {
            return `${key}:${
                typeof(val)==='function'
                ? val+''
                : JSON.stringify(val)
            }`
        })
        .join(',')
    } }`
}

// wraps a worker
//
export let wrap_worker = (w) => {
    let _id = 0
    let _cb = {}

    let fn = (...args) => new Promise((ok, err) => {
        let id = ++_id
        w.postMessage({id, args})
        _cb[id] = {ok, err}
    })

    w.onmessage = (e) => {
        if (!e) return
        let { id, data, error } = e.data || {}
        if (!id) return

        let cb = _cb[id]
        if (!cb) return
        delete _cb[id]

        let { ok, err } = cb
        return error
            ? err(error)
            : ok(data)
    }

    return new Proxy(fn, {
        get(_, prop) {
            return (...args) => new Promise((ok, err) => {
                let id = ++_id
                w.postMessage({id, fn:prop, args})
                _cb[id] = {ok, err}
            })
        }
    })
}


// proxy worker function/object
//
export let proxy = (arg, scope=null)  => {
    let Fn = {}
    if ((typeof arg === 'function')) {
        Fn._ = arg
    }
    else if (
        arg !== null
        && arg instanceof Object
        && arg.constructor === Object
    ) {
        Fn = arg
    }
    else {
        throw new Error('please pass function/object')
    }

    globalThis.onmessage = function(e) {
        if (!e) return
        let { id, fn='_', args } = e.data || {}

        {(async ()=> {
            var p = { id }
            try {
                if (!Fn.hasOwnProperty(fn)) {
                    throw new Error('undefined property')
                }

                let f = Fn[fn]
                let isFn = typeof f === 'function'
                p.data = isFn
                    ? await (f.apply(scope || Fn, args))
                    : f

                if (!isFn && args.length>0) {
                    Fn[fn] = args[0]
                }

            } catch(e) {
                p.error = e
            }
            globalThis.postMessage(p)
        })()}
    }
}
