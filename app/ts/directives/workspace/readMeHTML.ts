const NEWLINE = '\n'

/**
 * The template used for creating the README.html for the README.md
 * 
 * @function readMeHTML
 * @param options {}
 * @return {string}
 */
export default function readMeHTML(options: {} = {}): string {
    const lines: string[] = []
    lines.push("<!DOCTYPE html>")
    lines.push("<html>")
    lines.push("  <head>")

    githubStyle(lines)

    lines.push("    <style>")
    lines.push("/* README.css */")
    lines.push("    </style>")

    mathJax(lines)

    lines.push("  </head>")
    lines.push("  <body>")
    lines.push("    <article class='markdown-body'>")
    lines.push("// README.md")
    lines.push("    </article>")
    lines.push("  </body>")
    lines.push("</html>")
    return lines.join(NEWLINE).concat(NEWLINE)
}

function githubStyle(lines: string[]): void {
    lines.push("    <style>")

    lines.push('')
    lines.push('html {')
    lines.push('    font-family: sans-serif;')
    lines.push('}')

    lines.push('')
    lines.push('body {')
    lines.push('    font: 13px / 1.4 Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";')
    lines.push('    color: #333;')
    lines.push('    background-color: #fff;')
    lines.push('}')

    lines.push('')
    lines.push('article {')
    lines.push('    display: block;')
    lines.push('}')

    lines.push('')
    lines.push('code {')
    lines.push('    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;')
    lines.push('    font-size: 12px;')
    lines.push('}')

    lines.push('')
    lines.push('.markdown-body {')
    lines.push('    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";')
    lines.push('    font-size: 16px;')
    lines.push('    line-height: 1.6;')
    lines.push('    word-wrap: break-word;')
    lines.push('}')

    lines.push('')
    lines.push('.markdown-body h1 {')
    lines.push('    padding-bottom: 0.3em;')
    lines.push('    font-size: 2.25em;')
    lines.push('    line-height: 1.2;')
    lines.push('    border-bottom: 1px solid #eee;')
    lines.push('}')

    lines.push('')
    lines.push('.markdown-body h2 {')
    lines.push('    padding-bottom: 0.3em;')
    lines.push('    font-size: 1.75em;')
    lines.push('    line-height: 1.225;')
    lines.push('    border-bottom: 1px solid #eee;')
    lines.push('}')

    lines.push('')
    lines.push('.markdown-body pre {')
    lines.push('    background-color: #f7f7f7;')
    lines.push('    border-radius: 3px;')
    lines.push('}')

    lines.push("    </style>")
}

function mathJax(lines: string[]): void {
    lines.push('    <style TYPE="text/css">')
    lines.push('    code.has-jax {font: inherit; font-size: 100%; background: inherit; border: inherit;}')
    lines.push('    </style>')
    lines.push('    <script type="text/x-mathjax-config">')
    lines.push('    MathJax.Hub.Config({')
    lines.push('      tex2jax: {')
    lines.push("        inlineMath: [['$','$']],")
    lines.push("        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'] // removed 'code' entry")
    lines.push('      }')
    lines.push('    });')
    lines.push('    MathJax.Hub.Queue(function() {')
    lines.push('      var all = MathJax.Hub.getAllJax(), i;')
    lines.push('      for(i = 0; i < all.length; i += 1) {')
    lines.push("        all[i].SourceElement().parentNode.className += ' has-jax';")
    lines.push('      }')
    lines.push('    });')
    lines.push('    </script>')
    lines.push("    <script src='https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>")
}
