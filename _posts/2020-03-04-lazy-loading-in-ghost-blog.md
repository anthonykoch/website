---
author: Anthony Koch
title: Lazy loading with ghost blog
tags: ['ghost', 'ghostjs', 'blog', 'performance', 'lazy loading']
id: 12
created_at: 2020-03-04
---

There are some posts about lazy loading with ghost, but they either didn't work or weren't valid options we were able to use with [modernfertility.com/blog](https://modernfertility.com/blog/). The solution I found isn't exactly pretty, as it requires modifying 1 file of ghost's core. So, you'll need to store the ghost install in a repo.

<!-- endexcerpt -->

### Solutions that didn't work

#### 1. Making a handlebars helper

My first idea was to just wrap the entire page in a helper that would lazyify the images.

```html
{{#lazify}}
  <main>some html</main>
{{/lazyify}}
```

However... how exactly does one even add a helper to ghost's core?

Well, there's actually an undocumented plugin system built within ghost called "ghost apps". You can register an "app" and add handlebars helpers or whatever. There's actually examples of it in the ghost install itself. However, there are two issues with this solution:

1. Ghost doesn't seem to allow anything but "internal" apps. If you want to add a handlebars helper, you have to add a folder to `current/core/frontend/apps`. Then add the name of the folder to the `apps.internal` in a file called "overrides.json". Annoying, but doable.
2. The templating engine, `express-hbs`, leaves placeholders for asynchronously resolved helpers in the html, which look something like this `__aSyNcId_<_bZpwo_JT__`. Tthe placeholders, which aren't actually opening tags, are given a related closing tag. When this is loaded into cheeriojs, the output will have the closing tags removed, which will make ghost freeze indefinitely.


#### 2. Tapping into markdown parser

The plan here was to manually change the theme, and then write a markdown plugin to transform the images within a post. I was never able to figure out where the hell the markdown parsing was done within Ghost's core.


#### 3. Implement cloudfare html rewriting

You can somehow hook up cloudflare and rewrite the html. Apparently this wasn't possible with our setup or something.

[Cloudflare HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)


### A working solution

It took a lot of searching, but I was able to find the express route handler that serves all blog pages.

```js
const {
  compose,
  getHtml,
  loadHtml,
  transformBackgroundImage,
  transformLazify,
} = require('../../../../../utils/lazyload')

// ... bunch of stuff

/**
 * @description Helper function to finally render the data.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} data
 */
module.exports = function renderer(req, res, data) {
  // Set response context
  setContext(req, res, data)

  // Set template
  templates.setTemplate(req, res, data)

  debug('Rendering template: ' + res._template + ' for: ' + req.originalUrl)
  debug('res.locals', res.locals)

  // CASE: You can set the content type of the page in your routes.yaml file
  if (res.routerOptions && res.routerOptions.contentType) {
    if (res.routerOptions.templates.indexOf(res._template) !== -1) {
      res.type(res.routerOptions.contentType)
    }
  }

  // Render Call
  res.render(res._template, data, (err, html) => {
    if (err) req.next(err)

    const after = transform(html)

    res.send(after)
  })
}
```

The `res.render` portion is the only part that has been modified. To create the transform function, you'll need to create a file lazyload.js (or whatever) inside the `current/` directory. We chose to put it in `current/utils/lazyload.js`. It can't be outside of the `current/` folder because node won't be able to require it.

As for the actual content, our file does some extra stuff, but I've put the [gist of it into a gist](https://gist.github.com/anthonykoch/d7b84adcaa2be2412c14bb2b5de6cdb8).

<div>
  <div class="Aside">
    <div class="Aside-content">
      <div class="Aside-tag  [ Tag is-absolute ]">Note</div>
      With the version of ghost as of this writing, cheeriojs is already installed, so you don't need to <code>npm i cheeriojs</code>
    </div>
  </div>
</div>

Lastly, we added a lazy loader to the frontend to actually load the images in. We went with [vanilla-lazyload](https://www.npmjs.com/package/vanilla-lazyload). It's simple to use and only 6.5KB minified. The only thing I don't like is that it doesn't add a loaded class to background-image elements.

### But perf tho?

A `console.time()` around the `transform(html)` bit measured an average of **7ms**. Not a super big deal, imo. We were doing a couple more things in our transform, so it should be less than that. Perhaps if you had a large DOM, (maybe because of syntax highlighted code blocks or something), it could potentially be much higher.


