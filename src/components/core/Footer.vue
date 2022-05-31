<template lang="pug">
.row.footer-background.justify-center.text-center
  .col-lg-1.col-md-2.col-sm-2.col-xs-4.q-pa-md
    a.no-dec(href='') LEGAL
  .col-lg-1.col-md-2.col-sm-2.col-xs-4.q-pa-md
    a.no-dec(href='') PRIVACY
  .col-lg-1.col-md-2.col-sm-2.col-xs-4.q-pa-md
    a.no-dec(href='') REPOSITORY
</template>

<style lang="sass" scoped>
.router-link
  text-decoration: none
  color: $primary
.footer-background
  background: white
  border-top: 1px solid $grey-4
  backdrop-filter: blur(14px)
.no-dec
  text-decoration: none
  color: $primary
</style>
