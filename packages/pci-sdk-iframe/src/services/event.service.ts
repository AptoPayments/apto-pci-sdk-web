import IParsedEvent from 'types/IParsedEvent';

function parse(event: MessageEvent): IParsedEvent {
	if (!event.data) {
		console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
		return { type: 'unknown' };
	}
	try {
		const data = JSON.parse(event.data);
		if (!data.type) {
			console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
			return { type: 'unknown' };
		}
		return data;
	} catch (err) {
		console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
		return { type: 'unknown' };
	}
}

export default { parse };
