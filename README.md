# AptoWebPCISDK

## Using the Web PCI SDK

AptoWebPCISDK is available as single file to be included in your javascript code

```html
<script src="https://pci-web.ux.aptopayments.com/apto-pci-sdk.js"></script>
```

and requires a `div` to load its content into it:

```html
<div id="apto-pci-sdk"></div>
```

you can use the `id` that you prefer as long as you provide the right value when calling the `aptoInitialiseSDK` method.

## Initialising the SDK

We recommend initialising the SDK once the page where it will be shown has finished loading:

```html
<script>
  function onLoad() {
    const apiKey = ''
    const sessionToken = ''
    const cardId = ''
    const lastFour = ''
    const environment = 'production'
    aptoInitialiseSDK(apiKey, sessionToken, cardId, lastFour, environment, 'apto-pci-sdk', callbackFunction)
  }
</script>
<body onload="onLoad()">
  <div id="apto-pci-sdk"></div>
</body>
```

this call accepts a callback function that will be invoked once the SDK has been initialised.

### SDK initialisation parameters

The SDK initialisation function requires the following parameters:

- `apiKey`: it is the Mobile API public key shared with you.
- `sessionToken`: must be obtained using the login and verification endpoints in the [Mobile API](https://www.aptopayments.com/refs/MobileAPI.html) or a corporation token using the [Core API](https://www.aptopayments.com/refs/CoreAPI.html).
- `cardId`: must be obtained from the [Mobile API](https://www.aptopayments.com/refs/MobileAPI.html) using a valid token.
- `lastFour`: must be obtained from the [Mobile API](https://www.aptopayments.com/refs/MobileAPI.html) using a valid token.
- `environment`: the target environment one of: staging, sandbox or production.

## Customising the SDK

### Look & feel

The callback of the `aptoInitialiseSDK` is the right place to makeup the UI:

```html
<script>
  function callbackFunction() {
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
    aptoCustomiseCardAppearance(styling)
    aptoShowCardLastFour()
  }
</script>
```

The `aptoCustomiseCardAppearance` method accepts a valid CSS for the four customisable elements: card background (container), pan, cvv and expiration date (exp).

### Elements shown

By default the PCI SDK will show all the element of the card, pan, cvv and expiration date, but the elements to show can also be customised:

```html
<script>
  function callbackFunction() {
    const styling = {...}
    const config = {
      showPan: true,
      showCvv: true,
      showExp: true
    }
    aptoCustomiseCardAppearance(styling, config)
  }
</script>
```

## Customising the data shown to the user

There are three different _states_ to show to the user:

1. No data is shown to the user, only `****`.
2. Only the last four digits are shown to the user.
3. All card data is shown. We recommend to **only do this as per user request**, like click a button.

In the following snippet you can see three buttons used to trigger the different states:

```html
<div>
  <button onclick="javascript:aptoHideCardDetails()">Obfuscate</button>
  <button onclick="javascript:aptoShowCardLastFour()">Show last four</button>
  <button onclick="javascript:aptoRevealCardDetails()">Reveal</button>
</div>
```

## License

AptoPCISDK is available under the MIT license. See the LICENSE file for more info.
