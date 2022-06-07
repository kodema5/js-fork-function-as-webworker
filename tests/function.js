
import {proxy} from '../src/index.js'

// importScripts("../src/proxy.js") // for FF

proxy(function (a, b) {
    if (b===0) throw 'denominator should not be 0'
    return a / b + this.c
}, { c: 10 })
