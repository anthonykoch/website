---
author: Anthony Koch
title: Image compressors compared
tags: ['nextjs', 'review']
id: 11
created_at: 2019-02-06
---

Many people often include an image optimizer in their build chain, but just how good are they? Are they worth the build time? What even are the choices?

<!-- endexcerpt -->

### A tale of bad compression

When I was previously at Plaid, we had used an image optimizer from npm and it was fairly useless. Large images, megabytes in size, went through with only a 50-100 KB loss. Since then, I had pretty much sworn off all image compressors from npm and just used tinyjpg. Overall, they just seemed like a gigantic waste of time. Afterall, the compressor increased the build time in minutes.

Recently, my curiousity has gotten the best of me. I really wanted to figure out:

1. What are all the cross-platform image compress?
2. How well do they compress with different settings?
3. What is the quality of the image the comes out?

### The contenders

#### ImageOptim

I'm not quite sure what ImageOptim is. It seems to be a conglomeration of differnet tuned plugins. They have an Mac OS only app, a paid API service, as well as a free online uploader thing [https://imageoptim.com/online](https://imageoptim.com/online).


#### imagemin

This is probably the most popular image optimizer, seeing as it's both free and on npm. It works by utilizing plugins such as jpegtran, jpeg-recompress, mozjpeg and pngquant. I do believe all of the plugins listed here are meant to be cross-platform, however, jpeg-recompress failed to run on a vagrant VM using a trusty64 box.

##### Resources

[Quality, min and max with jpeg-recompress](https://mika-s.github.io/javascript/jpeg/compression/algorithm/2018/01/10/quality-min-and-max-with-jpeg-recompress.html)

#### tinyjpg/tinypng

[tinyjpg.com](https://tinyjpg.com) or tinyjpg.com (same thing) is a two part service. They have a webpage where you can upload and compress up to 10 images at one time, with a maximum size limit of 5MB. They also have a paid API service. They support compressing pngs and jpegs


#### compressor.io

[compressor.io](https://compressor.io) is free service that, but only allows you to compress one image at a time, with a maximum limit of 10MB. It supports compressing svgs, pngs, jpgs, and gifs, with the option to go for lossy or lossless compression for pngs and jpgs.


#### Abraia

I had never heard of this optimizer before writing this article. I decided to add it in last second just for the hell of it.


#### Others

Others I've found were kraken.io, which I didn't include because it only allows 1MB uploads; compressjpg.


### Comparing compression

We'll have three different jpeg images to compress. The output size *and* quality of the resulting image will be compared.

```info{2-3}
Name                 |  What it is
---------------------|-------------------------------------
recompress-low       |  jpeg-recompress with quality=low
recompress-medium    |  jpeg-recompress with quality=medium
mozjpeg              |  mozjpeg with quality=95
mozjpeg-low          |  mozjpeg with quality=80
jpegtran             |  jpegtran
jpegtran-progressive |  jpegtran with progressive=true
imageoptim           |  https://imageoptim.com/online with quality=medium
compressorio         |  https://compressor.io
tinyjpg              |  https://tinyjpg.com
```

One thing you'll note, is the `mozjpeg` actually outputs larger images than the origial. I'm not sure how that happened or if I've done it wrong. The repo for how I compressed the images lives at:

[github.com/anthonykoch/compressors-compared](https://github.com/anthonykoch/compressors-compared)


### Image: Leaves

If you look closely, you can see that both `recompress-low` and `tinyjpg` changed the colors of the portions of the image. I would say `imageoptim` and `mozjpeg-low` both take the win here for most compression without changing the quality of the image.

```info
 862 kb leaves.jpg
 253 kb leaves-tinyjpg.jpg
 573 kb leaves-recompress-medium.jpg
 185 kb leaves-recompress-low.jpg
1002 kb leaves-mozjpeg.jpg
 391 kb leaves-mozjpeg-low.jpg
 815 kb leaves-jpegtran.jpg
 812 kb leaves-jpegtran-progressive.jpg
 358 kb leaves-imageoptim.jpg
 611 kb leaves-compressorio.jpg
```

<div class="md-fullWidth md-spacer">
  <div style="max-width: 700px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareLeavesTabs"></tabbed-image-compare>
  </div>
</div>

### Image: Work Harder

The aggressive compression from `recompress-low` created a fairly obvious pixelated banding in this image. It's obvious enough to call it unacceptable.

`tinyjpg` produced nearly the same output, but to a slightly lesser extent.

I would say `recompress-medium` and `mozjpeg-low` had the best compression while still retaining fairly good quality, although artifacting is still noticeable if you look hard enough. `imageoptim` and `compressorio` did very well, but produced a small amount of pixelated banding, but isn't as noticeable.

```info
 962 kb workharder.jpg
 228 kb workharder-tinyjpg.jpg
 545 kb workharder-recompress-medium.jpg
 200 kb workharder-recompress-low.jpg
1530 kb workharder-mozjpeg.jpg
 399 kb workharder-mozjpeg-low.jpg
 896 kb workharder-jpegtran.jpg
 878 kb workharder-jpegtran-progressive.jpg
 299 kb workharder-imageoptim.jpg
 531 kb workharder-compressorio.jpg
```

<!-- TODO: Just make these an iframe -->
<div class="md-fullWidth md-spacer">
  <div style="max-width: 900px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareWorkHarderTabs"></tabbed-image-compare>
  </div>
</div>

```info
1174 kb flowers.jpg
 329 kb flowers-tinyjpg.jpg
 530 kb flowers-recompress-medium.jpg
 217 kb flowers-recompress-low.jpg
1584 kb flowers-mozjpeg.jpg
 611 kb flowers-mozjpeg-low.jpg
1137 kb flowers-jpegtran.jpg
1095 kb flowers-jpegtran-progressive.jpg
 513 kb flowers-imageoptim.jpg
 900 kb flowers-compressorio.jpg
```

<div class="md-fullWidth md-spacer">
  <div style="max-width: 900px; margin: 0 auto">
    <tabbed-image-compare :tabs="imageCompareFlowersTabs"></tabbed-image-compare>
  </div>
</div>

### Results

#### tinyjpg

`tinyjpg` has quite an aggressive compression that produces somewhat noticeable artifacting and color shifting depending on the image. Whether or not the artifacting is acceptable is up to you. I have a hunch `jpeg-recompress` and `mozjpeg` could be tuned to get near `tinyjpg's` compression without the terrible loss in quality.

#### jpegtran

I have to assume `jpegtran` is a lossless compression, which is not really what I want.

#### jpeg-recompress and mozjpeg

Again, I've no idea why `mozjpeg` with default settings outputs a file greater than the input size. However, with a quality setting of `80`, it reduced the file size quite well while retaining nearly identical quality. `jpeg-recompress` also did well with the lesser aggressive compression settings.

Basically, for these two plugins, the quality and compression are the result of what settings you pass to them. They can either achieve good compression while sacrificing a good deal of quality or compress decently (as compared to tinyjpg) while retaining good quality.

#### imageoptim

`imageoptim` with quality `medium` reduced the file size pretty well without a lot of artifacting.

### Conclusion

Is the artifacting worth the reduction in file size? You may notice the artifacting, but will the majority of users?


<script>
import cuid from 'cuid'

const defaultTitles = ['recompress-low', 'recompress-medium', 'mozjpeg', 'mozjpeg-low', 'jpegtran', 'compressorio', 'tinypng', 'imageoptim', 'abraia']

const createTabs = ({
    index,
    ext = 'jpg',
    width,
    height,
    name,
    titles = defaultTitles
  }) =>
  titles.map((title) => ({
    text: title,
    id: `image-compare-${name}-${title.toLowerCase()}`,
    width,
    height,
    left: {
      url: `/images/posts/image-compressors-compared/images/${name}.${ext}`,
    },
    right: {
      url: `/images/posts/image-compressors-compared/${title}/${name}${title ? '-' + title : ''}.${ext}`,
    }
  }))


export default {
  data() {
    return {
      imageCompareLeavesTabs: createTabs({
        index: 1,
        width: 2623,
        height: 3456,
        name: 'leaves',
      }),
      imageCompareWorkHarderTabs: createTabs({
        index: 3,
        width: 4240,
        height: 2384,
        name: 'workharder',
      }),
      imageCompareFlowersTabs: createTabs({
        index: 4,
        width: 2267,
        height: 4032,
        name: 'flowers',
      }),
      imageCompareLampTabs: createTabs({
        index: 5,
        width: 4738,
        height: 3159,
        name: 'lamp',
      }),
    }
  },
  components: {
    TabbedImageCompare: require('@/components/TabbedImageCompare.vue').default,
  },
  props: {
    // page: {
    //   type: Object,
    //   required: true,
    // },
  },
}
</script>
