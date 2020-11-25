/**
 * Communication between the iframe and the Apto SDK
 */
type IMessage = IframeReadyMessage | IframeVisibilityChangeMessage;

interface IframeReadyMessage {
	type: 'apto-iframe-ready';
}

interface IframeVisibilityChangeMessage {
	type: 'apto-iframe-visibility-change';
	payload: {
		isVisible: boolean;
	};
}

export default IMessage;
