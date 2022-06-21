<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { requiredRule } from '../../pages/auth/inputRules';
import auth from 'src/auth';

export default defineComponent({
  components: {},
  setup() {
    const SYS = computed(() => process.env.NETWORK_TOKEN);
    const $q = useQuasar();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const updatePasswordForm = ref(null);
    const currentPassword = ref('');
    const newPasswordConfirm = ref('');
    const newPassword = ref('');
    function passwordMatchRule(val: string): string | boolean {
      return val === newPassword.value || 'Passwords do not match';
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updatePasswordForm,
      currentPassword,
      newPassword,
      newPasswordConfirm,
      SYS,
      requiredRule,
      passwordMatchRule,
      onSubmit: async () => {
        try {
          await auth.passwordNew(currentPassword.value, newPassword.value);
          currentPassword.value = '';
          newPassword.value = '';
          newPasswordConfirm.value = '';
          // eslint-disable-next-line
          updatePasswordForm.value.resetValidation();
          $q.notify({
            color: 'positive',
            textColor: 'white',
            message: 'Success'
          });
        } catch (error) {
          if (error instanceof Error) {
            $q.notify({
              color: 'red-4',
              textColor: 'white',
              message: error.message
            });
          }
        }
      }
    };
  }
});
</script>

<template lang="pug">
q-card.q-pa-md
  .text-h5.col-12.text-weight-bold Change Password
  q-form.col-12.row.q-mb-sm.q-gutter-y-lg(
    @submit='onSubmit',
    ref='updatePasswordForm'
  )
    q-input.col-12(
      v-model='currentPassword',
      type='password',
      label='Current Password',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='current-password'
    )
    q-input.col-12(
      v-model='newPassword',
      type='password',
      label='New Password',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='new-password'
    )
    q-input.col-12(
      v-model='newPasswordConfirm',
      type='password',
      label='Retype New Password',
      lazy-rules,
      :rules='[requiredRule, passwordMatchRule]',
      autocomplete='new-password'
    )
    q-btn.col-12(type='submit', color='primary') Change Password
</template>
