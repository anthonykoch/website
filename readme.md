
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
- Figure out design for date meta in post preview
- Use this for when switching between posts


     transform: scale(0.7) translateY(50px);
    transform-origin: 50% top;
    transition: transform 400ms;

- darken post font color
- change code theme to oceanremove side padding
- Complete and move the .md class
- Complete mobile styles for post
- Make logo text fixed on blog post
- Remove asterisk comments from Sass
- Fix list margin left in post/md styles
- Convert all old BEM to SUIT style
- Use mixins for including styles into elements like headings and don't forgot to prefix these with `make-`
- Fix the logo link text color on post pages
- Change colors to variables
- Edit some of the articles errors like in medium image loading and favorite features of es2015
- Add codepen js to article pages
- Fix post previews being offset because of max-width

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

