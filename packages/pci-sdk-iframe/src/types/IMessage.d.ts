/**
 * Communication between the iframe and the Apto SDK
 */
type IMessage = IframeReadyMessage | IframeAuthReadyMessage | IframeVisibilityChangeMessage;

/**
 * Triggered when the iframe is loaded for the first time and can receive messages.
 */
interface IframeReadyMessage {
	type: 'apto-iframe-ready';
}

/**
 * Triggered when the iframe has received the auth credentials.
 */
interface IframeAuthReadyMessage {
	type: 'apto-iframe-auth-ready';
}

interface IframeVisibilityChangeMessage {
	type: 'apto-iframe-visibility-change';
	payload: {
		isVisible: boolean;
	};
}

export default IMessage;
