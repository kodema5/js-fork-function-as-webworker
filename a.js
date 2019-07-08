// webpack a.js

import fork from './fork'

let asyncAdd = fork((a,b) => a + b)
{(async() => {
    console.log(await asyncAdd(1,2))
    asyncAdd.terminate()
})()}


var asyncMul = fork('mul', ['lib-to-import.js'])
{(async() => {
    console.log(await asyncMul(2,3))
    asyncMul.terminate()
})()}

