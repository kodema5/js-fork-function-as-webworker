// proxy a object in worker

import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
    describe,
    it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

import { wrap } from '../mod.js'
// import { wrap } from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'

let w = new Worker(new URL("./object.js", import.meta.url).href, { type: "module" })
let f = wrap(w)

describe("wrap worker object", () => {
    it("captures output", async () => {
        assertEquals(await f.add(1,2), 3)
    })

    it("captures undefined method", async () => {
        try {
            await f.xxxx(1,0)
            assert(false)
        } catch(e) {
            assert(true)
        }
    })
})

