import React from 'react';
import Debugger from './components/Debugger';
import useApp from './useApp';

export default function App() {
	const { isLoading, cvv, exp, labelCvv, labelExp, labelName, labelPan, nameOnCard, pan, theme, isDebug } = useApp();

	return (
		<>
			<main id="container" style={{ ...theme.container }}>
				<div id="group-name" style={{ ...theme.groups, ...theme.groupName }}>
					<label id="label-name" style={{ ...theme.labels, ...theme.labelName }}>
						{labelName}
					</label>
					<span id="name" data-testid="cardholder-name" style={{ ...theme.shared, ...theme.name }}>
						{nameOnCard}
					</span>
				</div>

				<div id="group-pan" style={{ ...theme.groups, ...theme.groupPan }}>
					<label id="label-pan" style={{ ...theme.labels, ...theme.labelPan }}>
						{labelPan}
					</label>
					<span className={isLoading ? 'loading' : ''} id="pan" style={{ ...theme.shared, ...theme.pan }}>
						{pan}
					</span>
				</div>

				<div id="group-cvv" style={{ ...theme.groups, ...theme.groupCvv }}>
					<label id="label-cvv" style={{ ...theme.labels, ...theme.labelCvv }}>
						{labelCvv}
					</label>
					<span className={isLoading ? 'loading' : ''} id="cvv" style={{ ...theme.shared, ...theme.cvv }}>
						{cvv}
					</span>
				</div>

				<div id="group-exp" style={{ ...theme.groups, ...theme.groupExp }}>
					<label id="label-exp" style={{ ...theme.labels, ...theme.labelExp }}>
						{labelExp}
					</label>
					<span className={isLoading ? 'loading' : ''} id="exp" style={{ ...theme.shared, ...theme.exp }}>
						{exp}
					</span>
				</div>
			</main>
			{isDebug ? <Debugger /> : null}
		</>
	);
}
