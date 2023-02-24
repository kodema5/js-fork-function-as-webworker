// proxy a function in worker

import {
    assert,
    assertEquals,
    describe,
    it,
    wrap,
}  from './deps.js'

let w = new Worker(new URL("./function.js", import.meta.url).href, { type: "module" })
let f = wrap(w)

describe("wrap worker function", () => {
    it("captures output", async () => {
        assertEquals(await f(1,2), 10.5)
    })

    it("captures throws", async () => {
        try {
            await f(1,0)
            assert(false)
        } catch(e) {
            assert(true)
        }
    })

})

