<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'src/store';
// import { useRouter } from 'vue-router';

export default {
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

  q-select.toolbar-select.q-mr-md.col(ref='search' dense outlined :stack-label='false' label='Search or jump to...' v-model='text' :options='filteredOptions' @filter='filter')
    template(v-slot:append)
      q-icon.text-weight-bold(name='search' size='18px')

    template(v-slot:no-option)
      q-item
        q-item-section
          .text-center
            q-spinner-pie(color='primary' size='24px')

    template(v-slot:option='scope')
      q-item(v-bind='scope.itemProps')
        q-item-section(side)
          q-icon(name='collections_bookmark')
        q-item-section
          q-item-label(v-html='scope.opt.label')
        q-item-section(side :class="{ 'default-type': !scope.opt.type }")
          q-btn.bg-grey-1.q-px-sm(outline dense no-caps text-color='blue-grey-5' size='12px')
            div {{ scope.opt.type || 'Jump to' }}
            q-icon(name='subdirectory_arrow_left' size='14px')
  
  
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
.toolbar-link
  color: black
  text-decoration: none
  font-size: 1.2rem
  &:hover
    opacity: 0.7
    color: $primary
.toolbar-select.q-field--focused
  border-radius: 10px
  .q-field__append
    display: none
.menu-link:hover
  background: $primary
  color: white
.logo
  height:40px
</style>
