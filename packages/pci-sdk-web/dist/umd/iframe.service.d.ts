import { IAuthOptions, INetworkLogo, Size, Values } from './index';
import IThemeName from './types/IThemeName';
interface IInitIframeArgs {
    allowedEventOrigin: string;
    auth: IAuthOptions;
    debug?: boolean;
    networkLogo?: INetworkLogo;
    element?: HTMLElement;
    size?: Size;
    theme?: IThemeName;
    url: string;
    values?: Values;
}
export declare function initIframe(args: IInitIframeArgs): Promise<HTMLIFrameElement>;
declare const _default: {
    initIframe: typeof initIframe;
};
export default _default;
