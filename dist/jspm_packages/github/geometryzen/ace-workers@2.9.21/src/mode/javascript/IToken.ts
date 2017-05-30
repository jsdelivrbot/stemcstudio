export interface IToken {
    accessorType?: 'get' | 'set';
    allowNewLine?: boolean;
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
    flags?: string[];
    from?: number;
    fud?;
    id?: string;
    identifier?;
    immed?;
    inBracelessBlock?;
    infix?: boolean;
    isLegacy?: boolean;
    isMalformed?: boolean;
    isMetaProperty?;
    isMultiline?: boolean;
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
