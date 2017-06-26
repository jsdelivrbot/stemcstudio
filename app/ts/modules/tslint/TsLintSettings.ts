export type RuleArgumentType = boolean | number | string | object;

/**
 * This corresponds to IConfigurationFile in the tslint worker code.
 */
export interface TsLintSettings {
    extends?: string | string[];
    jsRules?: { [name: string]: boolean | RuleArgumentType[] };
    linterOptions?: {
        typeCheck?: boolean,
    };
    rulesDirectory?: string | string[];
    rules?: { [name: string]: boolean | RuleArgumentType[] };
}
