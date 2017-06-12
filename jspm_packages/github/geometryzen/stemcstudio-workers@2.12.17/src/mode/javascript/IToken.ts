export interface IToken {
    accessorType?: 'get' | 'set';
    allowNewLine?: boolean;
    arity?: string;
    assign?;
    base?: number;
    beginStmt?;
    /**
     * Duplicates beginStmt?
     */
    beginsStmt?;
    block?;
    body?;
    caseFallsThrough?;
    char?: string;
    character?;
    check?;
    comment?;
    commentType?: number | string;
    context?;
    delim?;
    depth?;
    exps?: boolean;
    first?: IToken;
    flags?: string[];
    forgiveUndef?: boolean;
    from?: number;
    fud?;
    // id or identifier or both?
    id?: string;
    identifier?;
    immed?;
    inBracelessBlock?;
    infix?: boolean;
    isLegacy?: boolean;
    isMalformed?: boolean;
    isMetaProperty?;
    isMultiline?: boolean;
    isProperty?: boolean;
    isSpecial?;
    isUnclosed?;
    jump?: number;
    label?;
    labelled?;
    lbp?;
    led?;
    left?;
    line?;
    /**
     * Duplicates isMalformed?
     */
    malformed?: boolean;
    meta?;
    nud?;
    quote?: "'" | '"';
    reach?;
    reserved?: boolean;
    startChar?: number;
    startLine?: number;
    tail?;
    template?;
    text?: string;
    tokenLength?: number;
    type?: number | string;
    value?: string;
}
