# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
