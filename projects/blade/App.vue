<template>
  <div class="br-App  js-br-app" tabIndex="-1">
    <a href="/#blade" id="blade" name="blade" tabindex="-1"></a>

    <div class="br-Sidebar">
      <ul class="br-SidebarList">
        <li class="br-SidebarList-item br-SidebarList-item--newFile  js-br-button-new-file">
          <input
            class="br-InputNewFile  js-br-input-new-file"
            type="text"
            placeholder="Enter filename"
            ref="inputNewFile"
            v-model="newFileName"
            v-bind:class="{ 'br-InputNewFile--is-showing': isInputNewFileFocused }"
            @focusin="isInputNewFileFocused = true"
            @focusout="isInputNewFileFocused = false"
            @keyup.esc="isInputNewFileFocused = false"
            @keyup.enter="addFile">

          <button
            class="br-SidebarButton"
            tabindex="-1"
            ref="buttonNewFile"
            :class="{ 'br-SidebarButton--is-focused': isInputNewFileFocused }"
            @click="$refs.inputNewFile.focus()">
            <span class="br-SidebarButton-container">
              <span class="br-SidebarButton-iconWrapper">
                  <svg class="br-SidebarButton-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"/></svg>
              </span>
              <span class="br-SidebarButton-text">New File</span>
            </span>
          </button>
        </li>

        <li class="br-SidebarList-item  js-br-view-code">
          <button
            class="br-SidebarButton"
            tabindex="0"
            ref="buttonCode"
            :class="{ 'br-SidebarButton--is-active': activePane === 'code' }"
            @keyup.enter="updateActivePane({ value: 'code' })"
            @click="updateActivePane({ value: 'code' })">
            <span class="br-SidebarButton-container">
              <span class="br-SidebarButton-iconWrapper">
                <svg class="br-SidebarButton-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M190.4 354.1L91.9 256l98.4-98.1-30-29.9L32 256l128.4 128 30-29.9zm131.2 0L420 256l-98.4-98.1 30-29.9L480 256 351.6 384l-30-29.9z"/></svg>
              </span>
              <span class="br-SidebarButton-text">Code</span>
            </span>
          </button>
        </li>

        <li class="br-SidebarList-item br-SidebarList-item--seeFiles  js-br-view-files">
          <button
            class="br-SidebarButton"
            tabindex="0"
            ref="buttonViewFiles"
            :class="{ 'br-SidebarButton--is-active': activePane === 'files' }"
            @keyup.enter="updateActivePane({ value: 'files' })"
            @click="updateActivePane({ value: 'files' })">
            <span class="br-SidebarButton-container">
              <span class="br-SidebarButton-iconWrapper">
                <svg class="br-SidebarButton-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M437.334 144H256.006l-42.668-48H74.666C51.197 96 32 115.198 32 138.667v234.666C32 396.802 51.197 416 74.666 416h362.668C460.803 416 480 396.802 480 373.333V186.667C480 163.198 460.803 144 437.334 144zM448 373.333c0 5.782-4.885 10.667-10.666 10.667H74.666C68.884 384 64 379.115 64 373.333V176h373.334c5.781 0 10.666 4.885 10.666 10.667v186.666z"/></svg>
              </span>
              <span class="br-SidebarButton-text">View Files</span>
            </span>
          </button>
        </li>
      </ul>
    </div>

    <div class="br-MainPane" :active-pane="activePane">
      <div class="br-MainPane-left">
        <!--<div
          class="br-AboutPane"
          style="display: none"
          v-show="activePane === 'about'">
          <div class="br-AboutPane-header">
            <div class="br-AboutPane-headerTitle">About</div>
          </div>
          <div class="About">BladeJS</div>
          <div class="br-AboutPane-body  u-collapse-last">
            <h2 class="br-AboutPane-title">What is this project?</h2>
            <p>
              BladeJS is just a project I wrote for fun. The project took a couple of months.
            </p>

            <h2 class="br-AboutPane-title">Can I use it?</h2>
            <p>
              Technically you could, but I wouldn't recommend it. There are plenty of well tested templating engines. This was just a fun project to test my coding abilities.
            </p>

            <h2 class="br-AboutPane-title">What'd you use to build REPL?</h2>
            <p>
              This little application was built in with <a href="https://vuejs.org/">Vue</a> with Vuex. You can find the code for it on my github interspersed amongst the files of my personal website.
            </p>

            <a href="https://github.com/anthonykoch/anthonykoch.github.io/tree/master/_includes/bladerepl">HTML</a>
            <span style="margin-right: 10px; margin-left: 10px">&bull;</span>
            <a href="https://github.com/anthonykoch/anthonykoch.github.io/blob/master/_resources/styles/pages/_blade.sass">
              Sass
            </a>
            <span style="margin-right: 10px; margin-left: 10px">&bull;</span>
            <a href="https://github.com/anthonykoch/anthonykoch.github.io/tree/master/_resources/scripts/pages/blade">
              JavaScript
            </a>
          </div>
        </div>-->

        <div
          class="br-FilesPane br-FilesPane"
          style="display: none"
          v-show="activePane === 'files'"
        >
          <transition-group
            tag="ul"
            name="tr-listRemove"
            class="br-FilesList">
            <li
              is="br-file-list-item"
              v-for="(file, index) in files"
              :file="file"
              :key="file.id"
              v-on:file:delete="removeFile({ id: file.id })"
              v-on:file:update-path="updateFilePath"
              v-on:file:set-current="updateActiveFile({ id: file.id })"
              v-on:pane:update="updateActivePane({ value: 'code' })">
            </li>
          </transition-group>

          <div class="br-FilesPane-background">
            <div class="br-FilesPane-backgroundWrapper">
              <div class="u-text-center">
                <!-- <div style="margin-bottom: 10px; color: #6a6f71">Did you know?</div> -->
                <div class="br-FilesPane-backgroundComment">
                  <span class="u-inlineBlock">
                    {{ paneMessage }}
                  </span>
                </div>
              </div>
              <div class="br-FilesPane-backgroundText">@_@</div>
            </div>
          </div>
        </div>

        <div class="br-InputContainer" v-show="activePane === 'code'">
          <textarea
            class="br-Inputs-jsonInput"
            type="text"
            :value="jsonHeader"
            @keyup="onJsonHeaderKeyup"></textarea>

          <textarea
            class="br-InputField br-InputField--left"
            ref="inputLeft"
            :value="contents"
            @keyup="onInputLeftKeyup"
            @keydown.tab.prevent
            @keydown="onInputleftKeydown"></textarea>
        </div>
      </div>

      <div class="br-MainPane-right">
        <div
          class="br-OutputContainer">
          <textarea
            class="br-InputField br-InputField--right"
            readonly
            :value="output"></textarea>

          <div
            style="display: none"
            class="br-ErrorMessage"
            v-show="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import debounce from 'lodash/debounce';

import BrFileListItem from '@/projects/blade/components/FileListItem';

const KEY_TAB   = 9;
const KEY_ENTER = 13;

export default {
  data() {
    return {
      paneMessages: [
        `Hi, these are files you can include into your template`,
        `or you can extend them using @extend`,
        `who am I to tell you what to do?`
      ],

      paneMessageIndex: 0,

      newFileName: '',

      // FIXME: transition is weird on multiple clicks and input
      //        shadow shows under on mobile
      isInputNewFileFocused: false
    };
  },

  created() {
    const time = 5000;

    const loop = () => {
      this.paneMessageIndex =
        this.paneMessageIndex < this.paneMessages.length - 1
          ? this.paneMessageIndex + 1
          : 0;

      setTimeout(loop, time)
    }
  },

  computed: {
    ...mapState([
      'files',
      'activeFile',
      'activePane',
      'jsonHeader',
      'contents',
      'output',
      'error'
    ]),

    paneMessage() {
      return this.paneMessages[this.paneMessageIndex];
    },
  },

  components: {
    BrFileListItem,
  },

  watch: {
    activeFile(file) {
      this.updateJsonHeader(file.id, file.header);
      this.updateContents(file.contents);
      this.updateOutput(file.id);
    }
  },

  methods: {
    ...mapActions([
      'removeFile',
      'updateActivePane',
      'updateActiveFile'
    ]),

    updateFilePath(id, value) {
      this.$store.dispatch('updateFilePath', { id, value });
    },

    updateOutput(id) {
      this.$store.dispatch('updateOutput', { id });
    },

    updateContents(newContents) {
      this.$store.dispatch('updateContents', {
        id: this.activeFile.id,
        contents: newContents
      });
    },

    updateJsonHeader(id, value) {
      this.$store.dispatch('updateJsonHeader', { id, value });
    },

    onInputleftKeydown(e) {
      // FIXME: I don't know if this is necessary
      if (e.target.value.length > 5000) {
        e.preventDefault();
      }
    },

    onJsonHeaderKeyup(e) {
      this.updateJsonHeader(this.activeFile.id, e.target.value);
    },

    onInputLeftKeyup: debounce(function () {
      this.updateContents(this.$refs.inputLeft.value);
    }, 150),

    addFile() {
      const value = this.newFileName;

      if (value.trim() === '') {
        return;
      }

      this.newFileName = '';
      this.isInputNewFileFocused = false;

      this.$nextTick(() => this.$refs.inputNewFile.blur());
      this.$store.dispatch('addFile', { value });
    }
  }
};
</script>

<style lang="sass">

@import '../../assets/styles/bootstrap'

$br-sidebar-width: 200px
$br-input-border-color: rgba(black, 0.11)
$br-files-pane-background-color: white

$br-input-border-color: #d4d2c7
$br-files-pane-background-color: hsl(45, 23%, 88%)

$br-input-border: rem(1px) solid $br-input-border-color
$br-file-min-height: rem(60px)
$br-hover-gray: hsla(0, 0%, 0%, 0.04)
$br-file-name-padding-left: rem(32px)
$br-sidebar-button-background: #2f2e2f;
$br-sidebar-button-background: #333333;
$br-sidebar-button-background--active: darken($br-sidebar-button-background, 3.3);
$br-sidebar-background: $br-sidebar-button-background
$br-sidebar-button-foreground--active: hsl(0, 0%, 83%)

$br-input-field-line-height: rem(21px)
$br-input-field-font-size: rem(14px)
$br-input-tab-size: 2
$br-pane-left-width: 55%

$br-input-field-left-height: 60vh
$br-input-json-header-height: 200px
$br-pane-calc-min-height: calc(#{$br-input-field-left-height} + #{$br-input-json-header-height})

$br-code-font-family: consolas, menlo, monospace

$br-layer-sidebar: 900
$br-layer-newfileinput: 400
$br-layer-sidebar-button: 500
$br-layer-files-pane: 200

.br-App
  display: flex
  outline: 0

.br-Sidebar
  background-color: $br-sidebar-background
  min-width: rem($br-sidebar-width)
  overflow: visible
  position: relative
  width: rem($br-sidebar-width)
  z-index: $br-layer-sidebar

.br-SidebarList
  pass: pass

.br-SidebarList-item
  color: #eeeeee
  cursor: pointer
  font-size: rem(24px)
  line-height: rem(30px)
  position: relative

  &:last-of-type
    border-bottom: rem(1px) solid rgba(white, 0.03)

.br-SidebarButton
  +padding(rem(12px) spacing(0.75))
  background-color: $br-sidebar-button-background
  border: 0
  border-left: rem(3px) solid rgba(black, 0)
  border-bottom: rem(1px) solid rgba(black, 0.13)
  border-top: rem(1px) solid rgba(white, 0.05)
  box-shadow: 0 0 rem(4px) 0 rgba(black, 0.2)
  opacity: 1
  outline: 0
  padding-bottom: rem(18px)
  padding-top: rem(18px)
  position: relative
  text-align: left
  text-shadow: rem(1px) rem(1px) rem(1px) rgba(black, 0.2)
  transition-duration: 0.2s, 0.2s
  transition-property: border, background-color
  user-select: none
  will-change: border, background-color
  width: 100%
  z-index: $br-layer-sidebar-button

.br-SidebarButton--has-static-background:before
  background-color: $br-sidebar-button-background

.br-SidebarList-item:hover .br-SidebarButton,
.br-SidebarButton--is-active,
.br-SidebarButton:focus,
.br-SidebarButton--is-focused
  border-left-color: color('primary')

.br-SidebarButton--is-active
  background-color: $br-sidebar-button-background--active

.br-SidebarButton--is-active .br-SidebarButton-icon
  color: color('primary')

.br-SidebarButton--is-active .br-SidebarButton-text
  color: $br-sidebar-button-foreground--active

.br-SidebarButton-container
  align-items: center
  display: flex

.br-SidebarButton-text
  display: inline-block
  font-size: rem(14px)
  line-height: 1.6
  vertical-align: middle

.br-SidebarButton-iconWrapper
  display: inline-block
  margin-right: rem(8px)
  text-align: center

.br-SidebarButton-icon
  display: block
  filter: drop-shadow(rem(3px) rem(3px) rem(6px) rgba(black, 0.3))
  fill: color('primary')
  width: rem(20px)
  vertical-align: middle

.br-SidebarButton-icon--code
  font-size: rem(20px)

.br-SidebarButton-icon--about
  font-size: rem(20px)



.br-MainPane
  display: flex
  max-width: 100%
  width: 100%

.br-MainPane-left
  width: $br-pane-left-width

.br-MainPane-right
  width: 100% - $br-pane-left-width



// .br-AboutPane
//  background-color: #ffffff
//  height: $br-pane-calc-min-height
//  overflow-y: auto

// .br-AboutPane-header
//  position: relative
//  box-shadow: inset 0 0 rem(10px) rem(-1px) rgba(black, 0.3)
//  background: radial-gradient(circle, rgba(black, 0.2) 10%, transparent 10%)
//  // box-shadow: 0 6px 20px -2px rgba(black, 0.2)
//  background-size: 12px 12px
//  background-color: color('primary')
//  // background-color: #f6f5f3
//  overflow: hidden
//  margin-bottom: spacing(2)

// .br-AboutPane-headerTitle
//  +padding(spacing(0) spacing(1.5) )
//  color: color('primary')
//  color: white
//  // color: rgba(#211e1d, 0.5)
//  color: #3a3635
//  color: transparent
//  font-style: italic
//  letter-spacing: rem(10px)
//  line-height: 1.2
//  // font-family: lato
//  font-weight: 900
//  // font-weight: 600
//  // font-weight: 300
//  // font-weight: 200
//  // font-size: rem(200px)
//  // font-size: rem(150px)
//  font-size: rem(60px)
//  // font-size: rem(100px)
//  left: 50%
//  position: relative
//  text-transform: uppercase
//  transform: translate(-50%, rem(0px))
//  z-index: 1


// .About
//  color: color('primary')
//  font-size: rem(60px)
//  font-style: italic
//  font-weight: 600
//  letter-spacing: rem(10px)
//  left: 60px * 5
//  line-height: 0
//  position: absolute
//  text-transform: uppercase
//  text-align: right
//  top: 86px

// .br-AboutPane-title
//  +title('alternate')
//  color: color('foreground')
//  font-weight: 400
//  font-style: italic
//  font-size: rem(20px)
//  letter-spacing: rem(1px)
//  letter-spacing: rem(0)
//  padding-bottom: spacing(0.75)
//  text-transform: none

// .br-AboutPane-body
//  +padding(spacing(1) spacing(1.5) spacing(3))
//  max-width: rem(800px)

//  & > p
// bottom-18ze: rem(rem(16px))
//    font-size: rem(rem(16px))
//    color: color('foreground', 'light')
//    color: #7e8488



.br-FilesPane
  background-color: $br-files-pane-background-color
  background-image: linear-gradient(to right, #dce4e7, #ccd1d4)
  height: $br-pane-calc-min-height
  overflow: auto

.br-FilesPane--is-showing
  z-index: $br-layer-files-pane

.br-FilesPane-background
  position: relative

.br-FilesPane-backgroundWrapper
  +margin(spacing(1) auto null)
  cursor: default
  height: 100%
  max-width: rem(450px)
  user-select: none
  width: 80%

.br-FilesPane-backgroundText
  color: #bfcace
  font-size: rem(60px)
  text-align: center

.br-FilesPane-backgroundComment
  background-color: #c4cdd0
  border-radius: rem(200px)
  box-shadow: inset 0 0 rem(10px) rem(-1px) rgba(black, 0.2)
  color: hsla(197,4%,53%,1)
  display: inline-block
  font-size: rem(11px)
  letter-spacing: 2px
  overflow: hidden
  padding: rem(10px) rem(20px)
  text-align: center
  text-transform: uppercase
  width: 100%



.br-FilesList
  position: relative

.br-FilesList-item
  background-color: #ffffff
  box-shadow: 0 rem(6px) rem(18px) rem(-6px) rgba(black, 0.25)
  position: relative
  z-index: 2

.br-FilesList-item:hover .br-FileActions
  opacity: 1






.br-File
  background-color: hsla(0,0%,97%,1)
  border-bottom: rem(1px) solid rgba(black, 0.08)
  cursor: pointer
  display: flex
  justify-content: space-between
  height: 60px

.br-File-name
  align-items: center
  border-right: rem(1px) solid $transparent
  color: #949188
  display: flex
  flex: 1 0 auto
  font-size: rem(15px)
  font-style: italic
  outline-color: color('primary')
  padding-left: $br-file-name-padding-left
  position: relative
  transition: border-color 0.3s
  user-select: none

  &:hover
    background-color: $br-hover-gray
    border-right: rem(1px) solid rgba(black, 0.055)

.br-File-inputEditText
  +position(absolute, 0 null null 0)
  border: 0
  display: block
  height: 100%
  padding-left: $br-file-name-padding-left
  width: 100%






.br-FileActions
  align-items: center
  height: auto
  display: flex
  opacity: 0
  transition-duration: 0.2s
  transition-property: opacity
  user-select: none

.br-FileActions-button
  background-color: transparent
  border: 0
  height: 100%
  padding-left: 30px
  padding-right: 30px
  position: relative
  text-align: center
  transition-duration: 0.3s
  transition-property: background-color, box-shadow

  &:active,
  &:focus
    box-shadow: inset 0 rem(4px) rem(16px) rgba(black, 0.1)

  &:hover,
  &:active
    background-color: hsl(0, 0%, 90%)

.br-FileActions-icon
  fill: rgba(black, 0.5)
  left: 50%
  position: absolute
  top: 50%
  transform: translate(-50%, -50%)

  &.is-delete
    box-shadow: inset 0 rem(4px) rem(16px) $transparent
    box-sizing: border-box
    font-size: rem(26px)
    text-shadow: 0 0 0 $transparent
    width: 20px

  &.is-edit
    background-color: $transparent
    color: rgba(black, 0.5)
    width: 16px






.br-InputNewFile
  +padding(spacing(0.5) spacing(0.75))
  +position(absolute, 0 0 null null)
  background-color: #ffffff
  border: rem(1px) solid #eeeeee
  border-bottom-left-radius: 0
  border-top-left-radius: 0
  box-shadow: 0 rem(4px) rem(10px) rem(-2px) rgba(black, 0.27)
  display: block
  font-size: 15px
  color: rgba(black, 0.6)
  height: 100%
  margin: 0
  transition-duration: 0.25s, 0.5s
  transition-property: transform, opacity
  width: rem(250px)
  z-index: $br-layer-newfileinput

.br-InputNewFile::placeholder
  color: #ababab
  font-size: rem(14px)
  font-style: italic
  letter-spacing: 0.5px

.br-InputNewFile--is-showing
  opacity: 1
  transform: translateX(100%)



.br-OutputContainer
  position: relative

.br-InputContainer
  display: flex
  flex-direction: column

.br-Inputs-jsonInput
  background-color: #eeeeee
  border: 0
  font-family: $br-code-font-family
  font-size: $br-input-field-font-size
  height: $br-input-json-header-height
  margin: 0
  padding: 20px
  min-height: 0
  outline: 0
  overflow-y: scroll
  resize: none
  tab-size: $br-input-tab-size
  width: calc(100% - 1px)

.br-InputField
  background-color: hsl(0, 0, 98%)
  border: 0
  border-radius: 0
  color: color('foreground')
  font-family: $br-code-font-family
  font-size: $br-input-field-font-size
  line-height: $br-input-field-line-height
  margin: 0
  outline: 0
  padding: 20px
  position: relative
  resize: none
  tab-size: $br-input-tab-size
  width: 100%

  &:focus
    border-color: color('primary')

.br-InputField--left
  height: $br-input-field-left-height

.br-InputField--right
  height: $br-pane-calc-min-height
  border-left: 1px solid

  &:focus
    border: rem(1px) solid #cccccc



.br-ErrorMessage
  background-color: #eeeeee
  border: rem(1px) solid #dddddd
  border-left: 0
  bottom: 0
  font-family: $br-code-font-family
  font-size: rem(12px)
  left: 1px
  line-height: 1.4
  padding: spacing(0.25)
  position: absolute
  white-space: pre-wrap
  width: calc(100% - 1px)



.tr-listRemove,
.tr-listRemove-enter-active,
.tr-listRemove-leave-active,
.tr-listRemove-enter,
.tr-listRemove-leave
  transition: transform 0.2s
  will-change: transform

.tr-listRemove-enter,
.tr-listRemove-leave
  transform: translateY(rem(30px))

.tr-listRemove-leave-active
  transform: translateY(-120%)
  z-index: 1





@media (max-width: rem(900px))
  .br-MainPane
    display: block

  .br-MainPane-left,
  .br-MainPane-right
    width: 100%



@media (max-width: rem(690px))
  .br-AboutPane,
  .br-FilesPane,
  .br-InputField--left,
  .br-InputField--right
    height: 50vh

  .br-FilesPane-backgroundWrapper
    width: 90%

  .br-File-icon
    min-height: spacing(1.5)
    width: spacing(1.75)

  .br-File-name
    flex: 1
    font-size: rem(14px)
    overflow: hidden
    white-space: nowrap

    & > span
      display: inline-block
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap


@media (max-width: rem(550px))
  .br-SidebarList-item
    border-bottom: 0

  .br-SidebarButton-text
    display: none
</style>
