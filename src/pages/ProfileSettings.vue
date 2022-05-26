<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'Template',
  components: {},
  computed: {
    ...mapGetters({
      account: 'account/account'
    })
  },
  setup() {
    return { hideProfile: ref(false), emailNotifications: ref(false) };
  }
});
</script>

<template lang="pug">
q-page
    q-card
        q-card-section
            | My Account Settings
        q-card-section
            .row.justify-start.items-center.text-grey
                | {{account.profile.name}} {{account.profile.surname}} 
                q-btn(:to="{name: 'editprofile'}" icon="edit" flat outline color='grey-6')
            .col
                router-link(:to="{name: 'profile'}") 
                    | View My Profile
        q-separator
        q-card-section
            .text-bold
                | My Gallery

            | Hide profile
            q-toggle(v-model="hideProfile")
        q-separator
        q-card-section
            .text-bold
                | E-mail notifications

            | Enabled
            q-toggle(v-model="emailNotifications")
        q-separator

            
</template>
