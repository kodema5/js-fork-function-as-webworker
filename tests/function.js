
import { proxy } from '../mod.js'

// import {proxy} from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'
// importScripts("../src/proxy.js") // for FF

proxy(function (a, b) {
    if (b===0) throw new Error('denominator should not be 0')
    return a / b + this.c
}, { c: 10 })
