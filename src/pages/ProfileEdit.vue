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
q-page.fit.row.wrap.justify-center
  q-card.edit-card
    q-card.bg-white.q-mb-lg
      q-card-section.text-subtitle1
        | Edit My Profile
      q-card-section.row.fit.content-center
        //- TODO handle file upload
        q-avatar(size='4rem')
          img(src='~/assets/Account_Icon.svg')
        h4.text-subtitle2.q-ml-md
          | Upload File
      q-card-section
        //- Name and surname input boxes next to each other
        .row.justify-between.items-center
          .col-6
            q-input.col.q-pr-sm(
              label='Name',
              placeholder='Name',
              v-model='name',
              bg-color='white'
            )
          .col-6
            q-input.col.q-pl-sm(
              label='Surname',
              placeholder='Surname',
              v-model='surname',
              bg-color='white'
            )
        q-input.q-mt-sm(
          label='Subtitle',
          placeholder='Subtitle',
          v-model='subtitle',
          bg-color='white',
          counter,
          maxlength='30'
        )
        q-input.q-mt-sm(
          label='Bio',
          placeholder='Bio',
          v-model='bio',
          bg-color='white',
          counter,
          dense,
          rows='5',
          maxlength='140',
          type='textarea'
        )
    //- Add save button in the middel
    q-card-section
      .row.justify-center.items-center
        q-btn(@click='saveProfile', flat, label='Save', border='none')
</template>

<style lang="sass" scoped>
.edit-card
  width: 100%
  max-width: 30rem
  height: 100%
  max-height: 35rem

.text-subtitle2
  color: gray

.text-subtitle1
  font-size: 25px
</style>
