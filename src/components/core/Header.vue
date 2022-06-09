<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'src/store';
// import { useRouter } from 'vue-router';
import SearchBar from 'src/components/core/SearchBar.vue';

export default {
  components: { SearchBar },
  setup() {
    const store = useStore();
    // const router = useRouter();
    const isLoggedIn = computed((): boolean => store.state.account.isLoggedIn);
    const profile = computed(() => store.state.account.profile);
    return {
      profile,
      isLoggedIn,
      logout: () => store.commit('account/setLogout')
      // onClickAccount: async () => {
      //   if (!isLoggedIn.value) await router.push({ name: 'login' });
      // }
    };
  }
};
</script>

<template lang="pug">
q-toolbar.row.q-py-sm.q-px-md.bg-grey-1
  router-link.row.items-center.cursor-pointer(:to='{ name: "home" }')
    img.logo.q-mr-md(src='~assets/legalcoin-full.png')

  .col.row.justify-center
    search-bar.toolbar-select.q-mr-md

  .q-mr-md.q-gutter-x-md.row.items-center.no-wrap(v-if='$q.screen.gt.sm')
    router-link.toolbar-link(:to='{ name: "buy" }')
      | Buy
    router-link.toolbar-link(:to='{ name: "gallery" }')
      | Gallery

  .row.items-center.no-wrap
    q-btn.q-mr-sm(
      v-if='$q.screen.gt.sm && isLoggedIn',
      dense,
      flat,
      round,
      size='md',
      icon='wallet',
      color='grey-6',
      :to='{ name: "wallet" }'
    )
    //- q-btn(v-if="isLoggedIn" @click="logout") Logout
    //- q-btn(v-if="!isLoggedIn" to="login" flat) Login
    //- q-btn(v-if="!isLoggedIn" to="register" outline) Register
    div(v-if='$q.screen.lt.md')
      q-btn(flat, round, v-if='!isLoggedIn', dense, :to='{ name: "login" }')
        q-icon.material-icons-outlined(name='account_circle')
    div(v-if='$q.screen.gt.sm')
      q-btn(dense, outline, v-if='!isLoggedIn', :to='{ name: "login" }')
        q-avatar.q-mr-sm(rounded, size='30px')
          q-icon.material-icons-outlined(name='account_circle')
        .q-mr-sm Sign In
    q-btn(dense, flat, round, size='md', no-wrap, v-if='isLoggedIn')
      // TODO Change avatar when logged in
      q-avatar(rounded, size='30px')
        q-icon.material-icons-outlined(name='account_circle', color='grey-6')
      //- q-icon(name='arrow_drop_down' size='16px')
      q-menu(auto-close, fit)
        q-list(dense)
          q-item(v-if='isLoggedIn')
            q-item-section
              | Signed in as
              strong {{ profile.name }} {{ profile.surname }}
          q-separator(v-if='isLoggedIn')
          // TODO add params for profile, gallery and wallet
          q-item.menu-link(
            clickable,
            :to='{ name: "profile", params: { profile: 1 } }'
          )
            q-item-section Your profile
          q-item.menu-link(clickable, :to='{ name: "gallery" }')
            q-item-section Your gallery
          q-item.menu-link(clickable, :to='{ name: "wallet" }')
            q-item-section Your wallet
          q-item.menu-link(
            clickable,
            :to='{ name: "account-settings", params: { profile: 1 } }'
          )
            q-item-section Settings
          q-separator
          //- q-item.menu-link(clickable)
          //-   q-item-section Help
          //- q-item.menu-link(clickable)
          //-   q-item-section Settings
          //- q-separator
          q-item.menu-link(clickable, v-if='isLoggedIn', @click='logout()')
            q-item-section Sign out
          //- q-item.menu-link(clickable v-if="!isLoggedIn" :to="{name: 'login'}")
          //-   q-item-section Sign in
</template>

<style scoped lang="sass">
.q-btn
  font-size: 20px
.toolbar-select
  flex-basis: 500px
  flex-grow: 0
  flex-shrink: 1
.toolbar-link
  color: black
  text-decoration: none
  font-size: 1.2rem
  &:hover
    opacity: 0.7
    color: $primary
.menu-link:hover
  background: $primary
  color: white
.q-list
  min-width: 150px
.logo
  height:40px
</style>
