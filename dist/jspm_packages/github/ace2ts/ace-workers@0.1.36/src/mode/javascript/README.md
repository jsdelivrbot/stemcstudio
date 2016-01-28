JSHINT notes
============

* error *

id: string       e.g. "(error)"
raw: string      The message that is displayed. e.g. "'{a}' is not defined."
code: string     e.g. "Ennn" or "Wnnn"
evidence: string A fragment of code. Maybe could be used to highlight?
line: number     1-based
column: number
scope: string    e.g. "(main)"
a: string        The replaceable parameter in the raw string.
reason: string   The result of combining the raw string with the parameters.
