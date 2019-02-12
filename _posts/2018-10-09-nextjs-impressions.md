---
author: Anthony Koch
title: NextJS Impressions
tags: ['nextjs', 'review']
id: 10
created_at: 2018-10-09
---

Server-Side Rendering (SSR) seems to be all the rage nowadays, so I'd thought I'd get in on the action by trying out [NextJS](https://nextjs.org), which is a framework for writing SSR applications in React. Next allows rendering your React application pages to HTML on the server, meaning that users be able to see your application interface before React has even loaded into the browser.

<!-- endexcerpt -->

There are pros and cons to using SSR. A great article describing the differences is:<br>
["The Benefits of Server Side Rendering Over Client Side Rendering"](https://medium.com/walmartlabs/the-benefits-of-server-side-rendering-over-client-side-rendering-5d07ff2cefe8)


### NextJS High level overview

Next comes with a special directory called `pages/`. Each file inside this directory will map to a route of your application with the same name. For example, the file `pages/about.js` would render at the route `/about` in the browser, and `pages/about/careers.js` would map to `/about/careers`.

The components in the `pages/` directory will be used to render your application in the server and the browser. A basic page component will look this:

```js
import React from 'react'
import EmployeeList from '../components/EmployeeList'
import axios from 'axios'

export default class About extends React.Component {
  static async getInitialProps({ req }) {
    // req is an express Request object and will
    // be undefined when running in the browser
    if (req) {
      const services = require('../server/services')

      return {
        users: await services.getEmployees(),
      }
    } else {
      return {
        users: await axios.get('/api/employees'),
      }
    }
  }

  render() {
    const { users } = ths.props

    return (
      <div>
        <h1>About us</h1>
        <EmployeeList users={users}></EmployeeList>
      </div>
    )
  }
}
```

The only difference here from a normal React component is the addition of `getInitialProps`. This `getInitialProps` is Next specific, and only works on components defined in `pages/`. The purpose of `getInitialProps` is to allow you to populate the page with data from a database when the page is being rendered on the server, or from an API when being rendering in the user's browser.


### What I built

The [application I built](https://github.com/anthonykoch/emailapp/) to try out Next is a meeting scheduler and messaging application, [based on this](https://dribbble.com/shots/4317968-S-App-Login) and [this dribbble design](https://dribbble.com/shots/3903437-Dashboard-message). The entire list of things I used to build it are:

- [next.js v7](https://nextjs.org)
- [mobx](https://mobx.js.org)
- [react-emotion](https://emotion.sh/docs) (styled-components type of thing)
- [next-routes](https://github.com/fridays/next-routes)
- [feathersjs](https://feathersjs.com)
- postgres
- docker
- [flowtype](https://flow.org) on the client and server
- ES6/7 on the client and server

<p>
  <div data-allow-fullscreen data-max-width="80vw"></div>
  <img
    src="https://raw.githubusercontent.com/anthonykoch/emailapp/master/emailapp.gif"
    style="box-shadow: 0 16px 40px -9px hsla(0,0%,51%,0.6);border-radius: 4px;"
  >
</p>


### Initial impressions

Next is very minimal and unopiniated in its default configuration. A base Next project only has three directories: a `static/` directory for your static assets, `components/`, and `pages/`. From there, you choose your own path on how you want to structure your project.

It doesn't include a loader for loading images or CSS files, and becomes quite a contrast to [create-react-app (CRA)](https://github.com/facebook/create-react-app), which includes a lot by default. Just about the only thing Next does come with is [styled-jsx](https://github.com/zeit/styled-jsx). The minimalism is not a bad thing at all, though. I actually prefer Next's setup because CRA came with too many things I didn't want for this project.

If we compare Next with [Nuxt](http://nuxtjs.org), we see Nuxt provides a lot more out of the box such as default loaders for images, css, postcss, first class support for postcss plugins and first class provisions to setup a Vuex store. As mentioned, Next doesn't come with any of these things, but provides a simple platform on which to build SSR applications where you only integrate what you need.

<div>
  <div class="Aside">
    <div class="Aside-content">
      <div class="Aside-tag  [ Tag is-absolute ]">Integration examples</div>
        There are a <a href="https://github.com/zeit/next.js/tree/master/examples">ton of examples</a> of how to integrate various loaders and other packages in with Next. I would highly recommend reading them because this is SSR land, and things need to be set up in special ways in order to function properly.
    </div>
  </div>
</div>


As someone who hasn't done much backend work, integrating FeathersJS was actually pretty simple once I read [http://www.albertgao.xyz/2018/02/04/how-to-do-server-side-rendering-with-feathersjs-and-nextjs/](http://www.albertgao.xyz/2018/02/04/how-to-do-server-side-rendering-with-feathersjs-and-nextjs/). A little rewiring in places and setup of some middleware was all that was needed.


### Styled-jsx

`styled-jsx` is Next's default way of styling elements. It's a scoped CSS solution using style tags and is somewhat reminiscient of Vue's Single File component styling solution.

```js
const Nav = () => (
  <div>
    <div class="Title"></div>
    <style jsx>{`
      .Title {
        color: red
      }
    `}</style>
  </div>
)
```

While I do really like `styled-jsx`, at the end of the day, it's basically writing plain css, and I don't like writing plain CSS anymore. I want variables, the `&` selector and other features that put a big ol' smile on my face.

There are plugins like `styled-jsx-plugin-sass` and `styled-jsx-plugin-postcss` you can use to get these features, but it comes with a caveat. Hot reloading [will not work](https://github.com/zeit/styled-jsx/issues/83) with files imported into a `<style jsx>` tag. If you don't use imports, then you should be able to use these plugins without issue. It's worth noting that `styled-jsx` does automatic vendor prefixing, so PostCSS isn't needed for that purpose.

After deciding between `styled-jsx`, scoped CSS files/Sass files and `react-emotion`, I ended up going with `react-emotion` purely because I wanted to try out a styled-components type solution. Sadly, you can't `npm un styled-jsx` from your project because it's included in the `next` package.


### ಠ_ಠ Annoyances

#### Active class name

Coming from Vue/Nuxt, I would have liked to have seen an `active-class` equivalent (`activeClassName` in react-router land) for the `<Link>` component. If you're unfamiliar, `active-class` provides the ability to style an element based on whether or not the link's route matches the currently active route.

I do believe the maintainers have said they will not be adding this feature in the future. This is not a super big deal, though, as I was able to piece together a higher order component to fill in for its absence.


#### Routing

If you want dynamic urls like `/users/:userid`, then you'll have to roll your own server routing, or look for a third party package such as `next-routes`.


#### &lt;Link&gt; and styled-components

There is also a bit of awkwardness with having to wrap anchor tags with `<Link>` because `<Link>` itself doesn't render a tag. It only passes a `href` prop down to its child.

```js
// wrong: using a string as a child of <Link> is deprecated
const Nav = () => (<Link to="/about">About</Link>)

// correct: renders <a href="/about">About</a>
const Nav = () => (<Link to="/about"><a>About</a></Link> )
```

Having to declare an `<a>` tag without a href is weird, but by itself isn't so bad. What is annoying is that `Link` can not be extended by `styled-components` as `const StyledLink = styled(Link)`.

The next logical step after learning of this limitation is to create a styled-component that renders an `<a>` tag, but that won't work unless you specifically add a `passHref` attribute.

```js
import styled from 'react-emotion'

const SidebarLink = styled('a')`
  color: blue;
`

// wrong: renders <a>About</a>
const Nav = () => (
  <Link to="/about">
    <SidebarLink>About</SidebarLink>
  </Link>
)

// correct: Renders <a href="/about">About</a>
const Nav = () => (
  <Link to="/about" passHref>
    <SidebarLink>About</SidebarLink>
  </Link>
)
```

Yes, this is all explained in the docs, but that doesn't make it any less awkward and annoying. These aren't breaking issues, but at the end of it all, you just get several layers of awkwardness.


#### No commons folder

With some configuration, Next does allow separating your files into a separate folders as:

```
server/
client/
next.config.js
```

but does not allow does not allow a `shared/` or `commons/` folder alongside them [because of compilation reasons](https://github.com/zeit/next.js/issues/3898).


#### I ain't mad

Currently, Next is on `v7` and I'm sure the maintainers had reasons for doing what they did and only including certain bits into Next. At the end of the day, none of these are breaking issues, but they do make things awkward to do. I'm not a fan, but it is what it is `¯\_(ツ)_/¯`


### Would I use it again?

Absolutely. It worked well for the app I built and SSR has some great advantages. As far as Next vs Nuxt goes, I would be inclined to go the Nuxt route, not only because I'm more of a Vue person, but because Nuxt has a more built in without being too much. It comes with `active-class` for links via `<router-link>`, dynamic routing, a Vuex store, and more default loaders (images, css, postcss), which are typically things that I'd want in any project.
