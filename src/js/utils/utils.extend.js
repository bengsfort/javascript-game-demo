/**
 * Native JS extend utility
 * via @ChrisFerdinandi
 */
function utilsExtendObj() {
	var result = {},
		length = arguments.length;

	var mergeObject = function (obj) {
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				result[prop] = obj[prop];
			}
		}
	};

	for (var i = 0; i < length; i++) {
		mergeObject(arguments[i]);
	}

	return result;
}

module.exports = utilsExtendObj;