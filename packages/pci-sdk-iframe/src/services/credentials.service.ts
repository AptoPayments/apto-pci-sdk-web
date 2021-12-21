/**
 * We store this credentials in memory
 */
const auth = { apiKey: '', userToken: '' };

function getAuth() {
	return auth;
}

interface ISetAuthArgs {
	apiKey: string;
	userToken: string;
}

function setAuth(args: ISetAuthArgs) {
	auth.apiKey = args.apiKey;
	auth.userToken = args.userToken;
}

export default {
	getAuth,
	setAuth,
};
