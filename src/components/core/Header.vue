<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'src/store';
import { mapGetters } from 'vuex';
// import { useRouter } from 'vue-router';
import SearchBar from 'src/components/core/SearchBar.vue';

export default {
  components: { SearchBar },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName'
    })
  },
  setup() {
    const store = useStore();
    // const router = useRouter();
    const isLoggedIn = computed((): boolean => store.state.account.isLoggedIn);
    const profile = computed(() => store.state.account.profile);
    return {
      profile,
      isLoggedIn,
      logout: () => store.commit('account/setLogout'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      clicked: false
      // onClickAccount: async () => {
      //   if (!isLoggedIn.value) await router.push({ name: 'login' });
      // }
    };
  }
};
</script>

<template lang="pug">
q-header.q-mt-xl(elevated) <!-- Remove .q-mt-xl when dev banner removed -->
  q-toolbar.row.q-py-sm.q-px-md.bg-grey-1.vertical-top
    router-link.row.items-center.cursor-pointer(:to='{ name: "home" }')
      img.logo.q-mr-md(
        v-if='$q.screen.gt.sm',
        src='~assets/legalcoin-full.png'
      )
      img.logo-small.q-mr-sm(v-else, src='~assets/legalcoin-full.png')

    .col.row.justify-center
      search-bar.toolbar-select.q-mr-md(size='100', v-if='$q.screen.gt.md')
      search-bar.toolbar-select.q-mr-md(size='50', v-if='$q.screen.md')
      search-bar.toolbar-select.q-mr-md(size='30', v-if='$q.screen.sm')

    .q-mr-md.q-gutter-x-md.row.items-center.no-wrap(v-if='$q.screen.gt.sm')
      q-btn(
        flat,
        icon='grid_view',
        label='Discover',
        dense,
        :to='{ name: "discover" }'
      )
      q-btn(
        flat,
        icon='o_account_circle',
        label='Account',
        v-if='!isLoggedIn',
        dense,
        :to='{ name: "login" }'
      )

    .row.items-center
      search-bar.lt-sm

      q-btn.lt-md(flat, round, dense, :to='{ name: "discover" }')
        q-icon.material-icons-outlined(name='grid_view')

      q-btn(
        flat,
        round,
        dense,
        v-if='!isLoggedIn && $q.screen.lt.md',
        :to='{ name: "login" }'
      )
        q-icon.material-icons-outlined(name='account_circle')
      q-btn(
        dense,
        flat,
        no-wrap,
        :round='$q.screen.lt.sm ? true : false',
        icon='account_circle',
        :label='$q.screen.gt.sm ? `Account` : `` || $q.screen.lt.sm ? `` : ``',
        v-if='isLoggedIn'
      )
        q-menu.menu-edit(auto-close, fit)
          q-list(dense)
            //- Profile
            q-item.menu-link(
              v-if='isLoggedIn',
              clickable,
              :to='{ name: "profile", params: { profile: accountName } }'
            )
              q-item-section.q-pa-sm
                .row.justify-center.items-center
                  .col-shrink.q-pr-xs
                    q-icon(name='account_circle', size='md')
                  .col
                    .text-h6 Profile

            q-separator(v-if='isLoggedIn')
            //- Wallet
            q-item.menu-link(clickable, :to='{ name: "wallet" }')
              q-item-section.q-pa-sm
                .row.justify-center.items-center
                  .col-shrink.q-pr-xs
                    q-icon(name='wallet', size='md')
                  .col
                    .text-h6 Wallet
            q-separator(v-if='isLoggedIn')
            //- Settings
            q-item.menu-link(
              clickable,
              :to='{ name: "account-settings", params: { profile: accountName } }'
            )
              q-item-section.q-pa-sm
                .row.justify-center.items-center
                  .col-shrink.q-pr-xs
                    q-icon(name='settings', size='md')
                  .col
                    .text-h6 Settings
            q-separator(v-if='isLoggedIn')
            q-separator
            //- Logout
            q-item(v-if='isLoggedIn')
              q-item-section.q-pa-md
                q-btn.logout-btn(
                  flat,
                  label='Sign Out',
                  dense,
                  font-size='10px',
                  text-color='white',
                  @click='logout()'
                )
</template>

<style scoped lang="sass">
.q-btn
  font-size: 20px
  color: black
  &:hover
    color: $primary
  &:focus
    color: $primary
.toolbar-select
  flex-basis: 500px
  flex-grow: 0
  flex-shrink: 1
.logo
  height:38px
.logo-small
  height:30px
.logout-btn
  background-color: orange
.menu-edit
  top: 200px
  align: left
</style>
