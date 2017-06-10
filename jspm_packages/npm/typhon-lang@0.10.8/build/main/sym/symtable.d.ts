import { SymbolTable } from './SymbolTable';
import { Module } from '../ast/types';
import { Statement } from '../ast/types';
import { Range } from '../common/Range';
/**
 * Creates a SymbolTable for the specified Module.
 */
export declare function semanticsOfModule(mod: Module): SymbolTable;
export declare function symbolTableFromStatements(stmts: Statement[]): SymbolTable;
export interface SymbolInfo {
    get_name(): string;
    is_referenced(): boolean;
    is_imported(): boolean;
    is_parameter(): boolean;
    is_global(): boolean;
    is_declared_global(): boolean;
    is_local(): boolean;
    is_free(): boolean;
    is_assigned(): boolean;
    is_namespace(): boolean;
    get_namespaces(): SymbolObj[];
}
export interface SymbolObj {
    get_type(): string;
    get_name(): string;
    get_range(): Range;
    is_nested(): boolean;
    has_children(): boolean;
    get_methods(): string[];
    get_parameters(): string[];
    get_locals(): string[];
    get_globals(): string[];
    get_frees(): string[];
    get_identifiers(): string[];
    lookup(identifier: string): SymbolInfo;
}
/**
 * Provides a textual representation of the SymbolTable.
 */
export declare function dumpSymbolTable(st: SymbolTable): string;
