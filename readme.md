# js-fork-function-as-webworker

[fork.js](fork.js) returns an async function that proxies the post-message/on-message as callbacks
to a web-worker spawned with provided function

## install

```
npm install github:kodema5/js-fork-function-as-webworker
```
is an ES-module, can be transpiled with webpack

## example

fork a local function
```
import fork from 'js-fork-function-as-webworker'

let asyncAdd = fork((a,b) => a + b)
{(async() => {
    console.log(await asyncAdd(1,2))
    asyncAdd.terminate()
})()}
```

loads an external script and call named function
```
var asyncMul = fork('mul', ['lib-to-import.js'])
{(async() => {
    console.log(await asyncMul(2,3))
    asyncMul.terminate()
})()}
```