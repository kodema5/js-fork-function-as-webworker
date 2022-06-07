// wraps worker object
//
export let wrap = (w) => {
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
        return error ? err(error) : ok(data)
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

export default wrap

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
        throw 'please pass function/object'
    }

    globalThis.onmessage = function(e) {
        if (!e) return
        let { id, fn='_', args } = e.data || {}

        {(async ()=> {
            var p = { id }
            try {
                let f = Fn[fn]
                if (!f) throw 'undefined method'

                let y = await (f.apply(scope || Fn, args))
                p.data = y

            } catch(e) {
                p.error = e
            }
            globalThis.postMessage(p)
        })()}
    }
}
