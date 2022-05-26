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
        q-card(class="bg-grey-4")
            q-card-section
                | Edit My Profile
            q-card-section.row.fit.items-center.content-center
                //- TODO handle file upload
                q-avatar(icon="fa-solid fa-circle-user" size="8rem")
            q-card-section
                //- Name and surname input boxes next to each other
                .row.justify-between.items-center
                    .col-6
                        q-input.col(
                            outlined
                            label="Name"
                            placeholder="Name"
                            v-model="name"
                            bg-color="white"
                        ).q-pr-sm
                    .col-6
                        q-input.col(
                            outlined
                            label="Surname"
                            placeholder="Surname"
                            v-model="surname"
                            bg-color="white"
                        ).q-pl-sm
                q-input(
                            outlined
                            label="Subtitle"
                            placeholder="Subtitle"
                            v-model="subtitle"
                            bg-color="white"
                            counter 
                            maxlength="30"
                        ).q-mt-sm
                q-input(
                            outlined
                            label="Bio"
                            placeholder="Bio"
                            v-model="bio"
                            bg-color="white"
                            counter 
                            maxlength="140"
                            type="textarea"
                        ).q-mt-sm
        //- Add save button in the middel
        q-card-section
            .row.justify-center.items-center
                q-btn(
                    @click="saveProfile"
                    color="primary"
                    label="Save"
                )

</template>
