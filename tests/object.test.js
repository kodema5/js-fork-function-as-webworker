// proxy a object in worker

import {
    assert,
    assertEquals,
    describe,
    it,
    wrap,
} from './deps.js'

let w = new Worker(new URL("./object.js", import.meta.url).href, { type: "module" })
let f = wrap(w)

describe("wrap worker object", () => {
    it("captures method", async () => {
        assertEquals(await f.add(1,2), 3)
    })

    it("get property (as a function too)", async () => {
        assertEquals(
            await f.ver(), // get property
            123)
        assertEquals(
            await f.ver(1234),  // sets property
            123) // old value
        assertEquals(
            await f.ver(),
            1234) // new value
    })

    it("captures undefined property", async () => {
        try {
            await f.xxxx(1,0)
            assert(false)
        } catch(e) {
            assert(true)
        }
    })
})

