import IMessage from 'types/IMessage';

function emitMessage(message: IMessage) {
	if (window.self !== window.parent) {
		window.parent.postMessage(JSON.stringify(message), '*'); // TODO: Investigate how to filter by parent CORS domain
	}
}

export default {
	emitMessage,
};
