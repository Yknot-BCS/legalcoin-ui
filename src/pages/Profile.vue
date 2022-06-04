<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'Profile',
  components: {},
  setup() {
    const route = useRoute();
    const profileId = computed(() => route.params.profile);
    return { profileId, nftCount: ref(0), projectCount: ref(0) };
  },
  computed: {
    ...mapGetters({
      account: 'account/account'
    })
  }
});
</script>

<template lang="pug">
q-page.row.justify-center
  q-card
    q-card
      q-card-section.row.fit.items-center.content-center.justify-center
        .text-bold
          | MY PROFILE
      q-separator.q-mx-md
      q-card-section
        //- Avatar and name
        q-card-section.fit.column.wrap.justify-center.items-center.content-center
          q-avatar(size='4rem')
            img(src='~/assets/Account_Icon.svg')
          .col.q-mt-sm
            .col.text-bold
              | {{ account.profile.name }} {{ account.profile.surname }}
          //- Bio section
          q-card-section
            | Hi this is a very cool bio and everyone is going to like me because I am cool.
        //- NFT, project and followers section
        q-card-section.row.justify-center.content-center.items-center
          .column.justify-center.content-center.items-center.info-block
            .col.text-subtitle1
              | {{ nftCount }}
            .col.text-subtitle1
              | NFTS
          q-separator.q-mx-md(vertical, color='black')
          .column.justify-center.content-center.items-center.info-block
            .col.text-subtitle1
              | {{ projectCount }}
            .col.text-subtitle1
              | PROJECTS

    q-card.bg-grey-3 
      //- Gallery section            
      q-card-section
        .column.items-center.justify-center.content-center
          .text-bold
            | MY GALLERY
          q-btn(:to='{ name: "gallery" }', flat, outline)
            .text-italic
              | Go to Gallery

          //- User's NFTs
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
.profile-card
    width: 100%
    max-width: 30rem
</style>
