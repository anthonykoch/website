
# My website

v2 of my website, built with Nuxt.js. Cool, init? Still a work in progress.

## Todo

- Refactor component to be AppSiteHeader instead of just SiteHeader
- Refactor sass styles
- add these to package.json and modify webpack to handle css plugins

```
"sass-lint": "1.12.1",
"fastclick": "1.0.6",
"cssnano": "3.10.0",
"autoprefixer": "8.1.0",
```

- Maybe add js to fullscreen an image
- Show work as images and make it like that shipify slider
- Add make-grid-column
- Refactor gutter and spacing variables
- Update various bits of spacing throughout the website that were changed when consildating gutter values
- Update codepen title font size




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

