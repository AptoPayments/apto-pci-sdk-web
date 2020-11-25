const { version } = require('../../pci-sdk-iframe/package.json');
const aptoPciSdk = require('../dist/umd/apto-pci-sdk');

if (aptoPciSdk.version === version) {
	console.info(`Version check: ${version}`);
	process.exit(0);
}

const ERR_INVALID_VERSIONS = `\x1b[31m

AptoPCISdk version does not match the package.json version on pci-sdk-iframe. This is required to generate the iframe Url.

Make sure VERSION in src/index.ts matches the pci-sdk-iframe version and then run "npm run build" to generate /dist.

Apto SDK Version:	${aptoPciSdk.version}
Iframe version:		${version}

\x1b[0m
`;

throw Error(ERR_INVALID_VERSIONS);
