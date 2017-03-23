import * as angular from 'angular';

/**
 * The translation gateway is a remote REST server that
 */
export interface ITranslateGateway {
    translate(input: string): angular.IPromise<string>;
}

export interface ITranslateGatewayProvider extends angular.IServiceProvider {
    /**
     * 
     */
    path: string;
}

export interface ITranslateService {
    directivePriority: number;
    isKeepContent(): boolean;
    isPostCompilingEnabled(): boolean;
    translate(input: string): angular.IPromise<string>;
    uses(langKey: string): void;
}

export interface ITranslationTable {
    [key: string]: string;
}

/**
 * Allows the translation service to be configured in the application configuration step.
 */
export interface ITranslateServiceProvider extends angular.IServiceProvider {
    /**
     * The source language is static and is determined by the application developer.
     * This parameter will be injected into the service upon construction.
     * It is used to indicate the language that the application from which we translate.
     */
    sourceLanguage: string;
    /**
     * 
     */
    translations(target: string, translationTable: ITranslationTable): ITranslateServiceProvider;
    /**
     * 
     */
    useLocalStorage(): void;
}

/**
 * The inique identifier for the translate gateway.
 */
export const TRANSLATE_GATEWAY_UUID = 'translateGateway';
/**
 * I think it is an Angular behavior to build the provider name this way?
 */
export const TRANSLATE_GATEWAY_PROVIDER_UUID = `${TRANSLATE_GATEWAY_UUID}Provider`;

/**
 * The inique identifier for the translate service.
 */
export const TRANSLATE_SERVICE_UUID = 'translateService';
/**
 * I think it is an Angular behavior to build the provider name this way?
 */
export const TRANSLATE_SERVICE_PROVIDER_UUID = `${TRANSLATE_SERVICE_UUID}Provider`;
