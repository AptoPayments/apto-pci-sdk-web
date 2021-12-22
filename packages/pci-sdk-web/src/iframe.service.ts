import { IAuthOptions, INetworkLogo, Size, Values } from './index';
import IThemeName from './types/IThemeName';

interface IInitIframeArgs {
	allowedEventOrigin: string;
	auth: IAuthOptions;
	debug?: boolean;
	networkLogo?: INetworkLogo;
	element?: HTMLElement;
	size?: Size;
	theme?: IThemeName;
	url: string;
	values?: Values;
}

export async function initIframe(
	args: IInitIframeArgs
): Promise<HTMLIFrameElement> {
	const pciElement = args.element || document.getElementById('apto-pci-sdk');

	if (!pciElement) {
		throw new Error('You need to provide an HTML element to init the PCI SDK');
	}

	const iframeLoadedPromise = _waitForEvent({
		allowedEventOrigin: args.allowedEventOrigin,
		eventType: 'apto-iframe-ready',
	});

	const iframeStartedPromise = _waitForEvent({
		allowedEventOrigin: args.allowedEventOrigin,
		eventType: 'apto-iframe-auth-ready',
	});

	// Reset content
	pciElement.innerHTML = '';
	// Create the iframe
	const $aptoIframe = _createIframe(args);
	// Append child to the DOM
	pciElement.appendChild($aptoIframe);
	// Wait for the iframe to be loaded
	await iframeLoadedPromise;
	// Send auth data via postMessage
	const messageEvent = JSON.stringify({
		type: 'setAuth',
		userToken: args.auth.userToken,
		apiKey: args.auth.apiKey,
	});
	$aptoIframe.contentWindow?.postMessage(messageEvent, args.allowedEventOrigin);
	// Wait for the iframe auth to be started
	await iframeStartedPromise;
	// If we are here, the iframe is loaded and was started.
	return $aptoIframe;
}

interface IWaitForEventArgs {
	allowedEventOrigin: string;
	eventType: string;
}

/**
 * Promise that is resolved when the right event type comes from the window with the allowed CORS domain.
 */
function _waitForEvent(args: IWaitForEventArgs): Promise<void> {
	return new Promise<void>((resolve) => {
		window.addEventListener('message', _onMessage, false);

		function _onMessage(event: MessageEvent) {
			if (
				!_isMessageAllowed({
					event,
					allowedEventOrigin: args.allowedEventOrigin,
				})
			) {
				return;
			}

			const message = JSON.parse(event.data);

			if (message.type === args.eventType) {
				resolve();
			}
		}
	});
}

interface IIsMessageAllowedArgs {
	event: MessageEvent;
	allowedEventOrigin: string;
}

/**
 * Returns true if the message is allowed to be received by the window.
 */
function _isMessageAllowed(args: IIsMessageAllowedArgs): boolean {
	if (args.allowedEventOrigin === '*') {
		return true;
	}
	return args.event.origin === args.allowedEventOrigin;
}

interface ICreateIframeArgs {
	allowedEventOrigin: string;
	auth: IAuthOptions;
	debug?: boolean;
	networkLogo?: INetworkLogo;
	element?: HTMLElement;
	size?: Size;
	theme?: IThemeName;
	url: string;
	values?: Values;
}

/**
 * Creates the internal iframe with the right attributes extracted from the args.
 */
function _createIframe(args: ICreateIframeArgs): HTMLIFrameElement {
	const iframe = document.createElement('iframe');
	const params = _buildUrlParams(args);

	iframe.setAttribute('src', `${args.url}?${params.toString()}`);
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('height', args.size?.height || '100%');
	iframe.setAttribute('width', args.size?.width || '100%');
	iframe.setAttribute('data-cy', 'pci-sdk-web');

	return iframe;
}

interface IBuildUrlParams {
	allowedEventOrigin: string;
	auth: {
		cardId: string;
		environment: 'stg' | 'sbx' | 'prd';
	};
	debug?: boolean;
	networkLogo?: INetworkLogo;
	element?: HTMLElement;
	size?: Size;
	theme?: IThemeName;
	url: string;
	values?: Values;
}

/**
 * Generates the url to be loaded by the iframe.
 */
function _buildUrlParams(args: IBuildUrlParams): URLSearchParams {
	const params = new URLSearchParams();

	params.set('cardId', args.auth.cardId);
	params.set('environment', args.auth.environment);

	if (args.networkLogo) {
		params.set('networkLogoSymbol', args.networkLogo.symbol);

		if (args.networkLogo.position) {
			params.set('networkLogoPosition', args.networkLogo.position);
		}

		if (args.networkLogo.size) {
			params.set('networkLogoWidth', args.networkLogo.size.width);
			params.set('networkLogoHeight', args.networkLogo.size.height);
		}
	}

	if (args.values) {
		Object.keys(args.values).forEach((key) =>
			params.set(key, (args.values as any)[key])
		);
	}

	if (args.theme) {
		params.set('theme', args.theme.toString());
	}

	if (args.debug) {
		params.set('debug', 'true');
	}

	return params;
}

export default { initIframe };
