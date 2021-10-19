require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const { version } = require('../package.json');
const { S3_BUCKET, S3_KEY, S3_SECRET } = process.env;

if (!S3_BUCKET || !S3_KEY || !S3_SECRET) {
	_throwMissingEnvVariablesError();
}

const s3 = new AWS.S3({
	signatureVersion: 'v4',
	accessKeyId: S3_KEY,
	secretAccessKey: S3_SECRET,
});

const UPLOAD_DIR = path.join(__dirname, `../tmp/${version}`);

_uploadFilesInDirectory(UPLOAD_DIR, version);

function _uploadFilesInDirectory(directoryPath, relativePath) {
	const filesInDirectory = fs.readdirSync(directoryPath);

	filesInDirectory.forEach(function (fileName) {
		// local path to file or directory
		const filePath = path.join(directoryPath, fileName);
		// path to file or directory to be posted to s3
		const remotePath = `${relativePath}/${fileName}`;

		const stat = fs.statSync(filePath);
		if (stat.isFile()) {
			_uploadFile(filePath, remotePath);
		}
		if (stat.isDirectory()) {
			_uploadFilesInDirectory(filePath, `${relativePath}/${fileName}`);
		}
	});
}

function _uploadFile(filePath, remoteFilePath) {
	fs.readFile(filePath, (error, fileContent) => {
		if (error) {
			return _throwReadFileError(filePath);
		}

		const params = {
			Key: remoteFilePath,
			Bucket: S3_BUCKET,
			Body: fileContent,
			ACL: 'public-read',
			ContentType: _getContentType(filePath),
		};

		s3.upload(params, function (err, data) {
			if (err) {
				_throwUploadError(err, remoteFilePath);
			}
			console.info(`File uploaded successfully. ${data.Location}`);
		});
	});
}

function _throwMissingEnvVariablesError() {
	throw new Error('You must provide env. variables: [S3_BUCKET, S3_KEY, S3_SECRET]');
}

function _throwReadFileError(filePath) {
	const ERR_FILE_NOT_FOUND = `\x1b[31m source file is unreadable

	File path: ${filePath}

	Check that the file exists and is not corrupted

	\x1b[0m`;

	throw Error(ERR_FILE_NOT_FOUND);
}

function _throwUploadError(err, fileName) {
	const ERR_UPLOAD_FILE_FAILED = `\x1b[31m File failed to upload to s3

		Filename: ${fileName}

		Err: ${err}

		\x1b[0m`;

	throw Error(ERR_UPLOAD_FILE_FAILED);
}

function _getContentType(filename) {
	switch (filename.split('.').pop()) {
		case 'html':
			return 'text/html';
		case 'css':
			return 'text/css';
		case 'js':
			return 'application/javascript';
		case 'png':
			return 'image/png';
		case 'json':
			return 'application/json';
		case 'txt':
			return 'text/plain';
		case 'icon':
			return 'image/x-icon';
		default:
			return 'application/octet-stream';
	}
}
