import IParsedEvent from 'types/IParsedEvent';

function parse(event: MessageEvent): IParsedEvent {
	if (!event.data) {
		console.info(`\n[PCI-SDK]: iframe received unexpected event:\n\n${_toString(event)}`);
		return { type: 'unknown' };
	}
	try {
		const data = JSON.parse(event.data);
		if (!data.type) {
			console.info(`[PCI-SDK]: iframe received unexpected event:\n\n${_toString(event)}`);
			return { type: 'unknown' };
		}
		return data;
	} catch (err) {
		console.info(`[PCI-SDK]: iframe received unexpected event:\n\n${_toString(event)}`);
		return { type: 'unknown' };
	}
}

function _toString(event: MessageEvent) {
	return JSON.stringify(
		{
			from: event.origin,
			data: event.data,
		},
		null,
		2
	);
}

export default { parse };
