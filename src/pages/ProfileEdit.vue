<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ProfileEdit',
  components: {},
  setup() {
    return {
      name: ref(''),
      surname: ref(''),
      subtitle: ref(''),
      bio: ref('')
    };
  },
  methods: {
    saveProfile() {
      // save profile
      console.log('save profile');
    }
  }
});
</script>

<template lang="pug">
q-page
  q-card
    q-card.bg-grey-4
      q-card-section.text-subtitle1
        | Edit My Profile
      q-card-section.row.fit.items-center.content-center.justify-center
        //- TODO handle file upload
        q-avatar(size='4rem')
          img(src='~/assets/Account_Icon.svg')
      q-card-section
        //- Name and surname input boxes next to each other
        .row.justify-between.items-center
          .col-6
            q-input.col.q-pr-sm(
              outlined,
              label='Name',
              placeholder='Name',
              v-model='name',
              bg-color='white'
            )
          .col-6
            q-input.col.q-pl-sm(
              outlined,
              label='Surname',
              placeholder='Surname',
              v-model='surname',
              bg-color='white'
            )
        q-input.q-mt-sm(
          outlined,
          label='Subtitle',
          placeholder='Subtitle',
          v-model='subtitle',
          bg-color='white',
          counter,
          maxlength='30'
        )
        q-input.q-mt-sm(
          outlined,
          label='Bio',
          placeholder='Bio',
          v-model='bio',
          bg-color='white',
          counter,
          maxlength='140',
          type='textarea'
        )
    //- Add save button in the middel
    q-card-section
      .row.justify-center.items-center
        q-btn(@click='saveProfile', color='primary', label='Save')
</template>
