const NEWLINE = '\n';

/**
 * The version of MathJax on cdnjs.
 */
const MATHJAX_CDNJS_VERSION = '2.7.3';
/**
 * The version of highlight.js on cdnjs.
 */
const HIGHLIGHTJS_CDNJS_VERSION = '9.12.0';

/**
 * The template used for creating the README.html for the README.md
 */
export function readMeHTML(tabString: string, options: {} = {}): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("<!DOCTYPE html>");
    lines.push("<html>");
    lines.push(_ + "<head>");

    githubStyle(lines);

    mathJax(lines);
    highlightJs(lines);

    // README.css comes below so that it can override previous styles.
    lines.push(_ + _ + "<style>");
    lines.push("/* README.css */");
    lines.push(_ + _ + "</style>");

    lines.push(_ + "</head>");
    lines.push(_ + "<body>");
    lines.push(_ + _ + "<article class='markdown-body'>");
    lines.push("// README.md");
    lines.push(_ + _ + "</article>");
    lines.push(_ + "</body>");
    lines.push("</html>");
    return lines.join(NEWLINE).concat(NEWLINE);
}

function githubStyle(lines: string[]): void {
    lines.push("    <style>");

    lines.push('');
    lines.push('html {');
    lines.push('    font-family: sans-serif;');
    lines.push('}');

    lines.push('');
    lines.push('body {');
    lines.push('    font: 13px / 1.4 Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";');
    lines.push('    color: #333;');
    lines.push('    background-color: #fff;');
    lines.push('}');

    lines.push('');
    lines.push('article {');
    lines.push('    display: block;');
    lines.push('}');

    lines.push('');
    lines.push('code {');
    lines.push('    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;');
    lines.push('    font-size: 12px;');
    lines.push('}');

    lines.push('');
    lines.push('.markdown-body {');
    lines.push('    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";');
    lines.push('    font-size: 16px;');
    lines.push('    line-height: 1.6;');
    lines.push('    word-wrap: break-word;');
    lines.push('}');

    lines.push('');
    lines.push('.markdown-body h1 {');
    lines.push('    padding-bottom: 0.3em;');
    lines.push('    font-size: 2.25em;');
    lines.push('    line-height: 1.2;');
    lines.push('    border-bottom: 1px solid #eee;');
    lines.push('}');

    lines.push('');
    lines.push('.markdown-body h2 {');
    lines.push('    padding-bottom: 0.3em;');
    lines.push('    font-size: 1.75em;');
    lines.push('    line-height: 1.225;');
    lines.push('    border-bottom: 1px solid #eee;');
    lines.push('}');

    lines.push('');
    lines.push('.markdown-body pre {');
    lines.push('    background-color: #f7f7f7;');
    lines.push('    border-radius: 3px;');
    lines.push('}');

    lines.push("    </style>");
}

/**
 * 
 */
function highlightJs(lines: string[]): void {
    // TODO: There are other CSS styles on cdnjs.
    // lines.push(`    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/${HIGHLIGHTJS_CDNJS_VERSION}/styles/default.min.css">`);
    lines.push(`    <link rel="stylesheet" href="https://www.stemcstudio.com/highlight/stemcstudio-dark.css">`);
    lines.push(`    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HIGHLIGHTJS_CDNJS_VERSION}/highlight.min.js"></script>`);
    lines.push(`    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HIGHLIGHTJS_CDNJS_VERSION}/languages/typescript.min.js"></script>`);
    // TODO: We can do other customization of highlight.js beyond this...
    lines.push('    <script>hljs.initHighlightingOnLoad();</script>');
}

function mathJax(lines: string[]): void {
    lines.push('    <style TYPE="text/css">');
    lines.push('    code.has-jax {font: inherit; font-size: 100%; background: inherit; border: inherit;}');
    lines.push('    </style>');
    lines.push('    <script type="text/x-mathjax-config">');
    lines.push('    MathJax.Hub.Config({');
    lines.push('      tex2jax: {');
    lines.push("        inlineMath: [['$','$']],");
    lines.push("        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'] // removed 'code' entry");
    lines.push('      }');
    lines.push('    });');
    lines.push('    MathJax.Hub.Queue(function() {');
    lines.push('      var all = MathJax.Hub.getAllJax(), i;');
    lines.push('      for(i = 0; i < all.length; i += 1) {');
    lines.push("        all[i].SourceElement().parentNode.className += ' has-jax';");
    lines.push('      }');
    lines.push('    });');
    lines.push('    </script>');
    lines.push(`    <script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/${MATHJAX_CDNJS_VERSION}/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>`);
}
