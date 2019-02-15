<template>
  <ul class="IconList">
    <li class="IconList-item">
      <a
        href="http://codepen.io/anthonykoch"
        title="Codepen"
        class="IconList-link"
      >
        <icon-codepen></icon-codepen>
      </a>
    </li>
    <li class="IconList-item">
      <a
        href="https://github.com/anthonykoch"
        title="Github"
        class="IconList-link"
      >
        <icon-octocat></icon-octocat>
      </a>
    </li>
    <li class="IconList-item">
      <a
        href="https://twitter.com/anthkoch"
        title="Twitter"
        class="IconList-link"
      >
        <icon-twitter></icon-twitter>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SocialIcons',
  components: {
    IconCodepen: require('@/assets/images/icons/codepen.svg').default,
    IconOctocat: require('@/assets/images/icons/octocat.svg').default,
    IconTwitter: require('@/assets/images/icons/twitter.svg').default,
    // IconReddit: require('@/assets/images/icons/reddit.svg').default,
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/bootstrap';

.IconList {
  align-items: center;
  display: inline-flex;
  /* display: grid; */
  /* grid-gap: 20px; */
  text-align: center;
  /* grid-template-columns: repeat(3, 1fr); */
  justify-content: center;
  user-select: none;
}

.IconList-item {
  /* padding-left: 20px;
  padding-right: 20px; */
  width: 60px;
}

.IconList-link {
  align-items: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  display: flex;
  position: relative;
  text-align: center;
  width: 100%;

  &:link,
  &:visited {
    color: $app-icon-list-link-foreground;
  }

  &:hover,
  &:active {
    color: $app-color-link;
  }

  & svg {
    fill: currentColor;
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>
