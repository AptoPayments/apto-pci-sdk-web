import React, { PropsWithChildren } from 'react';

/**
 *	Component used to debug each interaction between the server and the pci-sdk.
 */
export default function Response(props: PropsWithChildren<IResponse>) {
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
