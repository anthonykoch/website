---
author: Anthony Koch
title: Integrating lazy loading into a ghost blog
tags: ['ghost', 'ghostjs', 'blog', 'performance', 'lazy loading']
id: 12
created_at: 2020-03-04
---

Lazy loading images doesn't come with Ghost out of the box, so if you want it then you have to figure out a solution yourself. Pretty much all of the solutions found online boil down to modifying the theme and the posts themselves. Modifying the theme isn't a big deal, but for the blog I was helping on, [modernfertility.com/blog](https://modernfertility.com/blog/), there were simply too many posts that modifying them was out of the picture.

Finding a better solution for what we wanted was quite a journey, so before we go over the failed attempts and other potential options.



<!-- endexcerpt -->

### Solutions that didn't work



#### 1. Making a handlebars helper

My first idea was to just wrap the entire page in a helper that would lazy-ify the images.

```html
{{#lazify}}
  <main>some html</main>
{{/lazyify}}
```

However... how exactly does one even add a helper to ghost's core?

Well, there's actually an undocumented plugin system built within ghost called an "app". You can register an app and add handlebars helpers or do whatever. There are examples of it in the ghost install itself. However, there are three issues with this solution:

1. Ghost doesn't seem to allow user defined apps. If you want to create an app, you have to add a folder to `current/core/frontend/apps`. Then add the name of the folder to the `apps.internal` array in a file called "overrides.json".
2. Transforming a page with cheeriojs that uses an asynchronous helper will cause ghost to freeze indefinitely.
3. Async helpers don't resolve before the helper is run, so there will be bits of html that won't be processed. That's no bueno. The point here is to change all the image tags on the page.

#### 2. Modifying the markdown parser

The plan here was to manually change the theme, and then write a markdown plugin to transform the images within a post. I was never able to figure out where the hell the markdown parsing was done within Ghost's core.


#### 3. Implement cloudfare html rewriting

You can somehow hook up cloudflare to a website and rewrite the html. I almost like this solution, but apparently it wasn't possible with the setup we were using.

[Cloudflare HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)


### The actual working solution

The solution requires modifying a small part of 1 file in ghost's core. Basically, the express route handler is changed so that we can transform the html before it's sent. This means all images throughout the site are lazy loaded.

```js
const {
  compose,
  getHtml,
  loadHtml,
  transformLazify,
} = require('../../../../../utils/lazyload')

const transform = compose(
  html => loadHtml(html),
  transformLazify,
  getHtml,
)

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

The `res.render` portion is the only part that has been modified. It's actually a very simple change. The majority of the transform code was put into a separate file.

To create the transform function, you'll need to create a file lazyload.js (or call it whatever) inside the `current/` directory. We chose to put it in `current/utils/lazyload.js`. It can't be outside of the `current/` folder because node won't be able to require it.

As for the actual content, our lazifying file does some extra stuff, but I've put the [stripped down version of it into a gist](https://gist.github.com/anthonykoch/d7b84adcaa2be2412c14bb2b5de6cdb8).

<div>
  <div class="Aside">
    <div class="Aside-content">
      <div class="Aside-tag  [ Tag is-absolute ]">Note</div>
      With the version of ghost as of this writing, cheeriojs is already installed, so you don't need to <code>npm i cheeriojs</code>
    </div>
  </div>
</div>

Lastly, we added a lazy loader to the frontend to actually load the images in. We went with [vanilla-lazyload](https://www.npmjs.com/package/vanilla-lazyload) because it's simple to use and only **6.5KB minified**. The only thing I don't like is that it doesn't add a loaded class to background-image elements.

### But perf tho?

A `console.time()` around the `transform(html)` bit measured an average of **7ms**. Not a super big deal, imo. We were doing a couple more things in our transform, so it should even be less than that. Perhaps if you had a large DOM, (maybe because of syntax highlighted code blocks or something), it could potentially be much higher.


