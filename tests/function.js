
import { proxy } from './deps.js'

proxy(function (a, b) {
    if (b===0) throw new Error('denominator should not be 0')
    return a / b + this.c
}, { c: 10 })
