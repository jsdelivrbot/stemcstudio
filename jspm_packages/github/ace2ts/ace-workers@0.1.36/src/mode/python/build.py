#!/usr/bin/env python2.7

#
#   Note:  python2.6 is specified because that is what the skulpt parser
#          used as a reference.  This is only important when you are doing
#          things like regenerating tests and/or regenerating symtabs
#          If you do not have python 2.6 and you ARE NOT creating new tests
#          then all should be well for you to use 2.7 or whatever you have around

from optparse import OptionParser
from subprocess import Popen, PIPE
import os
import sys

def gen():
    """regenerate the parser/ast source code"""
    os.chdir("pgen/parser")
    os.system("python main.py ../../tables.ts")
    os.chdir("../ast")
#   os.system("python asdl_js.py Python.asdl ../../astnodes.js")
    os.system("python asdl_ts.py Python.asdl ../../astnodes.ts")
    os.chdir("../../..")

def usageString(program):
    return '''

    {program} <command> [<options>]

Commands:

    gen              Regenerate parser
    help             Display help information

Options:

    -q, --quiet        Only output important information.
    -s, --silent       Do not output anything, besides errors.
    -v, --verbose      Make output more verbose [default].
'''.format(program=program)

def main():
    parser = OptionParser(usageString("%prog"))
    parser.add_option("-q", "--quiet",        action="store_false", dest="verbose")
    parser.add_option("-s", "--silent",       action="store_true",  dest="silent",       default=False)
    parser.add_option("-v", "--verbose",
        action="store_true",
        dest="verbose",
        default=False,
        help="Make output more verbose [default].")
    (options, args) = parser.parse_args()

    # This is rather aggressive. Do we really want it?
    if options.verbose:
        if sys.platform == 'win32':
            os.system("cls")
        else:
            os.system("clear")

    if len(sys.argv) < 2:
        cmd = "help"
    else:
        cmd = sys.argv[1]

    if cmd == "gen":
        gen()
    else:
        print usageString(os.path.basename(sys.argv[0]))
        sys.exit(2)

if __name__ == "__main__":
    main()
