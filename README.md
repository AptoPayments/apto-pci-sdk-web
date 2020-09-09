# Apto Web PCI SDK

Welcome to the Apto Web PCI SDK. This SDK provides access to Apto's PCI API, and is designed to be used for web apps. When using this SDK, there is no need for a separate API integration. All the API endpoints are exposed as simple-to-use SDK methods, and the data returned by the API is already encapsulated in the SDK and is easily accessible.

This document provides an overview of how to:

* [Initialize the Web PCI SDK](#initialize-the-web-pci-sdk)
* [Initialize the SDK](#initialize-the-sdk)
* [Customize the UI for the SDK](#customize-the-ui-for-the-sdk)
* [Customize Data Shown to the User](#customize-data-shown-to-the-user)

For more information, see the [Apto Developer Portal](https://developer.aptopayments.com).

To contribute to the SDK development, see [Contributions & Development](#contributions-Development)

## Requirements

* HTML
* JavaScript

### Register a Project and Get API key

You must register a project in the [Apto Developer Portal](https://developer.aptopayments.com) to run the SDK. 

In the developer portal, retrieve your `API_KEY`. Please contact Apto to create a project for you.

## Initialize the Web PCI SDK

To initialize the Web PCI SDK:

* [Include the SDK JavaScript File](#include-the-sdk-javascript-file)
* [Add a Container Element for the UI](#add-a-container-element-for-the-ui)
* [Initialize the SDK](#initialize-the-sdk)

### Include the SDK JavaScript File

The Apto Web PCI SDK is available as single [`apto-pci-sdk.js`](https://pci-web.ux.aptopayments.com/apto-pci-sdk.js) JavaScript file.

Add the SDK to your app by including the file in your app:

```html
<script src="https://pci-web.ux.aptopayments.com/apto-pci-sdk.js"></script>
```

### Add a Container Element for the UI

Add a `div` with the ID `apto-pci-sdk`. This `div` is required to load the SDK content into this element:

```html
<body>
  <div id="apto-pci-sdk"></div>
</body>
```

**Note:** To specify a custom `id` for the `div`, provide the `id` value when calling the [`aptoInitialiseSDK`](#initialize-the-sdk) method.

### Initialize the SDK

Initialize the SDK using the `aptoInitialiseSDK` method. We recommend initializing the SDK after the page is fully loaded:

```html
<script>
  function onLoad() {
    const apiKey = `API_KEY`
    const sessionToken = ''
    const cardId = ''
    const lastFour = ''
    const environment = 'sandbox'
    aptoInitialiseSDK(apiKey, sessionToken, cardId, lastFour, environment, 'apto-pci-sdk', callbackFunction)
  }
</script>
<body onload="onLoad()">
  <div id="apto-pci-sdk"></div>
</body>
```

The `aptoInitialiseSDK` method accepts the following parameters:

Parameter|Description
---|---
`apiKey`|This value is the Mobile API public key found in the [Apto Developer Portal](https://developer.aptopayments.com).
`sessionToken`|This value requires the [Mobile API](https://www.aptopayments.com/refs/MobileAPI.html) or a corporation token using the [Core API](https://www.aptopayments.com/refs/CoreAPI.html). <br><br>Obtain the session token using the login and verification endpoints.
`cardId`|This value requires the [Mobile API](https://www.aptopayments.com/refs/MobileAPI.html). <br><br>Obtain the card ID value using a valid token.
`lastFour`|This value requires the [Mobile API](https://www.aptopayments.com/refs/MobileAPI.html). <br><br>Obtain the last four digits value using a valid token.
`environment`|This value represents the target environment. Values may be `staging`, `sandbox`, or `production`.
*(Optional)* Callback function|If specified, the callback function is invoked once the SDK is initialized. This can be used to [customize the UI for the SDK](#customize-the-ui-for-the-sdk).

## Customize the UI for the SDK

We recommend customizing the UI for the SDK within the callback function of the `aptoInitialiseSDK` method.

```html
<script>
	function callbackFunction() {
		...
	}
</script>
```

The `aptoCustomiseCardAppearance` method accepts two parameters:

Parameter|Description
---|---
A CSS object|A valid CSS object containing one or more of the four customizable elements: <ul><li>`container` - The card background</li><li>`content` - The content elements of the UI, specifically:<ul><li>`pan`</li><li>`cvv` - The CVV value of the card</li><li>`exp` - The expiration date of the card</li></ul></li></ul>
*(Optional)* A configuration object for the card elements|The PCI SDK will show all the elements of the card by default (pan, cvv and expiration date). <br><br>Set the element's show value (`showPan`, `showCvv`, `showExp`) to `true` or `false` to show or hide the element's value.

```html
    aptoCustomiseCardAppearance(styling, config)
```
```html
    const styling = {
      container: 'background: blue; width: 323px; height: 204px; border-radius: 8px;',
      content: {
        pan:
          'color: white; font-family: monospace; position: relative; top: 90px; font-size: 26px; text-align: center; font-weight: 600; text-shadow: 0 1px 1px rgba(43, 45, 53, 0.3);',
        cvv:
          'position: absolute; bottom: 22px; left: 90px; color: white; font-family: monospace; font-size: 16px; text-shadow: 0 1px 1px rgba(43, 45, 53, 0.3);',
        exp:
          'position: absolute; bottom: 22px; left: 22px; color: white; font-family: monospace; font-size: 16px; text-shadow: 0 1px 1px rgba(43, 45, 53, 0.3);'
      }
    }
    const config = {
      showPan: true,
      showCvv: true,
      showExp: true
    }
    aptoCustomiseCardAppearance(styling, config)
    aptoShowCardLastFour()
```

## Customize Data Shown to the User

The UI has three different card states that may be shown to the user:

State|Description
---|---
Hide Card Details|This state hides all the card details. No data is shown to the user, and all data will appear as `****`. This state is invoked with the `aptoHideCardDetails()` method.
Show Card Last Four|This state only shows the last four digits of the card. This state is invoked with the `aptoShowCardLastFour()` method.
Reveal Card Details|This state shows all card data. This state is invoked with the `aptoRevealCardDetails()` method. <br><br>**Note:** We recommend only using this method if the user requests it. For example, with a *Show Card Details* button. 

The following code demonstrates how to trigger each of the three states:

```html
<div>
  <button onclick="javascript:aptoHideCardDetails()">Obfuscate</button>
  <button onclick="javascript:aptoShowCardLastFour()">Show last four</button>
  <button onclick="javascript:aptoRevealCardDetails()">Reveal</button>
</div>
```

## Contributions & Development

We look forward to receiving your feedback, including new feature requests, bug fixes and documentation improvements.

If you would like to help: 

1. Refer to the [issues](https://github.com/AptoPayments/apto-pci-sdk-web/issues) section of the repository first, to ensure your feature or bug doesn't already exist (The request may be ongoing, or newly finished task).
2. If your request is not in the [issues](https://github.com/AptoPayments/apto-pci-sdk-web/issues) section, please feel free to [create one](https://github.com/AptoPayments/apto-pci-sdk-web/issues/new). We'll get back to you as soon as possible.

If you want to help improve the SDK by adding a new feature or bug fix, we'd be happy to receive [pull requests](https://github.com/AptoPayments/apto-pci-sdk-web/compare)!

## License

The Apto Web PCI SDK is available under the MIT license. See the [LICENSE file](LICENSE) for more info.
