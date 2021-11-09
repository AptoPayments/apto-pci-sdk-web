import React from 'react';
import CardData from './components/CardData/CardData';
import Debugger from './components/Debugger/Debugger';
import Info from './components/Info/Info';
import InlineForm from './components/InlineForm/InlineForm';
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
					<InlineForm
						autoComplete="one-time-code"
						ariaLabel="Enter the OTP code"
						handleSubmit={handleCodeSubmit}
						id="otp-input"
						placeholder={codePlaceholderMessage}
						required
						testID="otp-form"
						theme={theme}
					/>
					{isDebug ? <Debugger /> : null}
				</>
			);

		case 'SET_PIN_FORM':
			return (
				<>
					{message ? <Info message={message} theme={theme} /> : null}
					<InlineForm
						autoComplete="off"
						ariaLabel="Set the new pin code"
						handleSubmit={handlePinSubmit}
						id="pin-input"
						placeholder={pinPlaceholderMessage}
						required
						testID="set-pin-form"
						theme={theme}
					/>
					{isDebug ? <Debugger /> : null}
				</>
			);
	}
}
