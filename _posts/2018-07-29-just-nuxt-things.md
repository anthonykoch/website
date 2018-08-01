---
author: Anthony Koch
title: Just Nuxt Things
tags: ['nuxt', 'vue', 'webpack']
id: 7
created_at: 2018-07-29
---


I rewrote my website and blog using [nuxt.js](https://nuxtjs.org/). The experience did not come without a bit of blood, sweat, and tears, but I'm happy with the end result. This is not so much a tutorial as it is a reflection on the experience and why I did what I did.

<!-- endexcerpt -->


### What I wanted

Originally, I wrote this blog a couple years ago with jekyll. Jekyll uses something that is or closely resembles [liquid templating](https://shopify.github.io/liquid/). I'm not really a fan of liquid or any templating language that obfuscates simple things into some obscure, verbose syntax (such as filters). Want to multiply two numbers together and then divide by 100?

```
{{ age | times: 2 | divided_by: 100 }}
```

Imagine doing even more complex math than this. It's absolutely terrible and takes forever to read. This would simply be `{{ age * 2 / 100 }}` in any other syntax that allows rendering expressions.

Something with a better templating syntax was definitely in order, but I also wanted:

1. For those who disable JavaScript by default (such as myself) to still be able to view most of the site.
2. For everything to function as a single page app for those with JavaScript enabled.
3. To be able to use Vue since it has a pretty good featured templating system.

Thankfully, the good folks from [Zeit](https://zeit.co/) have my needs covered with their open source project Nuxt. Nuxt is a framework for creating Server Side Rendered (SSR) apps with Vue, but it can also be used to generate a static site.

Nuxt offers pretty much everything I wanted. I could completely pre-render the website to a static site for users with JavaScript disabled while still being able to use Vue for those with it enabled. On top of everything, it also works as a single page app for users with JavaScript enabled. Wowee, sign me up!


### I also wanted performance

The few tutorials I looked into on how to create a blog with Nuxt end up loading all posts on every single request, even pages completely unrelated to blogging. If each post is around 15KB of text, highlighted code blocks, etc., then we're talking `~4-6KB` gzipped for each post. Just 30 posts is 150K of already gzipped content being loaded on every page. For a small site with only a few posts, this might be ok, but as I write more and more in the future, this is going to add up to be quite a lot.

It didn't seem like there were any modules in the community to turn markdown files into JSON with various metadata. So, being a DIY oriented person, I decided I would just write all of the functionality. I just needed to simply convert the posts to json and load them with axios in the post template.


### Converting posts to json

My solution to convert the posts to JSON was to write a webpack plugin. I won't go into detail with code examples of how it works, because there's a lot of code that goes into it. If you want to see the source files, you can find [them in here](https://github.com/anthonykoch/website/blob/master) (look in `~/.webpack` and `nuxt.config.js`.

Basically, I use [`require.context` paired with `file-loader`](https://github.com/anthonykoch/website/blob/master/plugins/bootstrap.js#L11)  to [load the markdown files](https://github.com/anthonykoch/website/blob/master/nuxt.config.js#L136). This setup makes the files available to the [webpack plugin I wrote](https://github.com/anthonykoch/website/blob/master/.webpack/transform-file-plugin.js) and from there allows me to [transform each post](https://github.com/anthonykoch/website/blob/master/nuxt.config.js#L159) into a JSON file with all the necessary metadata.

This might not the best way to do it, but was the easiest I could think of with my limited knowledge of writing webpack loaders and plugins. One downside to this approach is the post page doesn't automatically update when making a change to the markdown file. I'm hoping to fix later on, but for now, I'll just have to use good old `ctrl+r`.


### A major Nuxt gotcha

You can not fetch content from the same server when using `npm run generate`. For example, a request like this: `axios.get('/_nuxt/hello-world.json')` will fail when running `npm run generate` and you'll get this lovely little error message.

```
  nuxt:generate Generate file: /blog/understanding-javascript-prototypes/index.html +0ms
  Error: connect ECONNREFUSED 127.0.0.1:3000

  - util.js:1003 Object._errnoException
    util.js:1003:13

  - util.js:1024 _exceptionWithHostPort
    util.js:1024:20

  - net.js:1181 TCPConnectWrap.afterConnect [as oncomplete]
    net.js:1181:14
```

This happens because the server doesn't actually run while `npm run generate` is going. I'm not sure why they decided to do that, but it is what it is.

That's actually all irrelevant because you have to remember that Vue is not running inside a browser when running `npm run generate`, but inside of a node process. In a browser, axios would assume the root `/` to be the same domain (which is `localhost:3000`) but in a node process, the root `/` defaults to `127.0.0.1:80`. So, we end up having another problem in that axios is sending requests to the wrong place.

#### Solving the gotcha

I solved this in a hacky way with [the code below](https://github.com/anthonykoch/website/blob/master/core/fetch.js) and by keeping the dev server open in another terminal tab. This way, requests are sent to the dev server when running `npm run generate`.

```js
// ~/core/fetch.js
import axios from 'axios';

const baseURL =
  process.server
      // I set this to 'http://localhost:3000' in the nuxt config
    ? process.env.app.baseUrl
    : '/';

const request = axios.create({
  baseURL,
});

export default request;
```

This code creates an instance of axios that prefixes requests with `http://localhost:3000` so that requests go to the development server when running `npm run generate`. When running in an actual browser, the requests will be sent to the same domain. Remember that requests starting with a `/` are relative to the domain the code is running from, so this ends up covering both cases when the app is running in development `localhost:3000` and production `anthonykoch.com`.

With all of this in place, I was able to load a post as normal.

```html
<template>
  <h1>{{ post.title }}</h1>
</template>

<script>
// ~/pages/blog/_slug.vue
import axios from '@/core/fetch';

export default {
  asyncData({ params, error }) {
    return axios.get(`posts/${params.slug}.json`)
      .then(({ data: post }) => {
        return {
          post,
        };
      })
      .catch(err => {
        error({ statusCode: 404, message: 'Post not found' });
      });
  },
};
</script>
```

### Things I don't like

Besides the gotcha above, there's a few things I found annoying or didn't like about Nuxt.

#### Not a standard Vue app

The structure of the app strays from a normal Vue app. I would expect as much since we're not just dealing with Vue but with Server Side Rendering (SSR). However, the concept of `~/layouts` and automatic router configuration actually end up disallowing the use of some vue-router features, such as named routes and named slots (although it seems this [will likely change in the future](https://github.com/nuxt/nuxt.js/issues/190)).

#### Error page

When there's an error, it will show an overlay that goes away when you fix the error. This is pretty standard for a Vue or React app. But when the app errors and the page is refreshed, it will show the page below. Once the error is fixed, the page doesn't refresh and app doesn't come back. This means you have to manually refresh it. It's kind of annoying, but not the end of the world.

<figure>
  <figcaption>
    The nuxt error page
  </figcaption>
  <img src="/images/posts/just-nuxt-things/error-page+c.png" alt="nuxt error page">
</figure>

#### Scroll position

This isn't really a Nuxt thing, but something against `vue-router`. The scroll position doesn't get remembered on page refresh. They allow customizing this, but it's not done by default. I have to wonder if they don't include this by default because the logic for it is too buggy and/or too difficult to achieve.


### The overall experience

Working with Nuxt has been an interesting experience. It took a pretty good amount of time for me to figure out how to get this all to work properly, but I'm pretty happy with the end result and it serves all my needs perfectly.
