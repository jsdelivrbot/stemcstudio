
import { Compiler, ErrorHandler, ModuleWithProviders, NgModuleFactory, NgModuleFactoryLoader, OnDestroy } from '@angular/core'
import { ComponentRef, ComponentFactoryResolver, EventEmitter, Injector, ResolvedReflectiveProvider, ViewContainerRef } from '@angular/core'
import { Observable } from 'rxjs/Observable';

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

export declare type RunGuardsAndResolvers = 'paramsChange' | 'paramsOrQueryParamsChange' | 'always';

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

export declare class UrlTree {
    /** The root segment group of the URL tree */
    root: UrlSegmentGroup;
    /** The query params of the URL */
    queryParams: {
        [key: string]: string;
    };
    /** The fragment of the URL */
    fragment: string | null;
    readonly queryParamMap: ParamMap;
    /** @docsNotRequired */
    toString(): string;
}

export declare abstract class UrlHandlingStrategy {
    /**
     * Tells the router if this URL should be processed.
     *
     * When it returns true, the router will execute the regular navigation.
     * When it returns false, the router will set the router state to an empty state.
     * As a result, all the active components will be destroyed.
     *
     */
    abstract shouldProcessUrl(url: UrlTree): boolean;
    /**
     * Extracts the part of the URL that should be handled by the router.
     * The rest of the URL will remain untouched.
     */
    abstract extract(url: UrlTree): UrlTree;
    /**
     * Merges the URL fragment with the rest of the URL.
     */
    abstract merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree;
}

export declare type DetachedRouteHandle = {};

export declare abstract class RouteReuseStrategy {
    /** Determines if this route (and its subtree) should be detached to be reused later */
    abstract shouldDetach(route: ActivatedRouteSnapshot): boolean;
    /** Stores the detached route */
    abstract store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void;
    /** Determines if this route (and its subtree) should be reattached */
    abstract shouldAttach(route: ActivatedRouteSnapshot): boolean;
    /** Retrieves the previously stored route */
    abstract retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null;
    /** Determines if a route should be reused */
    abstract shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean;
}

export declare abstract class UrlSerializer {
    /** Parse a url into a {@link UrlTree} */
    abstract parse(url: string): UrlTree;
    /** Converts a {@link UrlTree} into a url */
    abstract serialize(tree: UrlTree): string;
}

export declare class RouterOutlet implements OnDestroy {
    private parentOutletMap;
    private location;
    private resolver;
    private name;
    private activated;
    private _activatedRoute;
    outletMap: RouterOutletMap;
    activateEvents: EventEmitter<any>;
    deactivateEvents: EventEmitter<any>;
    constructor(parentOutletMap: RouterOutletMap, location: ViewContainerRef, resolver: ComponentFactoryResolver, name: string);
    ngOnDestroy(): void;
    /** @deprecated since v4 **/
    readonly locationInjector: Injector;
    /** @deprecated since v4 **/
    readonly locationFactoryResolver: ComponentFactoryResolver;
    readonly isActivated: boolean;
    readonly component: Object;
    readonly activatedRoute: ActivatedRoute;
    detach(): ComponentRef<any>;
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void;
    deactivate(): void;
    /** @deprecated since v4, use {@link activateWith} */
    activate(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver, injector: Injector, providers: ResolvedReflectiveProvider[], outletMap: RouterOutletMap): void;
    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null, outletMap: RouterOutletMap): void;
}

export declare class RouterOutletMap {
    /**
     * Adds an outlet to this map.
     */
    registerOutlet(name: string, outlet: RouterOutlet): void;
    /**
     * Removes an outlet from this map.
     */
    removeOutlet(name: string): void;
}

export declare class Tree<T> {
    constructor(root: TreeNode<T>);
    readonly root: T;
}

export declare class TreeNode<T> {
    value: T;
    children: TreeNode<T>[];
    constructor(value: T, children: TreeNode<T>[]);
    toString(): string;
}

export declare class RouterStateSnapshot extends Tree<ActivatedRouteSnapshot> {
    /** The url from which this snapshot was created */
    url: string;
    toString(): string;
}

export declare class RouterState extends Tree<ActivatedRoute> {
    /** The current snapshot of the router state */
    snapshot: RouterStateSnapshot;
    toString(): string;
}

export declare type QueryParamsHandling = 'merge' | 'preserve' | '';

export interface NavigationExtras {
    /**
    * Enables relative navigation from the current ActivatedRoute.
    *
    * Configuration:
    *
    * ```
    * [{
    *   path: 'parent',
    *   component: ParentComponent,
    *   children: [{
    *     path: 'list',
    *     component: ListComponent
    *   },{
    *     path: 'child',
    *     component: ChildComponent
    *   }]
    * }]
    * ```
    *
    * Navigate to list route from child route:
    *
    * ```
    *  @Component({...})
    *  class ChildComponent {
    *    constructor(private router: Router, private route: ActivatedRoute) {}
    *
    *    go() {
    *      this.router.navigate(['../list'], { relativeTo: this.route });
    *    }
    *  }
    * ```
    */
    relativeTo?: ActivatedRoute | null;
    /**
    * Sets query parameters to the URL.
    *
    * ```
    * // Navigate to /results?page=1
    * this.router.navigate(['/results'], { queryParams: { page: 1 } });
    * ```
    */
    queryParams?: Params | null;
    /**
    * Sets the hash fragment for the URL.
    *
    * ```
    * // Navigate to /results#top
    * this.router.navigate(['/results'], { fragment: 'top' });
    * ```
    */
    fragment?: string;
    /**
    * Preserves the query parameters for the next navigation.
    *
    * deprecated, use `queryParamsHandling` instead
    *
    * ```
    * // Preserve query params from /results?page=1 to /view?page=1
    * this.router.navigate(['/view'], { preserveQueryParams: true });
    * ```
    *
    * @deprecated since v4
    */
    preserveQueryParams?: boolean;
    /**
    *  config strategy to handle the query parameters for the next navigation.
    *
    * ```
    * // from /results?page=1 to /view?page=1&page=2
    * this.router.navigate(['/view'], { queryParams: { page: 2 },  queryParamsHandling: "merge" });
    * ```
    */
    queryParamsHandling?: QueryParamsHandling | null;
    /**
    * Preserves the fragment for the next navigation
    *
    * ```
    * // Preserve fragment from /results#top to /view#top
    * this.router.navigate(['/view'], { preserveFragment: true });
    * ```
    */
    preserveFragment?: boolean;
    /**
    * Navigates without pushing a new state into history.
    *
    * ```
    * // Navigate silently to /view
    * this.router.navigate(['/view'], { skipLocationChange: true });
    * ```
    */
    skipLocationChange?: boolean;
    /**
    * Navigates while replacing the current state in history.
    *
    * ```
    * // Navigate to /view
    * this.router.navigate(['/view'], { replaceUrl: true });
    * ```
    */
    replaceUrl?: boolean;
}

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

export declare type InitialNavigation = true | false | 'enabled' | 'disabled' | 'legacy_enabled' | 'legacy_disabled';

export interface ExtraOptions {
    /**
     * Makes the router log all its internal events to the console.
     */
    enableTracing?: boolean;
    /**
     * Enables the location strategy that uses the URL fragment instead of the history API.
     */
    useHash?: boolean;
    /**
     * Disables the initial navigation.
     */
    initialNavigation?: InitialNavigation;
    /**
     * A custom error handler.
     */
    errorHandler?: ErrorHandler;
    /**
     * Configures a preloading strategy. See {@link PreloadAllModules}.
     */
    preloadingStrategy?: any;
}

export declare class RouterModule {
    constructor(guard: any, router: Router);
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders;
    static forChild(routes: Routes): ModuleWithProviders;
}

export declare type Params = {
    [key: string]: any;
};

export declare class ActivatedRouteSnapshot {
    /** The URL segments matched by this route */
    url: UrlSegment[];
    /** The matrix parameters scoped to this route */
    params: Params;
    /** The query parameters shared by all the routes */
    queryParams: Params;
    /** The URL fragment shared by all the routes */
    fragment: string;
    /** The static and resolved data of this route */
    data: Data;
    /** The outlet name of the route */
    outlet: string;
    /** The component of the route */
    component: Type<any> | string | null;
    /** The configuration used to match this route */
    readonly routeConfig: Route | null;
    /** The root of the router state */
    readonly root: ActivatedRouteSnapshot;
    /** The parent of this route in the router state tree */
    readonly parent: ActivatedRouteSnapshot | null;
    /** The first child of this route in the router state tree */
    readonly firstChild: ActivatedRouteSnapshot | null;
    /** The children of this route in the router state tree */
    readonly children: ActivatedRouteSnapshot[];
    /** The path from the root of the router state tree to this route */
    readonly pathFromRoot: ActivatedRouteSnapshot[];
    readonly paramMap: ParamMap;
    readonly queryParamMap: ParamMap;
    toString(): string;
}

export declare class ActivatedRoute {
    /** An observable of the URL segments matched by this route */
    url: Observable<UrlSegment[]>;
    /** An observable of the matrix parameters scoped to this route */
    params: Observable<Params>;
    /** An observable of the query parameters shared by all the routes */
    queryParams: Observable<Params>;
    /** An observable of the URL fragment shared by all the routes */
    fragment: Observable<string>;
    /** An observable of the static and resolved data of this route. */
    data: Observable<Data>;
    /** The outlet name of the route. It's a constant */
    outlet: string;
    /** The component of the route. It's a constant */
    component: Type<any> | string | null;
    /** The current snapshot of this route */
    snapshot: ActivatedRouteSnapshot;
    /** The configuration used to match this route */
    readonly routeConfig: Route | null;
    /** The root of the router state */
    readonly root: ActivatedRoute;
    /** The parent of this route in the router state tree */
    readonly parent: ActivatedRoute | null;
    /** The first child of this route in the router state tree */
    readonly firstChild: ActivatedRoute | null;
    /** The children of this route in the router state tree */
    readonly children: ActivatedRoute[];
    /** The path from the root of the router state tree to this route */
    readonly pathFromRoot: ActivatedRoute[];
    readonly paramMap: Observable<ParamMap>;
    readonly queryParamMap: Observable<ParamMap>;
    toString(): string;
}
