function nullParser(text){
	if(text.startsWith('null')){
		return [null, text.substring(4)];
	}else{
		return null;
	}
}

console.log(nullParser('null'));


function booleanParser(text){
	if(text.startsWith('true')){
		return [true, text.substring(4)];
	}else if(text.startsWith('false')){
		return [false, text.substring(5)];
	}else{
		return null;
	}

}

console.log(booleanParser('true'));

function stringParser(text){
	if(text.startsWith('"')){
		let end;
		let f = 0;
		//let pattern = /^"(\\"|[^"])*"/;
		//return[pattern.exec(text)[0], text.substring(pattern.exec(text)[0].length)];
		
		for(end = 1; end < text.length; end++){
			if(text[end] == '\\'){
				if(text[end + 1] == '"'){
					end += 1;
				}
			}else if(text[end] == '"'){
				break;
			}

		}
		if(end < text.length){
			return [text.substring(1,end), text.substring(end+1)];
		}else{
			console.log("Syntax error");
			return null;
		}
		

	}else{
		return null;
	}
}

console.log(stringParser('"hello \\\" world"'));

function numberParser(text){
	let pattern = /^(\-)?(\d)+((\.)\d+((e|E)(\+|\-)\d+)?)?/;
	//let pattern = /^(\d+)([.]\d+)?/;
	if((pattern.exec(text)) != null){
		let result = pattern.exec(text);
		return [Number(result[0]), text.substring(result[0].length)];
	}else{
		return null;
	}
}

console.log(numberParser('1234.56e+20'));

function whitespaceParser(text){
	let pattern = /^(\s+)/;
	if((pattern.exec(text)) != null){
		let result = pattern.exec(text);
		return [result[0], text.substring(result.index + result[1].length)];
	}else{
		return null;
	}
}

console.log(whitespaceParser('  '));

function commaParser(text){
	if(text.startsWith(',')){
		return [',', text.substring(1)];
	}else{
		return null;
	}
}

console.log(commaParser(',null'));

function squareCloseParser(text){
	if(text.startsWith(']')){
		return [']', text.substring(1)];
	}else{
		return null;
	}
}

console.log(squareCloseParser('],123'));

function curlyCloseParser(text){
	if(text.startsWith('}')){
		return ['}', text.substring(1)];
	}else{
		return null;
	}
}

function colonParser(text){
	if(text.startsWith(':')){
		return [':', text.substring(1)];
	}else{
		return null;
	}
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

const validType = factoryParser(nullParser,booleanParser,stringParser,numberParser,arrayParser,objectParser);

function arrayParser(text){
	if(text.startsWith('[')){
		let parsedArr = [];
		text = text.substring(1);
		result = whitespaceParser(text);
		if(result != null){
			text = result[1];
			continue;
		}
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
			console.log("Syntax error");
			return null;
		}
		

	}else{
		return null;
	}
}

console.log(arrayParser('[[null,true,"hi\\o"],1]'));



function objectParser(text){
	if(text.startsWith('{')){
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

			key = result[0];
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

			if(commaParser(text) != null){
				text = commaParser(text)[1];
			}else{
				break;
			}
		}

		if(curlyCloseParser(text) != null){
			return [parsedObj, text.substring(1)];
		}else{
			console.log("Syntax error");
			return null;
		}

		

	}else{
		return null;
	}
}


console.log(objectParser('{"name":"John","age":30,"car":null}'));



