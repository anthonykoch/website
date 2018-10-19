∏---
author: Anthony Koch
title: 'Shortcut operator gotchas'
tags: ['javascript', 'anti-patterns', 'operators']
id: 9
skip:
  section: '#the-gotcha'
created_at: 2018-08-05
---

It's become a common pattern to use the `||` (also known as the logical Or) operator in conjunction with assignment operations for the purpose of setting a default value in the assigment. It works quite well for most cases, but there are two cases where troubles start to rise. 


<!-- endexcerpt -->

### Common use cases

The `||` opertor is often used to give an argument to a function a default value in case it isn't passed. 

```js
function getUserMessages(opts) {
  const options = opts || {}

  axios.get('/api/users/messages', {
    headers: options.headers,
  })
}
```

This ensures we don't get a `Cannot read property 'headers' of undefined` error when accessing `headers` on `options` because `options` is guaranteed to never undefined. 

### How it works

This pattern works because `||` is said to use `short-circuit evaluation`. This basically means the `||` expression resolves with the value of the first truthy expression it finds, starting from left to right. In fact, if the left expression is truthy, the second expression will never be evaluated. 

One of the keys to understanding how this works is realizng the `||` operator returns the **value** of the first truthy expression, not necessarily a boolean.

```js
console.log(undefined || { name: 'Jim' }) // { name: 'Jim' }
console.log(null || { name: 'Jim' }) // { name: 'Jim' }
console.log(42 || { name: 'Jim' }) // 42
```

<div class="Aside has-tagSpacing">
  <div class="Aside-content">
    <div class="Aside-tag  [ Tag is-absolute ]">Falsey values</div>
      Values that are considered to be "falsey" are such as <code>null</code>, <code>undefined</code>, <code>0</code>, <code>false</code>, and an empty string. All other values are considered truthy.
  </div>
</div>

I've also seen this used in React land, where it's used to set a default prop.

```js
function Inbox(props) {
  const sidebar = props.sidebar || <Sidebar />
  
  return (
    <div>
      {sidebar}
      <Messages messages={props.messages} />
    </div>
  )
}
```


### The gotcha

Where this pattern can bite you is when using it with strings and numbers where the defaults are truthy values. 

```js
function calculate(someNumber) {
  const number = someNumber || 42

  return number
}

console.log(calculate(0)) // 42
```

What if someNumber is `0` and `0` is a valid value it to be 0?



### There are a safer ways

Newer versions of JavaScript allow us to write this pattern in a more expressive ways using default arguments.

```js
function Inbox(props) {
  

  return (
    <div>
      {sidebar}
      <Messages messages={props.messages} />
    </div>
  )
}
```
