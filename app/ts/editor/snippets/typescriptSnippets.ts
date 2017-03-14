import { dedent } from './dedent';
import { parseSnippetFile } from './parseSnippetFile';

// tslint:disable-next-line:one-variable-per-declaration
const snippets = parseSnippetFile(dedent`

snippet class
	class \${1?:ClassName} {
		constructor(\${2:/* [parameter [, parameter]*] */}) {
			\${3:// body...}
		}
	}

snippet function
	function \${1?:functionName}(\${2:/* [parameter [, parameter]*] */}): \${3:void} {
		\${4:// body...}
	}

snippet if
	if (\${1:true}) {
		\${2}
	}
	else {
		\${0}
	}

snippet tertiary
	\${1:/* condition */} ? \${2:a} : \${3:b}

snippet switch
	switch (\${1:expression}) {
		case \${3:value}: {
			\${4:// code block}
			break
		}
		\${5}
		default: {
			\${2:// code block}
		}
	}

snippet case
	case \${1:value}: {
		\${2:// code block}
		break
	}
	\${3}

snippet while
	while (\${1:/* condition */}) {
		\${0:/* code */}
	}

snippet try
	try {
		\${1:/* code */}
	}
	catch (e) {
		\${2:/* code */}
	}
	finally {
		\${3:/* code */}
	}

snippet do
	do {
		\${2:/* code */}
	}
	while (\${1:/* condition */})

snippet import
	import {\${2:/* export */}} from '\${1:moduleName}'

snippet describe
	describe("\${1:description}", function() {
		\${0:// body...}
	})

snippet it
	it("\${1:description}", function() {
		\${0:// body...}
	})

snippet expect
	expect(\${1:expression}).\${2:toBe}(\${3:expression})

`);
// console.log(JSON.stringify(snippets, null, 2));
export default snippets;
