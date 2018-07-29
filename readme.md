
# My website

v2 of my website, built with Nuxt.js. Cool, init? Still a work in progress.

## Todo

- Refactor component filename to be AppSiteHeader instead of just SiteHeader
- add these to package.json and modify webpack to handle css plugins

```
"sass-lint": "1.12.1",
"fastclick": "1.0.6",
"cssnano": "3.10.0",
"autoprefixer": "8.1.0",
```

- Maybe add js to fullscreen an image
- Add make-grid-column
- Use this for when switching between posts


     transform: scale(0.7) translateY(50px);
    transform-origin: 50% top;
    transition: transform 400ms;

- Convert all old BEM to SUIT style
- Use mixins for including styles into elements like headings and don't forgot to prefix these with `make-`
- Fix the logo link text color on post pages
- Change colors to variables
- Edit some of the articles errors like in medium image loading and favorite features of es2015
- Add codepen js to article pages
- Update about page and various pieces of text to sound more professional.
- Add disqus back to articles


#c5d6bb



// /**
//  * Creates a row
//  */
// =row($args: ())
//   $max-width: app-size('xxlg')
//   +margin(null auto)
//   +padding(null $row-gutter)

//   @each $item in $args
//     @if app-breakpoint($item)
//       $max-width: app-breakpoint($item)
//       @else
//   display: block
//   max-width: app-size('xxlg')

//   @media (max-width: app-breakpoint('xsm'))
//     +padding(null $row-gutter-at-small)

