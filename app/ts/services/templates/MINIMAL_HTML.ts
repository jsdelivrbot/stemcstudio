const NEWLINE = '\n'

export default function(options: {} = {}): string {
  const lines: string[] = []
  lines.push("<!DOCTYPE html>")
  lines.push("<html>")
  lines.push("  <head>")
  lines.push("    <style>")
  lines.push("/* STYLE-MARKER */")
  lines.push("    </style>")
  lines.push("    <script src='https://jspm.io/system.js'></script>")
  lines.push("<!-- SCRIPTS-MARKER -->")
  lines.push("  </head>")
  lines.push("  <body>")
  lines.push("    <script>")
  lines.push("// CODE-MARKER")
  lines.push("    </script>")
  lines.push("    <script>")
  lines.push("        System.import('./bootstrap.js')")
  lines.push("    </script>")
  lines.push("  </body>")
  lines.push("</html>")
  return lines.join(NEWLINE).concat(NEWLINE)
}
