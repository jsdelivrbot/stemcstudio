
export interface ParamMap {
    has(name: string): boolean;
    /**
     * Return a single value for the given parameter name:
     * - the value when the parameter has a single value,
     * - the first value if the parameter has multiple values,
     * - `null` when there is no such parameter.
     */
    get(name: string): string | null;
    /**
     * Return an array of values for the given parameter name.
     *
     * If there is no such parameter, an empty array is returned.
     */
    getAll(name: string): string[];
    /** Name of the parameters */
    readonly keys: string[];
}

export declare class UrlSegment {
    /** The path part of a URL segment */
    path: string;
    /** The matrix parameters associated with a segment */
    parameters: {
        [name: string]: string;
    };
    constructor(
        /** The path part of a URL segment */
        path: string,
        /** The matrix parameters associated with a segment */
        parameters: {
            [name: string]: string;
        });
    readonly parameterMap: ParamMap;
    /** @docsNotRequired */
    toString(): string;
}

export declare class UrlSegmentGroup {
    /** The URL segments of this group. See {@link UrlSegment} for more information */
    segments: UrlSegment[];
    /** The list of children of this group */
    children: {
        [key: string]: UrlSegmentGroup;
    };
    /** The parent node in the url tree */
    parent: UrlSegmentGroup | null;
    constructor(
        /** The URL segments of this group. See {@link UrlSegment} for more information */
        segments: UrlSegment[],
        /** The list of children of this group */
        children: {
            [key: string]: UrlSegmentGroup;
        });
    /** Wether the segment has child segments */
    hasChildren(): boolean;
    /** Number of child segments */
    readonly numberOfChildren: number;
    /** @docsNotRequired */
    toString(): string;
}
export declare type UrlMatchResult = {
    consumed: UrlSegment[];
    posParams?: {
        [name: string]: UrlSegment;
    };
};

export declare type UrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => UrlMatchResult;

export declare const Type: FunctionConstructor;
export declare function isType(v: any): v is Type<any>;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

export declare type Data = {
    [name: string]: any;
};

export declare type ResolveData = {
    [name: string]: any;
};

export declare type LoadChildrenCallback = () => Type<any> | NgModuleFactory<any> | Promise<Type<any>> | Observable<Type<any>>;

export declare type LoadChildren = string | LoadChildrenCallback;

export interface Route {
    path?: string;
    pathMatch?: string;
    matcher?: UrlMatcher;
    component?: Type<any>;
    redirectTo?: string;
    outlet?: string;
    canActivate?: any[];
    canActivateChild?: any[];
    canDeactivate?: any[];
    canLoad?: any[];
    data?: Data;
    resolve?: ResolveData;
    children?: Routes;
    loadChildren?: LoadChildren;
    runGuardsAndResolvers?: RunGuardsAndResolvers;
}

export declare type Routes = Route[];

export declare class Router {
    private rootComponentType;
    private urlSerializer;
    private outletMap;
    private location;
    config: Routes;
    private currentUrlTree;
    private rawUrlTree;
    private navigations;
    private routerEvents;
    private currentRouterState;
    private locationSubscription;
    private navigationId;
    private configLoader;
    private ngModule;
    /**
     * Error handler that is invoked when a navigation errors.
     *
     * See {@link ErrorHandler} for more information.
     */
    errorHandler: ErrorHandler;
    /**
     * Indicates if at least one navigation happened.
     */
    navigated: boolean;
    /**
     * Extracts and merges URLs. Used for AngularJS to Angular migrations.
     */
    urlHandlingStrategy: UrlHandlingStrategy;
    routeReuseStrategy: RouteReuseStrategy;
    /**
     * Creates the router service.
     */
    constructor(rootComponentType: Type<any> | null, urlSerializer: UrlSerializer, outletMap: RouterOutletMap, location: Location, injector: Injector, loader: NgModuleFactoryLoader, compiler: Compiler, config: Routes);
    /**
     * Sets up the location change listener and performs the initial navigation.
     */
    initialNavigation(): void;
    /**
     * Sets up the location change listener.
     */
    setUpLocationChangeListener(): void;
    /** The current route state */
    readonly routerState: RouterState;
    /** The current url */
    readonly url: string;
    /** An observable of router events */
    readonly events: Observable<Event>;
    /**
     * Resets the configuration used for navigation and generating links.
     *
     * ### Usage
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     */
    resetConfig(config: Routes): void;
    /** @docsNotRequired */
    ngOnDestroy(): void;
    /** Disposes of the router */
    dispose(): void;
    /**
     * Applies an array of commands to the current url tree and creates a new url tree.
     *
     * When given an activate route, applies the given commands starting from the route.
     * When not given a route, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it, you
     * // can do the following:
     *
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     * ```
     */
    createUrlTree(commands: any[], { relativeTo, queryParams, fragment, preserveQueryParams, queryParamsHandling, preserveFragment }?: NavigationExtras): UrlTree;
    /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * In opposite to `navigate`, `navigateByUrl` takes a whole URL
     * and does not apply any delta to the current one.
     */
    navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean>;
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
     * URL.
     */
    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>;
    /** Serializes a {@link UrlTree} into a string */
    serializeUrl(url: UrlTree): string;
    /** Parses a string into a {@link UrlTree} */
    parseUrl(url: string): UrlTree;
    /** Returns whether the url is activated */
    isActive(url: string | UrlTree, exact: boolean): boolean;
    private removeEmptyProps(params);
    private processNavigations();
    private scheduleNavigation(rawUrl, source, extras);
    private executeScheduledNavigation({ id, rawUrl, extras, resolve, reject });
    private runNavigate(url, rawUrl, shouldPreventPushState, shouldReplaceUrl, id, precreatedState);
    private resetUrlToCurrentUrlTree();
}

export declare class RouterModule {
    constructor(guard: any, router: Router);
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders;
    static forChild(routes: Routes): ModuleWithProviders;
}
