<template>
  <footer class="SiteFooter">
    <small class="Copyright">
      <span class="u-inlineBlock Copyright-symbol">&copy;</span>
      <div class="logo">
        <span class="is-first">Anthony</span>
        <span class="is-last">Koch</span>
      </div>
      <div></div>
    </small>
    <app-social-icons></app-social-icons>
  </footer>
</template>

<style lang="scss" scoped>

@import '../assets/styles/bootstrap';

.Copyright {
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: spacing(1);
}

.Copyright-symbol {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}

.logo {
  /* background-color: $app-color-1; */
  /* color: white; */
  /* color: $app-color-background-dark; */
  font-family: $app-font-family-1;
  box-shadow: 0 20px 60px -6px rgba(black, 0.6);
  /* border-radius: 50%; */
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 2px;
  font-weight: 500;
  /* height: 50px; */
  /* margin-right: 40px; */
  /* border-radius: 3px; */
  /* width: 200px; */

  span {
    display: inline-block;
  }
}

.sitemap {
  display: flex;
  justify-content: center;
  margin-bottom: spacing(1);

  > li {
    font-weight: 500;

    > a {
      padding-left: 8px;
      padding-bottom: 3px;
      padding-right: 8px;
      padding-top: 3px;

      &:link,
      &:visited {
        color: white;
      }

      &:hover,
      &:active {
        color: $app-color-link;
      }
    }
  }
}

.dot {
  background-color:rgba(white, 0.7);
  border-radius: 50%;
  display: none;
  height: 6px;
  margin-left: 30px;
  margin-right: 30px;
  width: 6px;
}

.SiteFooter {
  background-color: $app-color-background-dark;
  color: rgba(white, 0.9);
  font-size: 14px;
  justify-content: space-between;
  padding: 32px 32px;
  text-align: center;
}

.meme {
  display: inline-flex;

  > li {
    margin-left: 40px;

    a {
      &:link,
      &:visited {
        color: #fff;
      }
    }
  }
}

@include app-breakpoint-min(lg) {
  .SiteFooter {
    align-items: center;
    display: flex;
    text-align: center;
  }

  .Copyright {
    margin-bottom: 0;
  }

  /* .dot {
    display: block;
  }

  .separation {
    align-items: center;
    display: flex;
  }

  .sitemap {
    > li {
      > a {
        padding-left: 18px;
        padding-right: 18px;
      }
    }
  }
  */
}
</style>
