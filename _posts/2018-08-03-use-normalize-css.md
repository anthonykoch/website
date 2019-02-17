---
author: Anthony Koch
title: Use normalize css
tags: ['css', 'normalize']
id: 8
created_at: 2018-08-03
---

To use `normalize.css` or to not use `normalize.css`. That is the question. I'll say that if you're supporting older browsers (especially IE), you should definitely be using it. However, before we get into why you should use it, let's go over what CSS resets are and how they differ from `normalize.css`.

<!-- endexcerpt -->

### What is a reset?

Before researching for this article, I would have said, "CSS resets just reset everything to zero". You'd think it would'd be correct to say, but it's not. There are [actually several different resets](https://perishablepress.com/a-killer-collection-of-global-css-reset-styles) that have been created over time. While some wipe out all styles, some give default styling. There are also some that include a few fixes for browser inconsistencies.

What connects all of them together, though, is that their main purpose is to set a baseline for element styles. Even if they do include  some fixes for browser inconsistencies, that's not their main purpose. This is where `normalize.css` differs.

### What is normalize.css?

[Normalize.css](https://necolas.github.io/normalize.css) is a stylesheet created by [Necolas Gallagher and Jon Neal](http://nicolasgallagher.com/about-normalize-css/) (and I'm sure contributed to by many others). It's not really a reset since it doesn't strip away a lot of styles. If you look [at the source](https://github.com/necolas/normalize.css/blob/master/normalize.css), you'll see it actually doesn't affect many elements. What `normalize` does include is a wide set of fixes for various default styling bugs and inconsistencies between browsers.

### Does it really work though?

We'll use a real life example that I came across while working at Plaid.

<figure>
  <figcaption>
    <a href="https://plaid.com/how-it-works">plaid.com/how-it-works</a> in IE11
  </figcaption>
  <img
    src="/images/posts/use-normalize-css/normalize-before+c.png"
    alt="page without normalize"
    width="500px"
    class="Image is-rounded has-shadow"
  >
</figure>

The page above is a screenshot the `/how-it-works` page of [plaid.com](https://plaid.com/how-it-works) using IE11. The page is clearly broken, but looks fine on any browser that isn't IE. So what gives?

#### A broken main

One of *many* problems with IE browsers is that they don't properly default the `<main>` tag to be a block element but are instead to be inline. What happens to the page if we set the main tag to display block? Well, let's see!

<figure>
  <img
    src="/images/posts/use-normalize-css/normalize-after+c.png"
    alt="page with"
    class="Image is-rounded has-shadow"
    width="500px"
  >
  <figcaption>The page with &lt;main&gt; set to <code>display: block</code></figcaption>
</figure>

Hey, what do you know? Everything looks mostly as it should (although that heading and text is looking a little squished, which is actually another IE bug with `ch` units).

#### What does this have to do with normalize?

When I was working at Plaid, we only used a CSS reset (I'm unsure of which one). If `normalize` was brought in from the beginning, this wouldn't have been an issue because it's a case that normalize covers. Again, `normalize` is filled with fixes like this and is much more thorough than any of the fixes in other resets.

### It's small too

If you're worried about performance, then think about this. Normalize is `6KB` with majority of it being mostly comments. Running it through a minifer will cut the size down to `1.8KB` (with the license intact) and our good old friend gzip will cut that size to less than half. `780 bytes` is nothing in the grand scheme of things, especially for something that can have a positive effect on a project. I think it's definitely worth adding.

```
Bytes   File
 6052   normalize.css
 1783   normalize.min.css
  782   normalize.min.css.gz
```

tl;dr Use normalize. It's not just a browser reset, it actually fixes shit.

<div>
  <div class="Aside">
    <div class="Aside-content">
      <div class="Aside-tag  [ Tag is-absolute ]">Funny enough</div>
      The <code>&lt;main&gt;</code> fix was <a href="https://github.com/necolas/normalize.css/issues/727" target="_blank" rel="noreferrer noopener">inadvertently removed from</a> the project somewhere around <code>v8.0.0</code>. I can assure you that the IE <code>&lt;main&gt;</code> tag is still an issue and the fix needs to be added back into normalize.
    </div>
  </div>
</div>
