/**
 * Represents the fields we display in the Debugger component
 */
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
