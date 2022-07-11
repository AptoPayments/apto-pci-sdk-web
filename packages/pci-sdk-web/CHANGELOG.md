# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.1.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v4.0.1...v4.1.0) (2022-07-11)

**Note:** Version bump only for package @apto-payments/pci-sdk-web





## [4.0.1](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v4.0.0...v4.0.1) (2021-12-22)


### Bug Fixes

* Use postMessage to pass credentials (1201527824967983) ([#88](https://github.com/AptoPayments/apto-pci-sdk-web/issues/88)) ([50c8ea0](https://github.com/AptoPayments/apto-pci-sdk-web/commit/50c8ea0faacc33cf860b4c9a1d66e897a97b8a09))





# [4.0.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v3.5.1...v4.0.0) (2021-12-15)


### Features

* Allow to customize the form button text (1201439445598518) ([#84](https://github.com/AptoPayments/apto-pci-sdk-web/issues/84)) ([6e910ee](https://github.com/AptoPayments/apto-pci-sdk-web/commit/6e910ee7b5abb7120b982e48678a9225390ccbe2)), closes [#81](https://github.com/AptoPayments/apto-pci-sdk-web/issues/81) [#82](https://github.com/AptoPayments/apto-pci-sdk-web/issues/82)





## 3.5.1 (2021-11-02)


### Bug Fixes

* Add right mime type to svg (ACQ-2335) ([#76](https://github.com/AptoPayments/apto-pci-sdk-web/issues/76)) ([7d80d88](https://github.com/AptoPayments/apto-pci-sdk-web/commit/7d80d889116d3481892dc8a1b0940904a81a944f))





# 3.5.0 (2021-10-29)


### Features

* Add option to easily display card-network (ACQ-2132) ([#72](https://github.com/AptoPayments/apto-pci-sdk-web/issues/72)) ([d898e5f](https://github.com/AptoPayments/apto-pci-sdk-web/commit/d898e5ff8eb49b7503b33bfd0e234754b6a28d7e))





## 3.4.2 (2021-10-19)

**Note:** Version bump only for package @apto-payments/pci-sdk-web





## 3.4.1 (2021-10-19)

**Note:** Version bump only for package @apto-payments/pci-sdk-web





# [3.4.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v3.3.0...v3.4.0) (2021-10-06)


### Bug Fixes

* Update docs URLs ([#64](https://github.com/AptoPayments/apto-pci-sdk-web/issues/64)) ([0dd50f2](https://github.com/AptoPayments/apto-pci-sdk-web/commit/0dd50f2f384d04211b2166121fd4c0e5fc688c10))


### Features

* Allow to set PIN ([#67](https://github.com/AptoPayments/apto-pci-sdk-web/issues/67)) ([3ca33fe](https://github.com/AptoPayments/apto-pci-sdk-web/commit/3ca33fe76420fbe05909d5159e6cb1d0fa8774d2))





# [3.3.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v3.2.0...v3.3.0) (2021-09-07)

**Note:** Version bump only for package @apto-payments/pci-sdk-web





# [3.2.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v3.1.0...v3.2.0) (2021-08-13)

**Note:** Version bump only for package @apto-payments/pci-sdk-web





# [3.1.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v3.0.0...v3.1.0) (2021-08-04)

**Note:** Version bump only for package @apto-payments/pci-sdk-web





# [3.0.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v2.2.1...v3.0.0) (2021-08-03)


### Bug Fixes

* cross-origin iframes usage of window are disabled (ACQ-1663) ([#44](https://github.com/AptoPayments/apto-pci-sdk-web/issues/44)) ([d671232](https://github.com/AptoPayments/apto-pci-sdk-web/commit/d6712327399e321824977408b17bdceb689c2482))


### BREAKING CHANGES

* whatwg disabled the usage of alert and prompt from a cors iframe.  

This change forces us to collect user data (2FA secret) directly from the iframe UI instead of using window.prompt
More info: https://github.com/whatwg/html/issues/5407 

Changes:
- Add an input to collect user data instead using window.prompt
- Display messages over the card instead using window.alert





## [2.2.1](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v2.2.0...v2.2.1) (2021-06-30)


### Bug Fixes

* Internal deps ([d7de49f](https://github.com/AptoPayments/apto-pci-sdk-web/commit/d7de49fb1b7a70f775cfa0e102d648666a8d3d07))





# [2.2.0](https://github.com/AptoPayments/apto-pci-sdk-web/compare/v2.1.0...v2.2.0) (2021-06-30)


### Features

* Add network debugger (ACQ-1361) ([#42](https://github.com/AptoPayments/apto-pci-sdk-web/issues/42)) ([4a73f1a](https://github.com/AptoPayments/apto-pci-sdk-web/commit/4a73f1ab6d83e81034c97f1d9e052c812bb04c65))





# 2.1.0 (2020-11-27)


### Features

* Add getIsDataVisible function (STARGATE-1949) ([#10](https://github.com/AptoPayments/apto-pci-sdk-web/issues/10)) ([e731deb](https://github.com/AptoPayments/apto-pci-sdk-web/commit/e731debeac1db543a163e09eda8dad48e3cc0238))
* provide custom alert and prompt message options to client developers (STARGATE-1732) ([af64f18](https://github.com/AptoPayments/apto-pci-sdk-web/commit/af64f18bc67d1413882cc56faf2629bb51b774ec))
