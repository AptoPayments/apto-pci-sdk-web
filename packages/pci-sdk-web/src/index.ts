import { version } from '@apto-payments/pci-sdk-iframe';

export interface InitOptions {
	auth: IAuthOptions;
	/**
	 * When enabled a debugger console will be displayed in the iframe
	 */
	debug?: boolean;
	element?: HTMLElement;
	size?: Size;
	theme?: string;
	values?: Values;
}

export interface IAuthOptions {
	cardId: string;
	apiKey: string;
	userToken: string;
	environment: 'stg' | 'sbx' | 'prd';
}

export interface PCIStyle {} // eslint-disable-line

export interface Size {
	width: string;
	height: string;
}

export interface Values {
	labelName?: string;
	labelPan?: string;
	labelCvv?: string;
	labelExp?: string;
	lastFour?: string;
	nameOnCard?: string;
	expiredMessage?: string;
	tooManyAttemptsMessage?: string;
	enter2FAPrompt?: string;
	failed2FAPrompt?: string;
}

let $aptoIframe: Promise<HTMLIFrameElement>;
const ALLOWED_CORS_DOMAIN =
	process.env.NODE_ENV === 'development'
		? '*'
		: 'https://apto-pci-sdk-iframe.aptopayments.com';

const IFRAME_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:3000/'
		: `https://apto-pci-sdk-iframe.aptopayments.com/${version}/index.html`;

export function init(initOptions: InitOptions) {
	_checkInitOptions(initOptions);
	$aptoIframe = _initIframe(
		initOptions.auth,
		initOptions.element,
		initOptions.size,
		initOptions.values,
		initOptions.theme,
		initOptions.debug
	);
	return $aptoIframe;
}

export function showPCIData() {
	_sendMessage({ type: 'showCardData' });
}

export function hidePCIData() {
	_sendMessage({ type: 'hideCardData' });
}

export function setStyle(style: PCIStyle) {
	_sendMessage({ type: 'setStyle', style });
}

export function setTheme(theme: string) {
	_sendMessage({ type: 'setTheme', theme });
}

export function getIsDataVisible(): Promise<boolean> {
	return new Promise((resolve) => {
		window.addEventListener(
			'message',
			function onVisibilityChanged(event) {
				if (
					ALLOWED_CORS_DOMAIN !== '*' &&
					event.origin !== ALLOWED_CORS_DOMAIN
				) {
					return;
				}

				const message = JSON.parse(event.data);

				if (message.type === 'apto-iframe-visibility-change') {
					// Self remove listener once resolved
					window.removeEventListener('message', onVisibilityChanged);
					resolve(JSON.parse(message.payload.isVisible));
				}
			},
			false
		);

		_sendMessage({ type: 'isDataVisible' });
	});
}

function _checkInitOptions(initOptions: InitOptions) {
	if (!initOptions) {
		throw new Error(
			'Cannot call .init() with no options. At least auth parameters are required: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web#initialize-the-sdk'
		);
	}
	if (!initOptions.auth.apiKey) {
		throw new Error(
			'You need to provide the mobile API key init the PCI SDK: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web/#get-the-mobile-api-key'
		);
	}
	if (!initOptions.auth.userToken) {
		throw new Error(
			'You need to provide an user token to init the PCI SDK: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web/#optionsobject-properties'
		);
	}
	if (!initOptions.auth.cardId) {
		throw new Error(
			'You need to provide a cardID to init the PCI SDK: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web/#optionsobject-properties'
		);
	}
	if (!initOptions.auth.environment) {
		throw new Error(
			'You need to provide an environment to init the PCI SDK. Try "sbx" if you are testing: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web/#optionsobject-properties'
		);
	}
}

function _initIframe(
	authOptions: IAuthOptions,
	pciElement: HTMLElement | null = document.getElementById('apto-pci-sdk'),
	size?: Size,
	values?: Values,
	theme = '1',
	debug?: boolean
): Promise<HTMLIFrameElement> {
	if (!pciElement) {
		throw new Error('You need to provide an HTML element to init the PCI SDK');
	}
	return new Promise((resolve) => {
		pciElement.innerHTML = ''; // Reset content

		const $aptoIframe = document.createElement('iframe');

		window.addEventListener(
			'message',
			(event) => {
				if (
					ALLOWED_CORS_DOMAIN !== '*' &&
					event.origin !== ALLOWED_CORS_DOMAIN
				) {
					return;
				}

				const message = JSON.parse(event.data);

				if (message.type === 'apto-iframe-ready') {
					resolve($aptoIframe);
				}
			},
			false
		);

		const params = new URLSearchParams(authOptions as any);

		if (values) {
			Object.keys(values).forEach((key) =>
				params.set(key, (values as any)[key])
			);
		}

		params.set('theme', theme.toString());

		if (debug) {
			params.set('debug', 'true');
		}

		$aptoIframe.setAttribute('src', `${IFRAME_URL}?${params.toString()}`);
		$aptoIframe.setAttribute('frameborder', '0');
		$aptoIframe.setAttribute('height', size?.height || '100%');
		$aptoIframe.setAttribute('width', size?.width || '100%');
		$aptoIframe.setAttribute('data-cy', 'pci-sdk-web');

		pciElement.appendChild($aptoIframe);
	});
}

function _sendMessage(data: { type: string; theme?: any; style?: any }) {
	if (!$aptoIframe) {
		return console.error(
			`Cannot execute "${data.type}". It looks like the SDK is not initialized, run AptoPCISdk.init() first`
		);
	}
	return $aptoIframe.then((frame) => {
		const messageEvent = JSON.stringify(data);
		frame.contentWindow?.postMessage(messageEvent, ALLOWED_CORS_DOMAIN);
	});
}

// This is required!
export { version } from '@apto-payments/pci-sdk-iframe';

export default {
	init,
	showPCIData,
	hidePCIData,
	setStyle,
	setTheme,
	getIsDataVisible,
	version,
};
