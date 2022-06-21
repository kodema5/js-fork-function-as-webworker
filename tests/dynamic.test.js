// proxy a function in worker

import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
    describe,
    it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

import { wrap,  }  from '../mod.js'
// import { wrap } from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'

let f1 = wrap((a) => (a+1))
let f2 = wrap({
    foo: (a) => a + 2,
    bar: {a:1, b:2},
})
let f3 = wrap(`
    import { proxy } from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'
    proxy(function (a, b) { return a + b })
`)

describe("dynamic worker", () => {

    it("captures output", async () => {
        assertEquals(await f1(1), 2)
        assertEquals(await f2.foo(1), 3)
        assertEquals(await f2.bar(), {a:1, b:2}) // property via function
        assertEquals(await f3(1,2), 3)
    })


})

