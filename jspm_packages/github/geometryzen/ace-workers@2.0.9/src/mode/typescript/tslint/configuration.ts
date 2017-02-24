/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { arrayify, objectify } from "./utils";

export interface IConfigurationFile {
    extends?: string | string[];
    jsRules?: { [name: string]: boolean | (boolean | string)[] };
    linterOptions?: {
        typeCheck?: boolean,
    };
    rulesDirectory?: string | string[];
    rules?: { [name: string]: boolean | (boolean | string)[] };
}

export interface IConfigurationLoadResult {
    path?: string;
    results?: IConfigurationFile;
}

export const CONFIG_FILENAME = "tslint.json";
/* tslint:disable:object-literal-key-quotes */
export const DEFAULT_CONFIG = {
    "extends": "tslint:recommended",
};
/* tslint:enable:object-literal-key-quotes */

export function extendConfigurationFile(targetConfig: IConfigurationFile,
    nextConfigSource: IConfigurationFile): IConfigurationFile {
    const combinedConfig: IConfigurationFile = {};

    const configRulesDirectory = arrayify(targetConfig.rulesDirectory);
    const nextConfigRulesDirectory = arrayify(nextConfigSource.rulesDirectory);
    combinedConfig.rulesDirectory = configRulesDirectory.concat(nextConfigRulesDirectory);

    const combineProperties = <T>(targetProperty: T, nextProperty: T): T => {
        const combinedProperty: any = {};
        for (const name of Object.keys(objectify(targetProperty))) {
            combinedProperty[name] = (<any>targetProperty)[name];
        }
        // next config source overwrites the target config object
        for (const name of Object.keys(objectify(nextProperty))) {
            combinedProperty[name] = (<any>nextProperty)[name];
        }
        return combinedProperty;
    };

    combinedConfig.rules = combineProperties(targetConfig.rules, nextConfigSource.rules);
    combinedConfig.jsRules = combineProperties(targetConfig.jsRules, nextConfigSource.jsRules);
    combinedConfig.linterOptions = combineProperties(targetConfig.linterOptions, nextConfigSource.linterOptions);

    return combinedConfig;
}
