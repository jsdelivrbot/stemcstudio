// Type definitions for @angular/core 4.0.3
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

export interface SchemaMetadata {
    name: string;
}

export interface NgModule {
    providers?: Provider[];
    declarations?: Array<Type<any> | any[]>;
    imports?: Array<Type<any> | ModuleWithProviders | any[]>;
    exports?: Array<Type<any> | any[]>;
    entryComponents?: Array<Type<any> | any[]>;
    bootstrap?: Array<Type<any> | any[]>;
    schemas?: Array<SchemaMetadata | any[]>;
    id?: string;
}

export declare type ClassDefinition = {
    extends?: Type<any>;
    constructor: Function | any[];
} & {
        [x: string]: Type<any> | Function | any[];
    };

export interface TypeDecorator {
    <T extends Type<any>>(type: T): T;
    (target: Object, propertyKey?: string | symbol, parameterIndex?: number): void;
    annotations: any[];
    Class(obj: ClassDefinition): Type<any>;
}

export interface NgModuleDecorator {
    (obj?: NgModule): TypeDecorator;
    new (obj?: NgModule): NgModule;
}

export declare const NgModule: NgModuleDecorator;

export interface DirectiveDecorator {
    (obj: Directive): TypeDecorator;
    new (obj: Directive): Directive;
}

export interface Directive {
    selector?: string;
    inputs?: string[];
    outputs?: string[];
    host?: {
        [key: string]: string;
    };
    providers?: Provider[];
    exportAs?: string;
    queries?: {
        [key: string]: any;
    };
}

export declare const Directive: DirectiveDecorator;

export interface ComponentDecorator {
    (obj: Component): TypeDecorator;
    new (obj: Component): Component;
}

export declare enum ChangeDetectionStrategy {
    OnPush = 0,
    Default = 1,
}

export declare enum ViewEncapsulation {
    Emulated = 0,
    Native = 1,
    None = 2,
}

export interface Component extends Directive {
    changeDetection?: ChangeDetectionStrategy;
    viewProviders?: Provider[];
    moduleId?: string;
    templateUrl?: string;
    template?: string;
    styleUrls?: string[];
    styles?: string[];
    animations?: any[];
    encapsulation?: ViewEncapsulation;
    interpolation?: [string, string];
    entryComponents?: Array<Type<any> | any[]>;
}

export declare const Component: ComponentDecorator;

export interface PipeDecorator {
    (obj: Pipe): TypeDecorator;
    new (obj: Pipe): Pipe;
}

export interface Pipe {
    name: string;
    pure?: boolean;
}

export declare const Pipe: PipeDecorator;

export interface InputDecorator {
    (bindingPropertyName?: string): any;
    new (bindingPropertyName?: string): any;
}

export interface Input {
    bindingPropertyName?: string;
}

export declare const Input: InputDecorator;

export interface OutputDecorator {
    (bindingPropertyName?: string): any;
    new (bindingPropertyName?: string): any;
}

export interface Output {
    bindingPropertyName?: string;
}

export declare const Output: OutputDecorator;

export interface HostBindingDecorator {
    (hostPropertyName?: string): any;
    new (hostPropertyName?: string): any;
}

export interface HostBinding {
    hostPropertyName?: string;
}

export declare const HostBinding: HostBindingDecorator;

export interface HostListenerDecorator {
    (eventName: string, args?: string[]): any;
    new (eventName: string, args?: string[]): any;
}

export interface HostListener {
    eventName?: string;
    args?: string[];
}

export declare const HostListener: HostListenerDecorator;

export declare class SimpleChange {
    previousValue: any;
    currentValue: any;
    firstChange: boolean;
    constructor(previousValue: any, currentValue: any, firstChange: boolean);
    isFirstChange(): boolean;
}

export interface SimpleChanges {
    [propName: string]: SimpleChange;
}

export interface OnChanges {
    ngOnChanges(changes: SimpleChanges): void;
}

export interface OnInit {
    ngOnInit(): void;
}

export interface DoCheck {
    ngDoCheck(): void;
}

export interface OnDestroy {
    ngOnDestroy(): void;
}

export interface AfterContentInit {
    ngAfterContentInit(): void;
}

export interface AfterContentChecked {
    ngAfterContentChecked(): void;
}

export interface AfterViewInit {
    ngAfterViewInit(): void;
}

export interface AfterViewChecked {
    ngAfterViewChecked(): void;
}

export interface Injectable {
}

export interface InjectableDecorator {
    (): any;
    new (): Injectable;
}

export declare const Injectable: InjectableDecorator;

