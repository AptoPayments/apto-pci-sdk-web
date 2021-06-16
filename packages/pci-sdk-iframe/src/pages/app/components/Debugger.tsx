import React, { PropsWithChildren, useEffect, useState } from 'react';

type IDebuggerProps = any;

export default function Debugger(props: IDebuggerProps) {
	const [responses, setResponses] = useState<IResponse[]>([]);
	const [mountDate] = useState<Date>(() => new Date());

	useEffect(() => {
		const { fetch: origFetch } = window;
		(window as Window).fetch = async function fetchWithDebug(input: RequestInfo, init?: RequestInit) {
			const response = await origFetch(input, init);
			const res = await response.clone();
			const serverResponse = await res.json();
			const body = init?.body;

			const newResponse: IResponse = {
				body,
				headers: init?.headers,
				serverResponse,
				status: res.status,
				url: res.url,
			};

			setResponses((s: IResponse[]) => [...s, newResponse]);

			return response;
		};
	}, []);

	return (
		<aside
			style={{
				position: 'fixed',
				background: 'white',
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

interface IResponse {
	status: number;
	url: string;
	body?: BodyInit | null;
	serverResponse?: {
		code?: number;
		message?: string;
	};
	headers?: HeadersInit;
}

function Response(props: PropsWithChildren<IResponse>) {
	return (
		<div
			style={{ display: 'block', padding: '.3rem .2rem', fontFamily: 'monospace', borderBottom: '1px solid #d2d2d2' }}
		>
			<div style={{ display: 'flex' }}>
				<div style={{ marginRight: '.3rem' }}>{props.status}</div>
				<div>{props.url}</div>
			</div>

			<div style={{ display: 'flex' }}>
				<details>
					<summary>Server Response</summary>
					<dt>Message</dt>
					<dd>{props.serverResponse?.message}</dd>

					<dt>Code:</dt>
					<dd>{props.serverResponse?.code}</dd>
				</details>
			</div>

			<div style={{ display: 'flex' }}>
				<details>
					<summary>Request</summary>

					<dt>Body</dt>
					<dd>
						<pre>{props.body}</pre>
					</dd>

					<dt>Headers:</dt>
					<dd>
						<pre>{JSON.stringify(props.headers, null, '\t')}</pre>
					</dd>
				</details>
			</div>
		</div>
	);
}
