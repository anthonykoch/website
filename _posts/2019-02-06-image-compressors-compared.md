---
author: Anthony Koch
title: Image compressors compared
tags: ['nextjs', 'review']
id: 11
created_at: 2019-02-06
---


I recently saw a question on reddit asking what the best way to optimize images was. Everyone seemed to respond with a different answer, with some recommending apps, some websites, and others CLI utilities.

<!-- endexcerpt -->

For the last couple of years, I've relied soley on tinyjpg and compressor.io. However, the reddit question got me thinking:

- What are all the cross-platform image compressors?
- How well do they compress with different settings?
- What is the quality of the image the comes out?
- What are the smallest file sizes that can be achieved with only a minor loss in quality?

### Overview

<div class="u-overflowAuto md-spacer ">
  <table class="Table u-nowrap u-mxauto" style="max-width: 800px">
    <thead>
      <tr>
        <th>Name</th>
        <th>App</th>
        <th>Online Uploader</th>
        <th>Uploader Limit</th>
        <th>API</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ImageOptim</td>
        <td><a href="https://imageoptim.com/mac">Free (macOS only)</a></td>
        <td><a href="https://imageoptim.com/online">Yes</a></td>
        <td>N/A</td>
        <td><a href="https://imageoptim.com/api/pricing">Paid</a></td>
      </tr>
      <tr>
        <td>imagemin</td>
        <td><a href="https://github.com/imagemin/imagemin-app">Free (all platforms)</a></td>
        <td>No</td>
        <td>N/A</td>
        <td>No</td>
      </tr>
      <tr>
        <td>tinyjpg</td>
        <td>No</td>
        <td><a href="https://tinyjpg.com">Yes</a></td>
        <td>5MB</td>
        <td><a href="https://tinyjpg.com/developers">Paid</a></td>
      </tr>
      <tr>
        <td>Abraia</td>
        <td>No</td>
        <td><a href="https://abraia.me/compressor/">Yes</a></td>
        <td>5MB</td>
        <td><a href="https://abraia.me/compressor/">Paid</a></td>
      </tr>
      <tr>
        <td>compressor.io</td>
        <td>No</td>
        <td><a href="https://compressor.io">Yes</a></td>
        <td>10MB</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>
</div>

#### imagemin

[Imagemin](https://www.npmjs.com/package/imagemin) works by utilizing plugins such as jpegtran, jpeg-recompress, mozjpeg and pngquant.

<div>
  <div class="Aside">
    <div class="Aside-content">
      <div class="Aside-tag  [ Tag is-absolute ]">Plugin settings</div>
      <p>
        Each plugin has its own settings that can be configured. This is a great article on how <code>jpeg-recompress</code> settings work:
        <a href="https://mika-s.github.io/javascript/jpeg/compression/algorithm/2018/01/10/quality-min-and-max-with-jpeg-recompress.html">Quality, min and max with jpeg-recompress</a>
      </p>
    </div>
  </div>
</div>

#### tinyjpg

I've used [tinyjpg.com](https://tinyjpg.com) for a while now. They support compressing pngs or jpegs. This compressor is on the more aggressive side, so you need to watch the output quality.


#### compressor.io

[compressor.io](https://compressor.io) is an online uploader. It supports compressing svgs, pngs, jpgs, and gifs, with the option to go for lossy or lossless compression for pngs and jpgs. It seems to be on the less aggresive side, but has good output quality.


#### Abraia

I had never heard [abraia](https://abraia.me/) optimizer before writing this article, but I decided to add it in last second. I did have an image return corrupted (at 37 bytes) [https://unsplash.com/photos/7ACuHoezUYk](https://unsplash.com/photos/7ACuHoezUYk).


#### ImageOptim

According to their website, their app doesn't do lossy compression by default. Also, their app isn't on the App Store, so you need to download it from the website.


### Comparing compression

We'll have four different jpgs images to compress. The output size *and* quality of the resulting image will be compared between the compressors. Each section will have a comparison tool, where the left side will show the original image, and the right will show the compressed version.

#### SSIM

Apparently, there's a neat way to compare how similar two images are called *Structured Similarity* (SSIM). For each comparison, I'll also be including the SSIM number for each compressed image. The package I used, [ssim.js](https://www.npmjs.com/package/ssim.js), gives a simple explanation of how it works:

> <span class="u-openQuote"></span>Get a 0 to 1 score on how similar two images are. The closer SSIM is to 1 the higher the similarity.<span class="u-closeQuote"></span> <cite>- ssim.js</cite>

#### Settings

```
Name                 |  Settings
---------------------|-------------------------------------
recompress-low       |  jpeg-recompress with quality=low min=40 max=85
recompress-medium    |  jpeg-recompress with quality=medium min=60 max=85
mozjpeg              |  mozjpeg with quality=95
mozjpeg-medium       |  mozjpeg with quality=80
jpegtran             |  jpegtran
jpegtran-progressive |  jpegtran with progressive=true
imageoptim           |  https://imageoptim.com/online with quality=medium
compressorio         |  https://compressor.io
tinyjpg              |  https://tinyjpg.com
```

One thing you'll note, is the `mozjpeg` actually outputs larger images than the original. I'm not sure how that happened or if I've done it wrong. The repo for how I compressed the images lives at:

<div class="u-mb6 u-mt3 u-textCenter">
  <a href="https://github.com/anthonykoch/compressors-compared" class="Resource is-github">
    <span class="Resource-media">
      <svg class="Resource-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9 1.4.3 2.6.4 3.8.4 8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1-8.4 1.9-15.9 2.7-22.6 2.7-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1 10.5 0 20-3.4 25.6-6 2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8 0 0 1.6-.5 5-.5 8.1 0 26.4 3.1 56.6 24.1 17.9-5.1 37-7.6 56.1-7.7 19 .1 38.2 2.6 56.1 7.7 30.2-21 48.5-24.1 56.6-24.1 3.4 0 5 .5 5 .5 12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5 1.2 0 2.6-.1 4-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"/></svg>
    </span>
    <span class="Resource-text">anthonykoch/compressors-compared</span>
  </a>
</div>

#### Image: Leaves

If you look closely, you can see that both `abraia`, `recompress-low` and `tinyjpg` changed some of the darker greens into a lighter  green. Interestingly, those three also have the lowest SSIM score. However, I don't see any notable artifacting produced by any of the three, and they did produce the smallest file sizes.

The rest look fairly close to the original, and have very close SSIM scores. I would say `imageoptim` and `mozjpeg-medium` both take the win here for most smallest file size without changing the quality of the image.

<div class="md-spacer">
  <table class="Table is-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>SSIM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Original</td>
        <td>862 KB</td>
        <td>N/A</td>
      </tr>
      <tr>
        <td>abraia</td>
        <td>292 KB</td>
        <td>0.99891</td>
      </tr>
      <tr>
        <td>compressorio</td>
        <td>611 KB</td>
        <td>0.99977</td>
      </tr>
      <tr>
        <td>imageoptim</td>
        <td>358 KB</td>
        <td>0.99969</td>
      </tr>
      <tr>
        <td>jpegtran</td>
        <td>815 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>jpegtran-progressive</td>
        <td>812 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>mozjpeg</td>
        <td>1002 KB</td>
        <td>0.99998</td>
      </tr>
      <tr>
        <td>mozjpeg-medium</td>
        <td>391 KB</td>
        <td>0.99969</td>
      </tr>
      <tr>
        <td>recompress-low</td>
        <td>185 KB</td>
        <td>0.99840</td>
      </tr>
      <tr>
        <td>recompress-medium</td>
        <td>573 KB</td>
        <td>0.99982</td>
      </tr>
      <tr>
        <td>tinyjpg</td>
        <td>253 KB</td>
        <td>0.99871</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="md-fullWidth md-spacer u-gutter@md">
  <div style="max-width: 700px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareLeavesTabs"></tabbed-image-compare>
  </div>
</div>

#### Image: Work Harder

The aggressive compression from `abraia`, `recompress-low`, and `tinyjpg` created fairly obvious artifacting and gradient banding. Besides `jpegtran`, the rest of them created artifacting, but isn't to a much lesser extent. It's really only noticeable if I turn my monitor brightness all the way up.

At this point, I would say `recompress-medium` and `mozjpeg-medium` had the best compression while still retaining fairly good quality, although artifacting is still noticeable if you look hard enough. `imageoptim` and `compressorio` did very well, but produced a small amount of pixelated banding, but isn't as noticeable.

<div class="md-spacer">
  <table class="Table is-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>SSIM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Original</td>
        <td>962 KB</td>
        <td>N/A</td>
      </tr>
      <tr>
        <td>abraia</td>
        <td>325 KB</td>
        <td>0.99817</td>
      </tr>
      <tr>
        <td>compressorio</td>
        <td>531 KB</td>
        <td>0.99959</td>
      </tr>
      <tr>
        <td>imageoptim</td>
        <td>299 KB</td>
        <td>0.99903</td>
      </tr>
      <tr>
        <td>jpegtran</td>
        <td>896 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>jpegtran-progressive</td>
        <td>878 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>mozjpeg</td>
        <td>1530 KB</td>
        <td>0.99998</td>
      </tr>
      <tr>
        <td>mozjpeg-medium</td>
        <td>399 KB</td>
        <td>0.99923</td>
      </tr>
      <tr>
        <td>recompress-low</td>
        <td>200 KB</td>
        <td>0.99876</td>
      </tr>
      <tr>
        <td>recompress-medium</td>
        <td>545 KB</td>
        <td>0.99962</td>
      </tr>
      <tr>
        <td>tinyjpg</td>
        <td>228 KB</td>
        <td>0.99924</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TODO: Just make these an iframe -->
<div class="md-fullWidth md-spacer">
  <div style="max-width: 900px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareWorkHarderTabs"></tabbed-image-compare>
  </div>
</div>

#### Image: Flowers

While switching back and forth between the `tinyjpg` and the original in different tabs in Firefox, I noticed a difference in color that wasn't noticeable in Chrome. As it turns out, Firefox renders several of the compressed versions with more saturation, but Chrome doesn't.

<div>
  <img
    src="/images/posts/image-compressors-compared/flower-firefox.png"
    alt="flowers in firefox"
    class="Image has-shadow is-rounded u-mxauto"
    style="max-width: 500px; width: 100%;"
  >
</div>

As far as bytes saved, `recompress-low` took a good chunk out of the file size, and it certainly shows. It made the image look quite pixelated, while `tinyjpg` is looks acceptable. To my eyes, the others look the same as the original.

<div class="md-spacer">
  <table class="Table is-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>SSIM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Original</td>
        <td>1174 KB</td>
        <td>N/A</td>
      </tr>
      <tr>
        <td>abraia</td>
        <td>527 KB</td>
        <td>0.99947</td>
      </tr>
      <tr>
        <td>compressorio</td>
        <td>900 KB</td>
        <td>0.99990</td>
      </tr>
      <tr>
        <td>imageoptim</td>
        <td>513 KB</td>
        <td>0.99982</td>
      </tr>
      <tr>
        <td>jpegtran</td>
        <td>1137 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>jpegtran-progressive</td>
        <td>1095 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>mozjpeg</td>
        <td>1584 KB</td>
        <td>0.99999</td>
      </tr>
      <tr>
        <td>mozjpeg-medium</td>
        <td>611 KB</td>
        <td>0.99982</td>
      </tr>
      <tr>
        <td>recompress-low</td>
        <td>217 KB</td>
        <td>0.99829</td>
      </tr>
      <tr>
        <td>recompress-medium</td>
        <td>530 KB</td>
        <td>0.99982</td>
      </tr>
      <tr>
        <td>tinyjpg</td>
        <td>329 KB</td>
        <td>0.99940</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="md-fullWidth md-spacer">
  <div style="max-width: 900px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareFlowersTabs"></tabbed-image-compare>
  </div>
</div>

#### Image: Coffee

Once again, if you view this in Firefox, you'll see a more saturated image on the right for several of the compressed versions. I imagine that's a bug with Firefox. In any case, I don't see any noticeable artifacting for any of the compressed images.

<div class="md-spacer">
  <table class="Table is-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>SSIM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Original</td>
        <td>824 KB</td>
        <td>N/A</td>
      </tr>
      <tr>
        <td>abraia</td>
        <td>329 KB</td>
        <td>0.99875</td>
      </tr>
      <tr>
        <td>compressorio</td>
        <td>613 KB</td>
        <td>0.99965</td>
      </tr>
      <tr>
        <td>imageoptim</td>
        <td>390 KB</td>
        <td>0.99942</td>
      </tr>
      <tr>
        <td>jpegtran</td>
        <td>817 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>jpegtran-progressive</td>
        <td>782 KB</td>
        <td>1.00000</td>
      </tr>
      <tr>
        <td>mozjpeg</td>
        <td>1055 KB</td>
        <td>0.99997</td>
      </tr>
      <tr>
        <td>mozjpeg-medium</td>
        <td>428 KB</td>
        <td>0.99943</td>
      </tr>
      <tr>
        <td>recompress-low</td>
        <td>250 KB</td>
        <td>0.99821</td>
      </tr>
      <tr>
        <td>recompress-medium</td>
        <td>570 KB</td>
        <td>0.99971</td>
      </tr>
      <tr>
        <td>tinyjpg</td>
        <td>308 KB</td>
        <td>0.99879</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="md-fullWidth md-spacer">
  <div style="max-width: 700px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareCoffeeTabs"></tabbed-image-compare>
  </div>
</div>


### Results

#### tinyjpg

`tinyjpg` has fairly aggressive compression, which, depending on the image, produces noticeable artifacting and color shifting. Whether or not the artifacting is acceptable is up to you. I have a hunch `jpeg-recompress` and `mozjpeg` could be tuned to get slightly closer to `tinyjpg's` compression without as much loss in quality.

#### Abraia

`abraia` did about the same as `tinyjpg`. It reduced the file sizes quite well, but also produced barely noticeable artifacting and color shifting, aside from the Work Hard image, of course, which had farily obvious gradient banding.

#### jpegtran

According to the SSIM scores, it truly is a lossless compressor. However, I'm usually looking to save a lot more bytes than what it does, so I'm not really interested in this compressor. However, if I need a lossless compressor, I know where to look.

#### jpeg-recompress and mozjpeg

Again, I've no idea why `mozjpeg` with default settings outputs a file greater than the input size. However, with a quality setting of `80`, it reduced the file size quite well while retaining nearly identical quality. `jpeg-recompress` also did well with the "medium" settings.

Basically, for these two plugins, it's not, *"These plugins are too aggressive or not aggressive enough"*. The quality and size reductions are the result of what settings you pass to them. They can either achieve good compression while sacrificing a good deal of quality, compress decently (as compared to tinyjpg) while retaining good quality, or somewhere in between.

#### imageoptim

Out of all of them, I would say `imageoptim`, with the preset `medium` settings, did the best at reducing the file size while retaining as much of the quality as possible. I used their website uploader, so I'm not quite sure what settings their app has.

### Conclusion

Interestingly, different pictures produced a different quality of output for the same compressor with the same settings. Some pictures were pixelated and some weren't. This just goes to show you should always look at the end result to make sure the output quality is acceptable.

**To decide which compressor is best for you**, or even what settings you choose for the compressor, **you have to decide what you value**. This is a "seesaw" decision. Do you value bytes saved or image quality?

Personally, I value bytes saved, and I highly doubt the majority of users are going to notice the minor artifacting. In fact, I found the artifcating to only be noticeable on a high ppi screen with the brightness turned all the way up. `imageoptim` and `jpeg-recompress` or `mozjpeg` all look like great choices for the most bytes saved while retaining quality, if the settings are right.




<script>
const defaultTitles = [
  {
    text: 'abraia',
    path: ({ image, ext = 'jpg' }) => `abraia/${image}.[abraia].${ext}`,
  },
  {
    text: 'compressorio',
    path: ({ image, ext = 'jpg' }) => `compressorio/${image}.[compressorio].${ext}`,
  },
  {
    text: 'imageoptim',
    path: ({ image, ext = 'jpg' }) => `imageoptim/${image}.[imageoptim].${ext}`,
  },
  {
    text: 'jpegtran',
    path: ({ image, ext = 'jpg' }) => `jpegtran/${image}.[jpegtran].${ext}`,
  },
  {
    text: 'mozjpeg',
    path: ({ image, ext = 'jpg' }) => `mozjpeg/${image}.[mozjpeg].${ext}`,
  },
  {
    text: 'mozjpeg-medium',
    path: ({ image, ext = 'jpg' }) => `mozjpeg-medium/${image}.[mozjpeg-medium].${ext}`,
  },
  {
    text: 'recompress-low',
    path: ({ image, ext = 'jpg' }) => `recompress-low/${image}.[recompress-low].${ext}`,
  },
  {
    text: 'recompress-medium',
    path: ({ image, ext = 'jpg' }) => `recompress-medium/${image}.[recompress-medium].${ext}`,
  },
  {
    text: 'tinyjpg',
    path: ({ image, ext = 'jpg' }) => `tinyjpg/${image}.[tinyjpg].${ext}`,
  },
]

const createTabs = ({
    index,
    ext = 'jpg',
    width,
    height,
    image,
    titles = defaultTitles
  }) =>
  titles.map((title) => ({
    text: title.text,
    id: `image-compare-${image}-${title.text.toLowerCase()}`,
    width,
    height,
    left: {
      url: `/images/posts/image-compressors-compared/compressed/images/${image}.[original].${ext}`,
    },
    right: {
      url: `/images/posts/image-compressors-compared/compressed/${title.path({ image })}`,
    }
  }))

export default {
  data() {
    return {
      imageCompareLeavesTabs: createTabs({
        index: 1,
        width: 2623,
        height: 3456,
        image: 'leaves',
      }),
      imageCompareWorkHarderTabs: createTabs({
        index: 3,
        width: 4240,
        height: 2384,
        image: 'workharder',
      }),
      imageCompareFlowersTabs: createTabs({
        index: 4,
        width: 2267,
        height: 4032,
        image: 'flowers',
      }),
      imageCompareCoffeeTabs: createTabs({
        index: 5,
        width: 2047,
        height: 2559,
        image: 'coffee',
      }),
    }
  },
  components: {
    TabbedImageCompare: require('@/components/TabbedImageCompare.vue').default,
  },
}
</script>
