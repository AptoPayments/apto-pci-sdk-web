# Apto Web PCI SDK
![https://img.shields.io/npm/v/@apto-payments/pci-sdk-web?label=%40apto-payments%2Fpci-sdk-web&style=flat-square](https://img.shields.io/npm/v/@apto-payments/pci-sdk-web?label=%40apto-payments%2Fpci-sdk-web&style=flat-square)
![https://img.shields.io/npm/v/@apto-payments/pci-sdk-iframe?label=%40apto-payments%2Fpci-sdk-iframe&style=flat-square](https://img.shields.io/npm/v/@apto-payments/pci-sdk-iframe?label=%40apto-payments%2Fpci-sdk-iframe&style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/@apto-payments/pci-sdk-web/badge)](https://www.jsdelivr.com/package/npm/@apto-payments/pci-sdk-web)

The Apto Web PCI SDK enables developers to display protected PCI data using an iFrame.

This document provides an overview of how to:

* [Install the SDK](#user-content-install-the-sdk)
* [Initialize the SDK](#user-content-initialize-the-sdk)
* [Show / Hide the PCI Data](#user-content-show--hide-the-pci-data)
* [Customize the PCI View](#user-content-customize-the-pci-view)

For more information, see the [Apto Developer Guides](http://docs.aptopayments.com).

To contribute to the SDK development, see [Contributions & Development](#user-content-contributions--development)

## Requirements

* HTML
* JavaScript
* CSS - Optional, but required for custom styling.

### Get the Mobile API key

A Mobile API Key is required to run the SDK. To retrieve your Mobile API Key:

1. Register for an account or login into the [Apto Developer Portal](https://developer.aptopayments.com). 
    
2. Select **Developers** from the menu. Your **Mobile API Key** is listed on this page.

    ![Mobile API Key](readme_images/devPortal_mobileApiKey.jpg)

    **Note:** `MOBILE_API_KEY` is used throughout this document to represent your Mobile API key. Ensure you replace `MOBILE_API_KEY` with the Mobile API Key in your account.

## Install the SDK

There are two methods for installing the Web PCI SDK:

* [Install using NPM](#user-content-install-using-npm)
* [Install using CDN](#user-content-install-using-cdn)

### Install using NPM

To install the SDK using NPM, open your terminal application and install the SDK using the following command:

```
npm i @apto/pci-sdk-web
```

### Install using CDN

To install the SDK using CDN, include the following script in your HTML file.

```html
<script src="https://cdn.jsdelivr.net/npm/@apto-payments/pci-sdk-web@VERSION_NUMBER/dist/umd/apto-pci-sdk.min.js"></script>
```

Ensure you replace `VERSION_NUMBER` with the SDK version you'd like to use. The current version available is listed [at the top of this document](#user-content-apto-web-pci-sdk). For example version `2.0.0`.

```html
<script src="https://cdn.jsdelivr.net/npm/@apto-payments/pci-sdk-web@2.0.0/dist/umd/apto-pci-sdk.min.js"></script>
```


**Note:** We use a [semantic versioning scheme](https://semver.org/) for the Web PCI SDK.

## Initialize the SDK

To initialize the SDK:

1. Create an HTML element to contain the PCI SDK iFrame. Ensure you specify your custom element ID. For example:

```html
<div id="apto-pci-sdk"></div>
```

**Note:** The element's ID will be used in the next step, to pass into the SDK. Use the `apto-pci-sdk` id for your element to avoid specifying the optional `element` property in the `OptionsObject`.

2. Create  an `OptionsObject`. See [OptionsObject Properties](#user-content-optionsobject-properties) for more info.

	Ensure you replace the following with the appropriate values:
	
	* `YOUR_TOKEN`
	* `UNIQUE_CARD_ID`
	* `MOBILE_API_KEY`
	* `apto-pci-sdk` (**Optional:** Only required if using a custom element ID)

```javascript
var options = {
  auth: {
    userToken: 'YOUR_TOKEN',
    cardId: 'UNIQUE_CARD_ID',
    apiKey: 'MOBILE_API_KEY',
    environment: 'sbx',			// Accepted values: 'sbx' | 'prd'
  },
  theme: 'light',			// (Optional) Accepted values: 'light' | 'dark'
  element: document.getElementById('apto-pci-sdk'),	// (Optional) Default id: 'apto-pci-sdk'
  values: {		// (Optional)
    lastFour: '****',			// (Optional) Default: '****'
    labelPan: 'Card Number',		// (Optional) Default: 'Card number'
    labelCvv: 'CVV',			// (Optional) Default: 'Cvv'
    labelExp: 'Exp Date',		// (Optional) Default: 'Exp'
    labelName: 'Full Name',		// (Optional) Default: 'Name'
    nameOnCard: 'Jane Doe',		// (Optional) Default: ''
  },
}
```

3. Invoke the `AptoPCISdk.init` method and pass in the `options` object:

```javascript
AptoPCISdk.init(options);
```

### OptionsObject Properties

The `OptionsObject` has the following properties:

Property Name|Description
---|---
`auth`|The authentication object containing the following properties:<ul><li>`userToken`: The cardholder id</li><li>`cardId`: ID for the card</li><li>`apiKey`: The `MOBILE_API_KEY` provided by Apto. See [Get the Mobile API key](#user-content-get-the-mobile-api-key) for more info.</li><li>`environment`: The deployment environment. The values can be:<ul><li>`sbx` (Sandbox)</li><li>`prd` (Production)</li></ul></li></ul>
`theme` (Optional)|The name of a predefined theme. The values can be:<ul><li>`light`: This theme is best used over a dark background.<br/></li><li>`dark`: This theme is best used over a light background.</li></ul>**Note:** Both themes expect the iFrame to have an [ID-1 aspect ratio](https://www.iso.org/standard/31432.html).
`element` (Optional)|The HTML element for mounting the iFrame. If `element` is not specified, the PCI SDK will attempt to mount the iFrame to an element with the id `apto-pci-sdk`.
`values` (Optional)|The object defining the text information on the card. This object can have the following properties:<ul><li>`lastFour` (Optional): String value used as placeholders for the last 4 digits of the card when hidden. The default value is: `••••`</li><li>`labelPan` (Optional): String value specifying the text for the PAN (Primary Account Number) description label. The default value is `Card number`.</li><li>`labelCvv` (Optional): String value specifying the text for the CVV description label. The default value is `Cvv`.</li><li>`labelExp` (Optional): String value specifying the text for the expiration date description label. The default value is `Exp`.</li><li>`labelName` (Optional): String value specifying the text for the name description label. The default value is `Name`.</li><li>`nameOnCard` (Optional): String value specifying the name displayed on the card. The default value is an empty string.</li></ul>

## Show / Hide the PCI Data

The PCI data can be displayed or hidden. 

To show the complete card data, use the `showPCIData` method:

```JavaScript
AptoPCISdk.showPCIData();
```

**Note:** If the client is not PCI-compliant, an SMS / email message will be sent to the user with a one-time code. This code must be entered into the dialog display. If the code entered is correct, the PCI data will be displayed.

To hide the card data, use the `hidePCIData` method:

```JavaScript
AptoPCISdk.hidePCIData();
```

## Customize the PCI View

The PCI View can be customized with a [theme](#user-content-set-the-theme) and/or [custom style](#user-content-apply-a-custom-style).

### Set the Theme

To set the PCI theme to a `light` or `dark` theme, use the `setTheme` method:

```JavaScript
AptoPCISdk.setTheme('dark');
```

The `light` theme is best used against dark backgrounds, and the `dark` theme is best used against light backgrounds.

### Apply a Custom Style

To apply custom style settings to the PCI View, use the `setStyle` method.

1. Create an ITheme object. See [ITheme object](#user-content-itheme-object) for more detailed info about elements that can be styled.

```ts
{
	labels: {
		display: 'none',
		color: '#444',
		fontSize: '3.53vw', //'12px',
		textTransform: 'uppercase' as 'uppercase',
	},
	labelCvv: {
		display: 'initial',
		marginRight: '2.94vw', //'10px',
	},
	labelExp: {
		display: 'initial',
		marginRight: '2.94vw', //'10px',
	},
	pan: {
		fontSize: '7.06vw', //24px
	},
};
```

2. Pass the `style` parameter into `setStyle`:

```JavaScript
AptoPCISdk.setStyle(style);
```


### ITheme Object

The ITheme object contains a set of controlled set of elements to that can be styled. Each element can be styled using a [CSS in JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) object.

**Note:** All the ITheme properties are optional.

Property|Object Type|Description
---|---|---
`extends`|`IThemeName`|Use this to specify an existing theme to extend. Available values are `light` or `dark`.
`container`|`CSSProperties`|Use this to style the PCI container.
`shared`|`CSSProperties`|Use this to style the overall data area.
`groups`|`CSSProperties`|Use this to style the area surrounding the name, PAN, CVV, and expiration data.
`groupName`|`CSSProperties`|Use this to style the area surrounding the name.
`groupPan`|`CSSProperties`|Use this to style the area surrounding the PAN.
`groupCvv`|`CSSProperties`|Use this to style the area surrounding the CVV.
`groupExp`|`CSSProperties`|Use this to style the area surrounding the expiration date.
`labels`|`CSSProperties`|Use this to style the labels for name, PAN, CVV, and expiration date.
`labelName`|`CSSProperties`|Use this to style the name label.
`labelPan`|`CSSProperties`|Use this to style the PAN label.
`labelCvv`|`CSSProperties`|Use this to style the CVV label.
`labelExp`|`CSSProperties`|Use this to style the expiration date label.
`name`|`CSSProperties`|Use this to style the cardholder's name.
`pan`|`CSSProperties`|Use this to style the PAN text.
`cvv`|`CSSProperties`|Use this to style the CVV text.
`exp`|`CSSProperties`|Use this to style the expiration date.

## Contributions & Development

We look forward to receiving your feedback, including new feature requests, bug fixes and documentation improvements.

If you would like to help: 

1. Refer to the [issues](https://github.com/AptoPayments/apto-pci-sdk-web/issues) section of the repository first, to ensure your feature or bug doesn't already exist (The request may be ongoing, or newly finished task).
2. If your request is not in the [issues](https://github.com/AptoPayments/apto-pci-sdk-web/issues) section, please feel free to [create one](https://github.com/AptoPayments/apto-pci-sdk-web/new). We'll get back to you as soon as possible.

If you want to help improve the SDK by adding a new feature or bug fix, we'd be happy to receive [pull requests](https://github.com/AptoPayments/apto-pci-sdk-web/compare)!
