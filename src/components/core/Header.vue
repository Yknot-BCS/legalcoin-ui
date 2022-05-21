<script lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'src/store';
// import { useRouter } from 'vue-router';
import SearchBar from 'src/components/core/SearchBar';

export default {
  components: { SearchBar },
  setup() {
    const store = useStore();
    // const router = useRouter();
    const isAuthenticated = computed(
      (): boolean => store.state.account.isAuthenticated
    );
    return {
      isAuthenticated,
      logout: () => store.commit('account/setLogout')
      // onClickAccount: async () => {
      //   if (!isAuthenticated.value) await router.push({ name: 'login' });
      // }
    };
  }
};
</script>

<template lang="pug">
q-toolbar.row.q-py-sm.q-px-md
  router-link(:to="{name: 'home'}").row.items-center.cursor-pointer
    img.logo.q-mr-md(src="~assets/legalcoin-full.png")

  .col.row.justify-center
    search-bar.toolbar-select.q-mr-md

  .q-mr-md.q-gutter-x-md.row.items-center.no-wrap(v-if='$q.screen.gt.sm')
    router-link(:to="{name: 'buy'}").toolbar-link
      | Buy
    router-link(:to="{name: 'gallery'}").toolbar-link
      | Gallery

  .row.items-center.no-wrap
    q-btn.q-mr-sm(v-if='$q.screen.gt.sm && isAuthenticated' dense flat round size='md' icon='wallet' color='grey-6' :to="{name: 'wallet'}" )
    //- q-btn(v-if="isAuthenticated" @click="logout") Logout
    //- q-btn(v-if="!isAuthenticated" to="login" flat) Login
    //- q-btn(v-if="!isAuthenticated" to="register" outline) Register
    q-btn(dense outline v-if="!isAuthenticated" :to="{name: 'login'}"  )
      q-avatar.q-mr-sm(rounded size='30px')
        q-icon.material-icons-outlined(name='account_circle')
      .q-mr-sm Sign In
    q-btn(dense flat round size='md' no-wrap v-if="isAuthenticated")
      // TODO Change avatar when logged in
      q-avatar(rounded size='30px')
        q-icon.material-icons-outlined(name='account_circle' color='grey-6')
      //- q-icon(name='arrow_drop_down' size='16px')
      q-menu(auto-close)
        q-list(dense)
          q-item(v-if="isAuthenticated")
            q-item-section
              | Signed in as 
              strong Peanutbutter
          q-separator(v-if="isAuthenticated")
          // TODO add params for profile, gallery and wallet
          q-item.menu-link(clickable :to="{name: 'profile'}")
            q-item-section Your profile
          q-item.menu-link(clickable :to="{name: 'gallery'}")
            q-item-section Your gallery
          q-item.menu-link(clickable :to="{name: 'wallet'}")
            q-item-section Your wallet
          q-separator
          //- q-item.menu-link(clickable)
          //-   q-item-section Help
          //- q-item.menu-link(clickable)
          //-   q-item-section Settings
          //- q-separator
          q-item.menu-link(clickable v-if="isAuthenticated" @click="logout()")
            q-item-section Sign out
          //- q-item.menu-link(clickable v-if="!isAuthenticated" :to="{name: 'login'}")
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
.logo
  height:40px
</style>
