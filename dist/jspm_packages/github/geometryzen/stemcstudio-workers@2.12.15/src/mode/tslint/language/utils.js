System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createCompilerOptions() {
        return {
            allowJs: true,
            noResolve: true,
            target: ts.ScriptTarget.ES5,
        };
    }
    exports_1("createCompilerOptions", createCompilerOptions);
    function doesIntersect(failure, disabledIntervals) {
        return disabledIntervals.some(function (interval) {
            var maxStart = Math.max(interval.startPosition, failure.getStartPosition().getPosition());
            var minEnd = Math.min(interval.endPosition, failure.getEndPosition().getPosition());
            return maxStart <= minEnd;
        });
    }
    exports_1("doesIntersect", doesIntersect);
    function scanAllTokens(scanner, callback) {
        var lastStartPos = -1;
        while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
            var startPos = scanner.getStartPos();
            if (startPos === lastStartPos) {
                break;
            }
            lastStartPos = startPos;
            callback(scanner);
        }
    }
    exports_1("scanAllTokens", scanAllTokens);
    function hasModifier(modifiers) {
        var modifierKinds = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifierKinds[_i - 1] = arguments[_i];
        }
        if (modifiers === undefined || modifierKinds.length === 0) {
            return false;
        }
        return modifiers.some(function (m) {
            return modifierKinds.some(function (k) { return m.kind === k; });
        });
    }
    exports_1("hasModifier", hasModifier);
    function isBlockScopedVariable(node) {
        var parentNode = (node.kind === ts.SyntaxKind.VariableDeclaration)
            ? node.parent
            : node.declarationList;
        return isNodeFlagSet(parentNode, ts.NodeFlags.Let) || isNodeFlagSet(parentNode, ts.NodeFlags.Const);
    }
    exports_1("isBlockScopedVariable", isBlockScopedVariable);
    function isBlockScopedBindingElement(node) {
        var variableDeclaration = getBindingElementVariableDeclaration(node);
        return (variableDeclaration == null) || isBlockScopedVariable(variableDeclaration);
    }
    exports_1("isBlockScopedBindingElement", isBlockScopedBindingElement);
    function getBindingElementVariableDeclaration(node) {
        var currentParent = node.parent;
        while (currentParent.kind !== ts.SyntaxKind.VariableDeclaration) {
            if (currentParent.parent == null) {
                return null;
            }
            else {
                currentParent = currentParent.parent;
            }
        }
        return currentParent;
    }
    exports_1("getBindingElementVariableDeclaration", getBindingElementVariableDeclaration);
    function childOfKind(node, kind) {
        return node.getChildren().find(function (child) { return child.kind === kind; });
    }
    exports_1("childOfKind", childOfKind);
    function someAncestor(node, predicate) {
        return predicate(node) || (node.parent != null && someAncestor(node.parent, predicate));
    }
    exports_1("someAncestor", someAncestor);
    function isAssignment(node) {
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            var binaryExpression = node;
            return binaryExpression.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
                && binaryExpression.operatorToken.kind <= ts.SyntaxKind.LastAssignment;
        }
        else {
            return false;
        }
    }
    exports_1("isAssignment", isAssignment);
    function isNodeFlagSet(node, flagToCheck) {
        return (node.flags & flagToCheck) !== 0;
    }
    exports_1("isNodeFlagSet", isNodeFlagSet);
    function isCombinedNodeFlagSet(node, flagToCheck) {
        return (ts.getCombinedNodeFlags(node) & flagToCheck) !== 0;
    }
    exports_1("isCombinedNodeFlagSet", isCombinedNodeFlagSet);
    function isCombinedModifierFlagSet(node, flagToCheck) {
        return (ts.getCombinedModifierFlags(node) & flagToCheck) !== 0;
    }
    exports_1("isCombinedModifierFlagSet", isCombinedModifierFlagSet);
    function isTypeFlagSet(type, flagToCheck) {
        return (type.flags & flagToCheck) !== 0;
    }
    exports_1("isTypeFlagSet", isTypeFlagSet);
    function isSymbolFlagSet(symbol, flagToCheck) {
        return (symbol.flags & flagToCheck) !== 0;
    }
    exports_1("isSymbolFlagSet", isSymbolFlagSet);
    function isObjectFlagSet(objectType, flagToCheck) {
        return (objectType.objectFlags & flagToCheck) !== 0;
    }
    exports_1("isObjectFlagSet", isObjectFlagSet);
    function isNestedModuleDeclaration(decl) {
        return decl.name.pos === decl.pos;
    }
    exports_1("isNestedModuleDeclaration", isNestedModuleDeclaration);
    function unwrapParentheses(node) {
        while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
            node = node.expression;
        }
        return node;
    }
    exports_1("unwrapParentheses", unwrapParentheses);
    function isScopeBoundary(node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.FunctionExpression
            || node.kind === ts.SyntaxKind.PropertyAssignment
            || node.kind === ts.SyntaxKind.ShorthandPropertyAssignment
            || node.kind === ts.SyntaxKind.MethodDeclaration
            || node.kind === ts.SyntaxKind.Constructor
            || node.kind === ts.SyntaxKind.ModuleDeclaration
            || node.kind === ts.SyntaxKind.ArrowFunction
            || node.kind === ts.SyntaxKind.ParenthesizedExpression
            || node.kind === ts.SyntaxKind.ClassDeclaration
            || node.kind === ts.SyntaxKind.ClassExpression
            || node.kind === ts.SyntaxKind.InterfaceDeclaration
            || node.kind === ts.SyntaxKind.GetAccessor
            || node.kind === ts.SyntaxKind.SetAccessor
            || node.kind === ts.SyntaxKind.SourceFile && ts.isExternalModule(node);
    }
    exports_1("isScopeBoundary", isScopeBoundary);
    function isBlockScopeBoundary(node) {
        return isScopeBoundary(node)
            || node.kind === ts.SyntaxKind.Block
            || isLoop(node)
            || node.kind === ts.SyntaxKind.WithStatement
            || node.kind === ts.SyntaxKind.SwitchStatement
            || node.parent !== undefined
                && (node.parent.kind === ts.SyntaxKind.TryStatement
                    || node.parent.kind === ts.SyntaxKind.IfStatement);
    }
    exports_1("isBlockScopeBoundary", isBlockScopeBoundary);
    function isLoop(node) {
        return node.kind === ts.SyntaxKind.DoStatement
            || node.kind === ts.SyntaxKind.WhileStatement
            || node.kind === ts.SyntaxKind.ForStatement
            || node.kind === ts.SyntaxKind.ForInStatement
            || node.kind === ts.SyntaxKind.ForOfStatement;
    }
    exports_1("isLoop", isLoop);
    function forEachToken(node, skipTrivia, cb, filter) {
        var sourceFile = node.getSourceFile();
        var fullText = sourceFile.text;
        var iterateFn = filter === undefined ? iterateChildren : iterateWithFilter;
        var handleTrivia = skipTrivia ? undefined : createTriviaHandler(sourceFile, cb);
        iterateFn(node);
        function iterateWithFilter(child) {
            if (filter(child)) {
                return iterateChildren(child);
            }
        }
        function iterateChildren(child) {
            if (child.kind < ts.SyntaxKind.FirstNode ||
                child.kind === ts.SyntaxKind.JsxText) {
                return callback(child);
            }
            if (child.kind !== ts.SyntaxKind.JSDocComment) {
                return child.getChildren(sourceFile).forEach(iterateFn);
            }
        }
        function callback(token) {
            var tokenStart = token.getStart(sourceFile);
            if (!skipTrivia && tokenStart !== token.pos) {
                handleTrivia(token.pos, tokenStart, token);
            }
            return cb(fullText, token.kind, { tokenStart: tokenStart, fullStart: token.pos, end: token.end }, token.parent);
        }
    }
    exports_1("forEachToken", forEachToken);
    function createTriviaHandler(sourceFile, cb) {
        var fullText = sourceFile.text;
        var scanner = ts.createScanner(sourceFile.languageVersion, false, sourceFile.languageVariant, fullText);
        function handleTrivia(start, end, token) {
            var parent = token.parent;
            if (!canHaveLeadingTrivia(token.kind, parent)) {
                return;
            }
            scanner.setTextPos(start);
            var position;
            do {
                var kind = scanner.scan();
                position = scanner.getTextPos();
                cb(fullText, kind, { tokenStart: scanner.getTokenPos(), end: position, fullStart: start }, parent);
            } while (position < end);
        }
        return handleTrivia;
    }
    function forEachComment(node, cb) {
        return forEachToken(node, true, function (fullText, tokenKind, pos, parent) {
            if (canHaveLeadingTrivia(tokenKind, parent)) {
                var comments = ts.getLeadingCommentRanges(fullText, pos.fullStart);
                if (comments !== undefined) {
                    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
                        var comment = comments_1[_i];
                        cb(fullText, comment.kind, { fullStart: pos.fullStart, tokenStart: comment.pos, end: comment.end });
                    }
                }
            }
            if (canHaveTrailingTrivia(tokenKind, parent)) {
                var comments = ts.getTrailingCommentRanges(fullText, pos.end);
                if (comments !== undefined) {
                    for (var _a = 0, comments_2 = comments; _a < comments_2.length; _a++) {
                        var comment = comments_2[_a];
                        cb(fullText, comment.kind, { fullStart: pos.fullStart, tokenStart: comment.pos, end: comment.end });
                    }
                }
            }
        });
    }
    exports_1("forEachComment", forEachComment);
    function canHaveLeadingTrivia(tokenKind, parent) {
        if (tokenKind === ts.SyntaxKind.JsxText) {
            return false;
        }
        if (tokenKind === ts.SyntaxKind.OpenBraceToken) {
            return parent.kind !== ts.SyntaxKind.JsxExpression || parent.parent.kind !== ts.SyntaxKind.JsxElement;
        }
        if (tokenKind === ts.SyntaxKind.LessThanToken) {
            if (parent.kind === ts.SyntaxKind.JsxClosingElement) {
                return false;
            }
            if (parent.kind === ts.SyntaxKind.JsxOpeningElement || parent.kind === ts.SyntaxKind.JsxSelfClosingElement) {
                return parent.parent.parent.kind !== ts.SyntaxKind.JsxElement;
            }
        }
        return true;
    }
    function canHaveTrailingTrivia(tokenKind, parent) {
        if (tokenKind === ts.SyntaxKind.JsxText) {
            return false;
        }
        if (tokenKind === ts.SyntaxKind.CloseBraceToken) {
            return parent.kind !== ts.SyntaxKind.JsxExpression || parent.parent.kind !== ts.SyntaxKind.JsxElement;
        }
        if (tokenKind === ts.SyntaxKind.GreaterThanToken) {
            if (parent.kind === ts.SyntaxKind.JsxOpeningElement) {
                return false;
            }
            if (parent.kind === ts.SyntaxKind.JsxClosingElement || parent.kind === ts.SyntaxKind.JsxSelfClosingElement) {
                return parent.parent.parent.kind !== ts.SyntaxKind.JsxElement;
            }
        }
        return true;
    }
    function hasCommentAfterPosition(text, position) {
        return ts.getTrailingCommentRanges(text, position) !== undefined ||
            ts.getLeadingCommentRanges(text, position) !== undefined;
    }
    exports_1("hasCommentAfterPosition", hasCommentAfterPosition);
    function getEqualsKind(node) {
        switch (node.kind) {
            case ts.SyntaxKind.EqualsEqualsToken:
                return { isPositive: true, isStrict: false };
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                return { isPositive: true, isStrict: true };
            case ts.SyntaxKind.ExclamationEqualsToken:
                return { isPositive: false, isStrict: false };
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                return { isPositive: false, isStrict: true };
            default:
                return undefined;
        }
    }
    exports_1("getEqualsKind", getEqualsKind);
    return {
        setters: [],
        execute: function () {
        }
    };
});
