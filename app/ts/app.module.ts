import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditorModule } from './editor/editor.module';

// import { BackgroundService } from './services/background/background.service';
import { Base64Service } from './services/base64/base64.service';
import { CookieService } from './services/cookie/cookie.service';
import { CredentialsService } from './services/credentials/credentials.service';
import { OptionManager } from './services/options/optionManager.service';
import { UuidService } from './services/uuid/uuid.service';

import { AppComponent } from './app.component';
import { BrandComponent } from './directives/brand/brand.component';

//
// For hybrid bootstrapping, remove the bootstrap property and override ngDoBootstrap.
// Don't forget to enable hybrid bootstrapping in main.ts
//
@NgModule({
    // imports are module dependencies.
    imports: [
        BrowserModule,
        UpgradeModule,
        EditorModule
    ],
    // creators of services.
    providers: [
        //         BackgroundService,
        Base64Service,
        CookieService,
        CredentialsService,
        OptionManager,
        UuidService
    ],
    // the view classes are either component, directive, or pipe dependencies.
    declarations: [
        AppComponent,
        BrandComponent
    ],
    // there is no boostrap because we are hybrid bootstrapping.
    // bootstrap: [AppComponent],
    // stuff used by AngularJS
    entryComponents: [
        BrandComponent
    ]
})
export class AppModule {
    // Prevent Angular from bootstrapping itself using an empty method.
    // Instead, we hybrid bootstrap in bootstrap.ts
    ngDoBootstrap() {
        // Do nothing yet.
    }
}
