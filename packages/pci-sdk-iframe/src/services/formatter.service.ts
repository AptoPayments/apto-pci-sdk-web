function sanitize2FACode(code: string | null): string {
	return code ? _removeNonNumericalCharacters(code) : '';
}

function formatExpirationDate(value: string): string  {
	if (value === '') {
		return value;
	}

	// We need to parse the year and month
	if(value.length > 5) {
		const valueSorted =  _sortAscByLength(value.split('-'));
		const month = valueSorted[0];
		const year = valueSorted[1];
		return _addSlash(`${month}${year.slice(2)}`).trim();
	}

	const cleanValue = _removeNonNumericalCharacters(value);
	return _addSlash(cleanValue).trim();
}

function formatPan(value: string): string  {
	if (value === '') {
		return value;
	}

	const cleanValue = _removeNonNumericalCharacters(value);
	return _groupIn4Characters(cleanValue).trim();
}

function _sortAscByLength(array: string[]): string[] {
	return array.sort(function (a, b) { return a.length - b.length; });
}

function _removeNonNumericalCharacters(value: string): string {
	return value.replace(/[^\d]/g, '');
}

function _groupIn4Characters(value: string): string  {
	return value.replace(/(.{4})/g, '$1 ');
}

function _addSlash(value: string): string  {
	if (value === '') {
		return value;
	}

	return `${value.slice(0, 2)}/${value.slice(2)}`;
}


export default {
	formatExpirationDate,
	formatPan,
	sanitize2FACode,
};
