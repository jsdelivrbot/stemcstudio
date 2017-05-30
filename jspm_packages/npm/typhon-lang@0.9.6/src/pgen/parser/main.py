import pgen
import sys
out = """// DO NOT MODIFY. File automatically generated by pgen/parser/main.py
import { Tokens } from './Tokens';

/**
 * Mapping from operator textual symbols to token symbolic constants.
 */
export const OpMap: { [op: string]: Tokens } = {
    "(": Tokens.T_LPAR,
    ")": Tokens.T_RPAR,
    "[": Tokens.T_LSQB,
    "]": Tokens.T_RSQB,
    ":": Tokens.T_COLON,
    ",": Tokens.T_COMMA,
    ";": Tokens.T_SEMI,
    "+": Tokens.T_PLUS,
    "-": Tokens.T_MINUS,
    "*": Tokens.T_STAR,
    "/": Tokens.T_SLASH,
    "|": Tokens.T_VBAR,
    "&": Tokens.T_AMPER,
    "<": Tokens.T_LESS,
    ">": Tokens.T_GREATER,
    "=": Tokens.T_EQUAL,
    ".": Tokens.T_DOT,
    "%": Tokens.T_PERCENT,
    "`": Tokens.T_BACKQUOTE,
    "{": Tokens.T_LBRACE,
    "}": Tokens.T_RBRACE,
    "@": Tokens.T_AT,
    "==": Tokens.T_EQEQUAL,
    "!=": Tokens.T_NOTEQUAL,
    "<>": Tokens.T_NOTEQUAL,
    "<=": Tokens.T_LESSEQUAL,
    ">=": Tokens.T_GREATEREQUAL,
    "~": Tokens.T_TILDE,
    "^": Tokens.T_CIRCUMFLEX,
    "<<": Tokens.T_LEFTSHIFT,
    ">>": Tokens.T_RIGHTSHIFT,
    "**": Tokens.T_DOUBLESTAR,
    "+=": Tokens.T_PLUSEQUAL,
    "-=": Tokens.T_MINEQUAL,
    "*=": Tokens.T_STAREQUAL,
    "/=": Tokens.T_SLASHEQUAL,
    "%=": Tokens.T_PERCENTEQUAL,
    "&=": Tokens.T_AMPEREQUAL,
    "|=": Tokens.T_VBAREQUAL,
    "^=": Tokens.T_CIRCUMFLEXEQUAL,
    "<<=": Tokens.T_LEFTSHIFTEQUAL,
    ">>=": Tokens.T_RIGHTSHIFTEQUAL,
    "**=": Tokens.T_DOUBLESTAREQUAL,
    "//": Tokens.T_DOUBLESLASH,
    "//=": Tokens.T_DOUBLESLASHEQUAL,
    "->": Tokens.T_RARROW
};

""" + pgen.generate_grammar('grammar-typhon.txt').genjs() + \
"""
// Nothing more to see here.
"""
open(sys.argv[1], "w").write(out)
