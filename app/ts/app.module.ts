import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditorModule } from './editor/editor.module';

// import { BackgroundService } from './services/background/background.service';
import { Base64Service } from './services/base64/base64.service';
import { CookieService } from './services/cookie/cookie.service';
import { CredentialsService } from './services/credentials/credentials.service';
import { UuidService } from './services/uuid/uuid.service';

import { BrandComponent } from './directives/brand/brand.component';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        EditorModule
    ],
    providers: [
        //         BackgroundService,
        Base64Service,
        CookieService,
        CredentialsService,
        UuidService
    ],
    declarations: [
        BrandComponent
    ],
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
