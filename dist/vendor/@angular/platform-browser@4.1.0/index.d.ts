// Type definitions for @angular/platform-browser 4.1.0
// Project: tsCodeHub
// Definitions by: David Geo Holmes <david.geo.holmes@gmail.com>

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export declare const Type: FunctionConstructor;
export declare function isType(v: any): v is Type<any>;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}


export interface TypeProvider extends Type<any> {
}

export interface ValueProvider {
    provide: any;
    useValue: any;
    multi?: boolean;
}

export interface ClassProvider {
    provide: any;
    useClass: Type<any>;
    multi?: boolean;
}

export interface ExistingProvider {
    provide: any;
    useExisting: any;
    multi?: boolean;
}

export interface FactoryProvider {
    provide: any;
    useFactory: Function;
    deps?: any[];
    multi?: boolean;
}

export declare type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider | any[];

export interface ModuleWithProviders {
    ngModule: Type<any>;
    providers?: Provider[];
}

export declare class BrowserModule {
    constructor(parentModule: BrowserModule);
    static withServerTransition(params: {
        appId: string;
    }): ModuleWithProviders;
}
