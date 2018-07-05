function nullParser(text){
	return text.startsWith('null') ? [null, text.substring(4)] : null;
}

function booleanParser(text){
	return text.startsWith('true') ? [true, text.substring(4)] : (text.startsWith('false') ? [false, text.substring(5)] : null);
}

function stringParser(text){
	if(!text.startsWith('"')){
		return null;
	}
	let result = /^"(\\"|[^"])*"/.exec(text);
	return result != null ? [result[0].substring(1,result[0].length-1),text.substring(result[0].length)] : "Syntax error";
}

function numberParser(text){
	let pattern = /^(\-)?(\d)+((\.)\d+((e|E)(\+|\-)\d+)?)?/;
	let result = pattern.exec(text);
	return result == null ? null : [Number(result[0]), text.substring(result[0].length)];
}

function whitespaceParser(text){
	let result = /^(\s+)/.exec(text);
	return result == null ? null : [result[0], text.substring(result[0].length)];
}

function commaParser(text){
	return text.startsWith(',') ? [',', text.substring(1)] : null;
}

function squareCloseParser(text){
	return text.startsWith(']') ? [']', text.substring(1)] : null;
}

function curlyCloseParser(text){
	return text.startsWith('}') ? ['}', text.substring(1)] : null;
}

function colonParser(text){
	return text.startsWith(':') ? [':', text.substring(1)] : null;
}

function factoryParser(...parsers){
	return function(text){
		for(parser of parsers){
			let x = parser(text);
			if(x != null){
				return x;
			}
		}
		return null;
	};
}

const validType = factoryParser(objectParser,arrayParser,nullParser,booleanParser,stringParser,numberParser);

function arrayParser(text){
	if(!text.startsWith('[')){
		return null;
	}
	let parsedArr = [];
	text = text.substring(1);
	while(1){
		let result = validType(text);
		if(result != null){
			parsedArr.push(result[0]);
			text = result[1];
		}else{
			result = whitespaceParser(text);
			if(result != null){
				text = result[1];
				continue;
			}
			result = commaParser(text);
			if(result != null){
				text = result[1];
				continue;
			}else{
				break;
			}
		}
	}
	if(squareCloseParser(text) != null){
		return [parsedArr, squareCloseParser(text)[1]];
	}else{
		return "Syntax error";
	}
		
}

function objectParser(text){
	if(!text.startsWith('{')){
		return null;
	}
	let parsedObj = {};
	text = text.substring(1);
	while(1){
		if(whitespaceParser(text) != null){
			text = whitespaceParser(text)[1];
		}
		//checking for valid key
		let result = stringParser(text);
		if(result == null){
			break;
		}
		let key = result[0];
		text = result[1];
		
		if(whitespaceParser(text) != null){
			text = whitespaceParser(text)[1];
		}

		//checking for colon after key
		result = colonParser(text);
		if(result == null){
			break;
		}

		text = result[1];

		if(whitespaceParser(text) != null){
			text = whitespaceParser(text)[1];
		}

		//checking for valid value
		result = validType(text);
		if(result == null){
			break;
		}

		parsedObj[key] = result[0];
		text = result[1];

		if(whitespaceParser(text) != null){
			text = whitespaceParser(text)[1];
		}

		if(commaParser(text) != null){
			text = commaParser(text)[1];
		}else{
			break;
		}
	}

	if(curlyCloseParser(text) != null){
		return [parsedObj, text.substring(1)];
	}else{
		return "Syntax error";
	}

}

function parseValue(text){
	let result = validType(text);
	return result != null && result != "Syntax error" && result[1] == '' ? result[0] : "Syntax error";
}

function main(){
	var fs = require('fs');
	let text = fs.readFileSync('bigTwitter.txt');
	console.log(JSON.stringify(parseValue(text.toString())));

}
main();