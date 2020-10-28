
import { version } from '@apto-payments/pci-sdk-iframe';
export { version } from '@apto-payments/pci-sdk-iframe';

export interface InitOptions {
	auth: IAuthOptions;
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

export interface PCIStyle { }

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
}

let $aptoIframe: Promise<HTMLIFrameElement>;
const CORS_DOMAIN = process.env.NODE_ENV === 'development' ? '*' : `https://apto-pci-sdk-iframe.aptopayments.com`;
const IFRAME_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : `https://apto-pci-sdk-iframe.aptopayments.com/${version}/index.html`;

export function init(initOptions: InitOptions) {
	_checkInitOptions(initOptions);
	$aptoIframe = _initIframe(initOptions.auth, initOptions.element, initOptions.size, initOptions.values, initOptions.theme);
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

function _checkInitOptions(initOptions: InitOptions) {
	if (!initOptions.auth.apiKey) {
		throw new Error('You need to provide an API token to init the PCI SDK');
	}
	if (!initOptions.auth.userToken) {
		throw new Error('You need to provide an user token to init the PCI SDK');
	}
	if (!initOptions.auth.cardId) {
		throw new Error('You need to provide a cardID to init the PCI SDK');
	}
	if (!initOptions.auth.environment) {
		throw new Error('You need to provide an environment to init the PCI SDK');
	}
}

function _initIframe(authOptions: IAuthOptions, pciElement: HTMLElement | null = document.getElementById('apto-pci-sdk'), size?: Size, values?: Values, theme: string = '1'): Promise<HTMLIFrameElement> {
	if (!pciElement) {
		throw new Error('You need to provide an HTML element to init the PCI SDK');
	}
	return new Promise(resolve => {
		pciElement.innerHTML = ''; // Reset content

		const $aptoIframe = document.createElement('iframe');

		window.addEventListener("message", (event) => {
			if (event.origin !== CORS_DOMAIN) {
				return;
			}

			if (event.data === 'apto-iframe-ready') {
				resolve($aptoIframe)
			}

		}, false);

		const params = new URLSearchParams(authOptions as any);

		if (values) {
			Object.keys(values).forEach(key => params.set(key, (values as any)[key]))
		}

		params.set('theme', theme.toString());

		$aptoIframe.setAttribute('src', `${IFRAME_URL}?${params.toString()}`);
		$aptoIframe.setAttribute('frameborder', '0');
		$aptoIframe.setAttribute('height', size?.height || '100%');
		$aptoIframe.setAttribute('width', size?.width || '100%');
		$aptoIframe.setAttribute('data-cy', 'pci-sdk-web');

		pciElement.appendChild($aptoIframe);
	})
}

function _sendMessage(data: object) {
	$aptoIframe.then(frame => {
		const messageEvent = JSON.stringify(data);
		frame.contentWindow?.postMessage(messageEvent, CORS_DOMAIN);
	})
}

export default { init, showPCIData, hidePCIData, setStyle, setTheme, version }
