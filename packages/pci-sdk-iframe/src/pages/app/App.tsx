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
		card,
		config,
		labels,
		cvv,
		exp,
		isLoading,
		message,
		networkLogoHeight,
		networkLogoPosition,
		networkLogoSymbol,
		networkLogoWidth,
		pan,
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
						labelCvv={card.labelCvv}
						labelExp={card.labelExp}
						labelName={card.labelName}
						labelPan={card.labelPan}
						nameOnCard={card.nameOnCard}
						networkLogoHeight={networkLogoHeight}
						networkLogoPosition={networkLogoPosition}
						networkLogoSymbol={networkLogoSymbol}
						networkLogoWidth={networkLogoWidth}
						pan={pan}
						theme={theme}
					/>
					{config.isDebug ? <Debugger /> : null}
				</>
			);
		case 'OTP_FORM':
			return (
				<>
					{message ? <Info message={message} theme={theme} /> : null}
					<InlineForm
						autoComplete="one-time-code"
						ariaLabel="Enter the OTP code"
						ctaText={labels.otpSubmitButton}
						handleSubmit={handleCodeSubmit}
						id="otp-input"
						placeholder={labels.codePlaceholder}
						required
						testID="otp-form"
						theme={theme}
					/>
					{config.isDebug ? <Debugger /> : null}
				</>
			);

		case 'SET_PIN_FORM':
			return (
				<>
					{message ? <Info message={message} theme={theme} /> : null}
					<InlineForm
						autoComplete="off"
						ariaLabel="Set the new pin code"
						ctaText={labels.setPinSubmitButton}
						handleSubmit={handlePinSubmit}
						id="pin-input"
						maxlength={4}
						placeholder={labels.pinPlaceholder}
						required
						testID="set-pin-form"
						theme={theme}
					/>
					{config.isDebug ? <Debugger /> : null}
				</>
			);
	}
}
