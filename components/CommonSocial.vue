<template>
  <app-social-icons
    :social="$store.getters['social/getMediaItems']"
  ></app-social-icons>
</template>
