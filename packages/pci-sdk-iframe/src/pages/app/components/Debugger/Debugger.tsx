import React, { useEffect, useState } from 'react';
import Response from './components/Response';

/**
 * Since the pci-sdk is hard do debug from the mobile we added this component that allows to see
 * useful data like interactions with the server or iframe status.
 */
export default function Debugger() {
	const [responses, setResponses] = useState<IResponse[]>([]);
	const [mountDate] = useState<Date>(() => new Date());

	useEffect(function overrideFetchWithASpyToDebug() {
		const { fetch: originalFetchImplementation } = window;

		// Modify the original implementation. Clone and persist each server interaction.
		window.fetch = async function fetchWithDebug(input: RequestInfo, init: RequestInit = {}) {
			const { body, headers } = init;
			const response = await originalFetchImplementation(input, init);
			const res = await response.clone();
			const serverResponse = await res.json();

			setResponses((s) => [...s, { body, headers, serverResponse, status: res.status, url: res.url }]);

			return response;
		};
	}, []);

	return (
		<aside
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				border: '1px solid #ddd',
				overflow: 'auto',
				maxHeight: '30vh',
				fontSize: '9px',
				backgroundColor: '#333',
				color: 'white',
			}}
		>
			<div>
				<div>Debugger mounted at: {mountDate.toISOString()}</div>
				{responses.reverse().map((r: any, i: number) => (
					<Response key={i} {...r} />
				))}
			</div>
		</aside>
	);
}
