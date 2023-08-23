import IThemeName from './types/IThemeName';
export interface InitOptions {
    auth: IAuthOptions;
    /**
     * When enabled a debugger console will be displayed in the iframe
     */
    debug?: boolean;
    element?: HTMLElement;
    networkLogo?: INetworkLogo;
    size?: Size;
    theme?: IThemeName;
    values?: Values;
}
export interface IAuthOptions {
    cardId: string;
    apiKey: string;
    userToken: string;
    environment: 'stg' | 'sbx' | 'prd';
}
export interface PCIStyle {
}
export interface INetworkLogo {
    position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
    size?: Size;
    symbol: 'mastercard' | 'visa-blue' | 'visa-white';
}
export interface Size {
    width: string;
    height: string;
}
export interface Values {
    /**
     * Placeholder in the OTP code input.
     */
    codePlaceholderMessage?: string;
    /**
     * Message displayed when the OTP session expired
     */
    expiredMessage?: string;
    /**
     * Message displayed when the OTP inserted is invalid
     */
    failed2FAPrompt?: string;
    /**
     * Text used as a label for the CVV
     */
    labelCvv?: string;
    /**
     * Text used as a label for the expiration date
     */
    labelExp?: string;
    /**
     * Text used as a label for the cardholder name
     */
    labelName?: string;
    /**
     * Text used as a label for the PAN
     */
    labelPan?: string;
    /**
     * Text containing the last four digits of the PAN
     */
    lastFour?: string;
    /**
     * Cardholder name
     */
    nameOnCard?: string;
    /**
     * Text displayed on the OTPForm submit button
     */
    otpSubmitButton?: string;
    /**
     * Placeholder in the change PIN input
     */
    pinPlaceholderMessage?: string;
    /**
     * Message displayed when the PIN is changed
     */
    pinUpdatedMessage?: string;
    /**
     * Text displayed on the SetPinForm submit button
     */
    setPinSubmitButton?: string;
    /**
     * Message displayed when too many OTP attempts are performed
     */
    tooManyAttemptsMessage?: string;
}
export declare function init(initOptions: InitOptions): Promise<HTMLIFrameElement>;
export declare function showPCIData(): void;
export declare function hidePCIData(): void;
export declare function setStyle(style: PCIStyle): void;
export declare function setTheme(theme: IThemeName): void;
export declare function showSetPinForm(): void;
export declare function getIsDataVisible(): Promise<boolean>;
export { version } from '@apto-payments/pci-sdk-iframe';
declare const _default: {
    getIsDataVisible: typeof getIsDataVisible;
    hidePCIData: typeof hidePCIData;
    init: typeof init;
    setStyle: typeof setStyle;
    setTheme: typeof setTheme;
    showPCIData: typeof showPCIData;
    showSetPinForm: typeof showSetPinForm;
    version: string;
};
export default _default;
