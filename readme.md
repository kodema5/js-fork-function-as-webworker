# js-fork-function-as-webworker

returns an async function that proxies the post-message/on-message as callbacks
to a web-worker spawned with provided function

## example

fork a local function
```
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
