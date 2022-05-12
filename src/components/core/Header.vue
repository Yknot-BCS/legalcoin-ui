<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'src/store';

export default {
  setup() {
    const store = useStore();
    return {
      isLoggedIn: computed((): boolean => store.state.account.isLoggedIn),
      signOut: () => store.commit('account/setIsLoggedIn', false),
      signIn: () => store.commit('account/setIsLoggedIn', true)
    };
  }
};
</script>

<template lang="pug">
q-header.text-black( style='background: white')
  q-toolbar.row.q-py-sm.q-px-md
    router-link(to="/").row.items-center.cursor-pointer
      img.HL__logo.q-mr-md(src="~assets/legalcoin-full.png")

    .HL__toolbar-link.q-mx-md.q-gutter-md.text-h5.row.items-center.no-wrap(v-if='$q.screen.gt.sm')
      router-link(to="/buy").text-black(href='javascript:void(0)')
        | Buy
      router-link(to="gallery").text-black(href='javascript:void(0)')
        | Gallery

    q-select.col.HL__toolbar-select(ref='search' :dense='true' :outlined='true' :stack-label='false' label='Search or jump to...' v-model='text' :options='filteredOptions' @filter='filter')
      template(v-slot:append='')
        q-icon.text-weight-bold(name='search' size='18px')

      template(v-slot:no-option='')
        q-item
          q-item-section
            .text-center
              q-spinner-pie(color='primary' size='24px')

      template(v-slot:option='scope')
        q-item.HL__select-HL__menu-link(v-bind='scope.itemProps')
          q-item-section(side='')
            q-icon(name='collections_bookmark')
          q-item-section
            q-item-label(v-html='scope.opt.label')
          q-item-section(side='' :class="{ 'default-type': !scope.opt.type }")
            q-btn.bg-grey-1.q-px-sm(outline='' dense='' no-caps='' text-color='blue-grey-5' size='12px')
              div {{ scope.opt.type || 'Jump to' }}
              q-icon(name='subdirectory_arrow_left' size='14px')
    
    .q-pl-sm.q-gutter-sm.row.items-center.no-wrap
      q-btn(v-if='$q.screen.gt.sm' dense='' flat='' round='' size='md' icon='wallet' color='grey-6')
      div(v-if="isLoggedIn") Peanutbutter
      q-btn(clickable v-if="!isLoggedIn" to="login") Sign in
      //- q-btn(clickable v-if="!isLoggedIn" @click="signIn()") Sign in
      //- q-btn(v-if='$q.screen.gt.sm' dense='' flat='' no-wrap='')
      //-   q-avatar(rounded='' size='30px' )
      //-     q-icon.material-icons-outlined(name='account_circle' color='grey-6')
      //-   q-icon(name='arrow_drop_down' size='16px')
      //-   q-menu(auto-close='')
      //-     q-list(dense='')
      //-       q-item.HL__menu-link-signed-in(v-if="isLoggedIn")
      //-         q-item-section
      //-           div
      //-             | Signed in as 
      //-             strong Peanutbutter
      //-       q-separator
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Your profile
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Your assets
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Your listings
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Your wallet
      //-       q-separator
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Help
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Settings
      //-       q-item.HL__menu-link(clickable v-if="isLoggedIn" @click="signOut()")
      //-         q-item-section Sign out
      //-       q-item.HL__menu-link(clickable v-if="!isLoggedIn" @click="signIn()")
      //-         q-item-section Sign in

      //- q-btn(dense='' flat='')
      //-   .row.items-center.no-wrap
      //-     q-icon(name='more_vert' size='20px')
      //-   q-menu(auto-close='')
      //-     q-list(dense='' style='min-width: 100px')
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Buy
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Sell
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section Marketplace
      //-       q-separator
      //-       q-item.HL__menu-link(clickable)
      //-         q-item-section New listing
</template>

<style scoped lang="sass">
.HL
  &__select-HL__menu-link
    .default-type
      visibility: hidden
    &:hover
      background: $primary
      color: black
      .q-item__section--side
        color: black
      .default-type
        visibility: visible
  &__toolbar-link
    a
      color: black
      text-decoration: none
      &:hover
        opacity: 0.7
        color: $primary
  &__menu-link:hover
    background: $primary
    color: white
  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important
  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9
  &__toolbar-select.q-field--focused
    // width: 450px !important
    border-radius: 10px
    .q-field__append
      display: none
  &__logo
    height:40px
</style>
