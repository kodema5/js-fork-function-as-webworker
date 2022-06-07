// proxy a function in worker

import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
    describe,
    it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

import { wrap }  from '../mod.js'
// import { wrap } from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'

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

