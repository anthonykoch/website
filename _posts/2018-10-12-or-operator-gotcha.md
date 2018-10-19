---
author: Anthony Koch
title: 'OR operator gotcha'
tags: ['javascript', 'anti-patterns', 'operators']
id: 9
skip:
  section: '#the-gotcha'
created_at: 2018-08-29
---

It's become a common pattern in the JavaScript world to use the `||` (called the "logical or") operator for the purpose of setting a default value for a function argument. While it works quite well in most cases, but there are two cases where troubles may arise.

<!-- endexcerpt -->

<!-- 0 6px 9px -2px rgba(0,0,0,0.3), 0 20px 50px -2px rgba(0,0,0,0.6) -->

### Common use cases

The `||` operator is often used to give an argument of a function a default value in the case that the argument isn't passed. 

```js
function getUserMessages(opts) {
  const options = opts || {}
  const headers = options.headers || {}

  axios.get('/api/users/messages', { headers })
}
```

This ensures that there is no `Cannot read property 'headers' of undefined` error when accessing `headers` on `options`. `options` is guaranteed to be safe to access properties on because `options` is guaranteed to never be `undefined` or `null`. 

### How it works

This pattern works because the `||` operator returns the first operand if the first operand truthy or the second operand if the first operand is falsey. In fact, if the left operand is truthy, the right operand is never evaluated. To illustrate that point, if the second operand is a function call, e.g. `42 || getUserAge()`, then `getUserAge` would never be called and the result would be `42`.

```js
console.log(undefined || { name: 'Jim' }) // { name: 'Jim' }
console.log(null || { name: 'Jim' }) // { name: 'Jim' }
console.log(42 || { name: 'Jim' }) // 42
```

<div class="Aside has-tagSpacing">
  <div class="Aside-content">
    <div class="Aside-tag  [ Tag is-absolute ]">Falsey values</div>
      The falsey values are <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>0</code>, <code>false</code>, and empty strings. All other values are considered truthy.
  </div>
</div>

The `||` operator works well with function parameters because when an argument is not passed to a function, the parameter defaults to the value `undefined`. For example, if `getUserMessages` is called with no arguments, `opts` is automatically set to `undefined`. Since `opts` is a falsey value, the `||` operator would return the `||` operator's right value.

This also works with object properties, e.g. `const headers = options.headers || {}`, because properties return `undefined` when they don't exist in an object.


### The gotcha

The problem comes when using `||` with numbers and strings, where at the same time `0` and `""` should be considered valid values.

```js
function stringify(data, options) {
  const indent = options.indent || 2

  return JSON.stringify(data, null, indent)
}

const json = stringify({ lastName: 'Halpert' }, { indent: 0 })
console.log(json) // ​​​​​{​"​​​​\n  "lastName": "Halpert"​​​​​​​​​\n}
//                        ▲ 
// The json is indented with 2 spaces instead of 0
```

The goal above was to default the `indent` to `2` in the case that the `indent` option wasn't passed. However, `0` is a falsey value, and thus the `||` operator returns the right operand's value, resulting in an indent of `2` when it should be `0`. 


### There are a safer ways

There are two ways to achieve default values. One way is using the newer ES2015 features called object destructuring along and default value assignment, and the other is to just use good old if statements or ternary operators. Let's take a look at the ES2015 solution.

```js
function stringify(data, { indent: indent=0 } = {}) {
  return JSON.stringify(data, null, indent)
}

const json = stringify({ lastName: 'Halpert' })
console.log(json) // '{"lastName":"Halpert"}'
```

There are two parts to the syntax used in the function parameters above, which are [object destructuring and default value assignment](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/). Object destructuring is the process of assigning an object's property to a variable. By itself, it takes on the syntax of `{ propertyName: variableName }`, and looks as follows when used inside function parameters:

```js
// the property whose value we want to assign to a variable
//                           ▼
function stringify(data, { indent: indent }) {
//                                   ▲ 
// the name of the variable we want create with the property's value 

// the above is just another way of doing this
function stringify(data, options) {
  const indent = options.indent
// 
```

Along with destructuring, we can default our `indent` variable with a value of `2` using default value assignment. Destructuring default assignment takes on the following syntax `{ propertyName: variableName = expression }`, where `expression` can be a number, a string, `NaN`, `undefined`, an array, a function call, etc., but I would highly recommend keeping the default values simple for readabilities sake.


<div class="Aside">
  <div class="Aside-content">
    <div class="Aside-tag  [ Tag is-absolute ]">A note on destructuring</div>
      Destructuring isn't limited to being used in function paramaters, but can also be used with normal variable assignments such as:
      <br> 
      <code>const { indent: indent } = options;</code>
  </div>
</div>


In the original example, I also used what are called "parameter defaults" (another newish ES2015 feature) in order to default the second parameter to an object in event that it's not passed. Parameter defaults take the form of `function (parameterName=expression)`, however, we can also use destructuring along with parameter defaults to create the full desired result. 

```js
//     The second parameter will default to an object when not passed
//                                               ▼
function stringify(data, { indent: indent=0 } = {}) {
```

The reason to default the second parameter to completely allow the second argument to completely omitted. Otherwise, we would have to pass an empty object every time `stringify` is called or else the destructuring would throw the `Cannot read property 'indent' of undefined` error.


#### Caveat

The first caveat to default value assignment and default parameters is it only works when the value is `undefined` passed is undefined. It doesn't work with `null`. The second is that they are newish features that aren't supported by all browsers, mainly IE, older versions of Node, and some mobile browsers.

```js
function stringify(data, { indent: indent=0 } = {}) {
  console.log(indent)
}

stringify({}, {}) // 0
stringify({}, { indent: undefined }) // 0

stringify({}, { indent: false }) // false
stringify({}, { indent: null }) // null
```


### "That all looks complex"

You might think parameter defaults and destructuring looks complicated, or maybe you're not completely understanding it right now. It definitely takes a while to understand and get used to. I would heavily suggest reading up more on destructuring and parameter defaults, since the syntax provides a much more succinct of writing code.

