<template lang="pug">
.top
  img.q-mr-md(src='~assets/legalcoin-dark.png', height='64')
  img(src='~assets/yknot-dark.png', height='64')
.bot
  .row.justify-center.container
    .col-12.col-md-3.section
      h4 Contact Us
      p.sub-heading Location:
      p.text-grey-6
        | Floor 2
        br
        | 9 Portland Street
        br
        | Manchester
        br
        | M1 3BE
      p.sub-heading Email:
      p.text-grey-6
        | web@legalcoin.co.uk
      p.sub-heading Mobile:
      p.text-grey-6
        | (+44) 0161 710 0071
    .col-12.col-md-3.section
      h4 About Us
      p.text-grey-6
        | Legalcoin is working to bring the legal industry into the digital world. We allow you access to the justice you deserve. Play a role in bringing large conglomorates to justice.
    .col-12.col-md-3.section
      h4 Our Community
      <q-btn class="q-mr-sm" round color="primary" icon="all_inbox" />
      <q-btn class="q-mr-sm" round color="primary" icon="all_inbox" />
      <q-btn class="q-mr-sm" round color="primary" icon="whatsapp" />
      <q-btn class="q-mr-sm" round color="primary" icon="all_inbox" />
      <q-btn class="q-mr-sm" round color="primary" icon="all_inbox" />
  p.text-grey-6.q-mt-lg
    | © 2021 - {{ new Date().getFullYear() }} Legalcoin. All Rights Reserved
</template>

<style lang="sass" scoped>
.sub-heading
  font-weight: 400
  font-size: 1.25rem
  margin-bottom: 0.25rem
.container
  flex
.section
  text-align: left
.top
  padding-top: 1rem
  padding-bottom: 1rem
  background: #282A36
  text-align: center
.bot
  text-align: center
  background: #14151C
  padding: 1rem
  padding-top: 2rem
  padding-bottom: 5rem

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
