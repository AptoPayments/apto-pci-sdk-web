import React from 'react';
import CardData from './components/CardData/CardData';
import Debugger from './components/Debugger/Debugger';
import Form from './components/Form/Form';
import Info from './components/Info/Info';
import useApp from './useApp';

export default function App() {
	const {
		handleCodeSubmit,
		codePlaceholderMessage,
		cvv,
		exp,
		isDebug,
		isFormVisible,
		isLoading,
		labelCvv,
		labelExp,
		labelName,
		labelPan,
		message,
		nameOnCard,
		pan,
		theme,
	} = useApp();

	return (
		<>
			{message ? <Info message={message} theme={theme} /> : null}
			{isFormVisible ? (
				<Form handleSubmit={handleCodeSubmit} placeholder={codePlaceholderMessage} theme={theme} />
			) : (
				<CardData
					isLoading={isLoading}
					cvv={cvv}
					exp={exp}
					labelCvv={labelCvv}
					labelExp={labelExp}
					labelName={labelName}
					labelPan={labelPan}
					nameOnCard={nameOnCard}
					pan={pan}
					theme={theme}
				/>
			)}
			{isDebug ? <Debugger /> : null}
		</>
	);
}
