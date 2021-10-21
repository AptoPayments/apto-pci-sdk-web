import React from 'react';
import CardData from './components/CardData/CardData';
import Debugger from './components/Debugger/Debugger';
import Form from './components/Form/Form';
import Info from './components/Info/Info';
import SetPinForm from './components/SetPinForm/SetPinForm';
import useApp from './useApp';

export default function App() {
	const {
		handlePinSubmit,
		handleCodeSubmit,
		codePlaceholderMessage,
		cvv,
		exp,
		isDebug,
		isLoading,
		labelCvv,
		labelExp,
		labelName,
		labelPan,
		message,
		nameOnCard,
		networkLogoHeight,
		networkLogoPosition,
		networkLogoSymbol,
		networkLogoWidth,
		pan,
		pinPlaceholderMessage,
		theme,
		uiStatus,
	} = useApp();

	switch (uiStatus) {
		case 'CARD_DATA_HIDDEN':
		case 'CARD_DATA_VISIBLE':
			return (
				<>
					{message ? <Info message={message} theme={theme} /> : null}
					<CardData
						isLoading={isLoading}
						cvv={cvv}
						exp={exp}
						labelCvv={labelCvv}
						labelExp={labelExp}
						labelName={labelName}
						labelPan={labelPan}
						nameOnCard={nameOnCard}
						networkLogoHeight={networkLogoHeight}
						networkLogoPosition={networkLogoPosition}
						networkLogoSymbol={networkLogoSymbol}
						networkLogoWidth={networkLogoWidth}
						pan={pan}
						theme={theme}
					/>
					{isDebug ? <Debugger /> : null}
				</>
			);
		case 'OTP_FORM':
			return (
				<>
					{message ? <Info message={message} theme={theme} /> : null}
					<Form handleSubmit={handleCodeSubmit} placeholder={codePlaceholderMessage} theme={theme} />
					{isDebug ? <Debugger /> : null}
				</>
			);

		case 'SET_PIN_FORM':
			return (
				<>
					{message ? <Info message={message} theme={theme} /> : null}
					<SetPinForm handleSubmit={handlePinSubmit} placeholder={pinPlaceholderMessage} theme={theme} />
					{isDebug ? <Debugger /> : null}
				</>
			);
	}
}
