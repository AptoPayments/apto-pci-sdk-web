# APTO PCI SDK (WEB)
![https://img.shields.io/npm/v/@apto-payments/pci-sdk-web?label=%40apto-payments%2Fpci-sdk-web&style=flat-square](https://img.shields.io/npm/v/@apto-payments/pci-sdk-web?label=%40apto-payments%2Fpci-sdk-web&style=flat-square)
![https://img.shields.io/npm/v/@apto-payments/pci-sdk-iframe?label=%40apto-payments%2Fpci-sdk-iframe&style=flat-square](https://img.shields.io/npm/v/@apto-payments/pci-sdk-iframe?label=%40apto-payments%2Fpci-sdk-iframe&style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/@apto-payments/pci-sdk-web/badge)](https://www.jsdelivr.com/package/npm/@apto-payments/pci-sdk-web)

The PCI SDK allows developers to show protected PCI data through an iframe


## Getting started

### NPM

```
npm i @apto/pci-sdk-web
```

### CDN

> Remember to replace `2.0,0` with the desired version. We follow a [semantic versioning scheme](https://semver.org/)

```html
<script src="https://cdn.jsdelivr.net/npm/@apto-payments/pci-sdk-web@2.0.0/dist/umd/apto-pci-sdk.min.js"></script>
```


## API


### Init(options: OptionsObject)


The `OptionsObject` has the following properties:

- auth
  - userToken: The id of the cardholder
  - cardId: Given unique card identifier
  - apiKey: API Token given by APTO
  - environment: 'sbx' | 'prd';
- theme?: The name of a predefined theme
  - `light`: Use this theme over a dark background. This theme expects the iframe to have a [ID-1 aspect ratio](https://www.iso.org/standard/31432.html).
  - `dark`: Use this theme over a light backgroud. This theme expects the iframe to have a [ID-1 aspect ratio](https://www.iso.org/standard/31432.html)
- element?: HTMLElement into which the iframe will be mounted. By default the PCI SDK will look for an element with the `apto-pci-sdk` id.
- values?
  - lastFour?: Last four digits displayed in the card number when hidden. Default: `••••`
  - labelPan?: Custom text to show as a label for the card number field. Default: `Card number`
  - labelCvv?: Custom text to show as a label for CVV field. Default: `Cvv`
  - labelExp?: Custom text to show as a label for the expiration date field. Default: `Exp` 
  - labelName?: Custom text to show as a label for the name on card field. Default: `Name`
  - nameOnCard?: Custom text to show in the name field. Default: ``


```js
aptoPCI.init({ element, auth, style, values });
```

### setTheme(theme: 'light' | 'dark')

```js
aptoPCI.setTheme('dark');
```

### showPCIData()

```js
aptoPCI.showPCIData();
```

### hidePCIData()

```js
aptoPCI.hidePCIData();
```

### setStyle(style: ITheme)

```js
aptoPCI.setStyle(style);
```


## Building custom themes



### The ITheme object

- We provide a controlled set of elements that can be styled.
- You can use the `extends` property to extend an existing theme.
- Each element can be styled using a [CSS in JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) object. 

```ts
interface ITheme {
	extends?: IThemeName;
	container?: CSSProperties;
	shared?: CSSProperties;
	groups?: CSSProperties;
	groupName?: CSSProperties;
	groupPan?: CSSProperties;
	groupCvv?: CSSProperties;
	groupExp?: CSSProperties;
	labels?: CSSProperties;
	labelName?: CSSProperties;
	labelPan?: CSSProperties;
	labelCvv?: CSSProperties;
	labelExp?: CSSProperties;
	name?: CSSProperties;
	pan?: CSSProperties;
	cvv?: CSSProperties;
	exp?: CSSProperties;
};
```

Example: `light` theme

```ts
{
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignContent: 'flex-end',
		position: 'relative' as 'relative',
		width: '100%',
		height: '100%',
		padding: '4.70vw', //16px'
		color: 'black',
		fontFamily: 'monospace',
		fontSize: '4.7vw', //'16px'
		boxSizing: 'border-box',
		opacity: 1,
	},
	groups: {
		marginTop: '3.53vw' //'12px'
	},
	groupName: {
		order: 2,
		width: '100%',
		textTransform: 'uppercase' as 'uppercase',
	},
	groupPan: {
		order: 1,
		width: '100%',
		marginBottom: '3.53vw' //'12px'
	},
	groupCvv: {
		order: 4,
		display: 'inline-flex',
		alignItems: 'center',
	},
	groupExp: {
		order: 3,
		display: 'inline-flex',
		alignItems: 'center',
		marginRight: '5.88vw', //'20px'
	},
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
