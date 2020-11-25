const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

const TEMP_DIR = path.join(__dirname, '../tmp');
const INPATH = path.join(__dirname, '../build');
const OUTPATH = path.join(__dirname, `../tmp/${version}`);

try {
	if (!fs.existsSync(TEMP_DIR)) {
		fs.mkdirSync(TEMP_DIR);
	}
	fs.renameSync(INPATH, OUTPATH);
} catch (err) {
	switch (err.code) {
		case 'ENOENT':
			_throwDirectoryNotExistError();
		case 'ENOTEMPTY':
			_throwDirectoryNotEmptyError();
		default:
			throw err;
	}
}

function _throwDirectoryNotExistError() {
	const ERR_FILE_NOT_FOUND = `\x1b[31m "build" directory no found.

	Path: ${INPATH}

	Did you remember to run "npm run build"?

	\x1b[0m`;

	throw Error(ERR_FILE_NOT_FOUND);
}

function _throwDirectoryNotEmptyError() {
	const ERR_DIRECTORY_ALREADY_EXISTS = `\x1b[31m Directory already exists

	Directory name: ../tmp/${version}

	Are you attempting to publish the same version twice?

	\x1b[0m`;

	throw Error(ERR_DIRECTORY_ALREADY_EXISTS);
}
