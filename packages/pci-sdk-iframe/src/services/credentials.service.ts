// TODO: Move this to a closure.

const API_KEY_KEY = '__apto__apk__';
const USER_TOKEN_KEY = '__apto__ust__';

function getAuth() {
	const apiKey = sessionStorage.getItem(API_KEY_KEY);
	const userToken = sessionStorage.getItem(USER_TOKEN_KEY);

	return { apiKey, userToken };
}

interface ISetAuthArgs {
	apiKey: string;
	userToken: string;
}

function setAuth(args: ISetAuthArgs) {
	sessionStorage.setItem(API_KEY_KEY, args.apiKey);
	sessionStorage.setItem(USER_TOKEN_KEY, args.userToken);
}

export default {
	getAuth,
	setAuth,
};
