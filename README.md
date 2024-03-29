![](./LegalCoin.png "LegalCoin")

![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
---

## Introduction

LegalCoin uses the latest blockchain technologies to create a blockchain solution (on the Telos network) for the legal fraternity to innovatively ‘crowd source’ funding for class action lawsuits. This will assist in modernising the legal profession.

This repository contains the code for the LegalCoin user interface.

## Resources

- Lading page: [legalcoin.com](https://www.legalcoin.com/)
- Development doc: [LegalCoin_Dev](https://docs.google.com/document/d/1CMtxOdxZVTFdVkmJoeiS7LT8zrb9wzaH/edit#)
- Design: [Full Design](https://xd.adobe.com/view/52e702d3-e462-4fdd-a3a5-18119d8eae62-07b4/screen/aa20ae12-c340-47d0-8d7f-9bdec2b98271), [Summary](https://xd.adobe.com/view/3b4ed495-da7e-427c-b140-3a16d8097738-6e1d/)

## Documentation

- [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js)  
- [Vue 2 documentation](https://vuejs.org/v2/api/)  
- [Vue 3 documenation](https://v3.vuejs.org/)  
- [Testing Quasar with Jest](https://github.com/quasarframework/quasar-testing/tree/next/packages/unit-jest)

## Installation

**Install yarn package manager**  
Follow the installation instructions at:
<https://classic.yarnpkg.com/en/>

**Add Quasar CLI package**  

```bash
yarn global add @quasar/cli
```

**Note regarding Node version from [quasar docs](https://quasar.dev/quasar-cli/installation)**  
Do not use uneven versions of Node i.e. 13, 15, etc. These versions are not tested with Quasar and often cause issues due to their experimental nature. We highly recommend always using the LTS version of Node.

**Clone repo**  

```bash
git clone git@github.com:Yknot-BCS/legalcoin-ui.git
```

**Install the dependencies**  

```bash
cd legalcoin-ui && yarn
```

**Restore .env file & check that the correct endpoints are set**  

```bash
cp .env.example .env
```

**Start the app in development mode (hot-code reloading, error reporting, etc.)**

```bash
yarn dev
```

**Run test suite**  

```bash
yarn test
```

**Lint the files**  

```bash
yarn lint
```

**Build the app for production**  

```bash
yarn build
cd dist/spa
quasar serve
```

## Key Contributors

- Development done by Yknot BCS
- Quasar template based on [telosnetwork/open-block-explorer](https://github.com/telosnetwork/open-block-explorer)

test
