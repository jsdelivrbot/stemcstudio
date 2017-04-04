import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

// import { BackgroundService } from './services/background/background.service';
import { Base64Service } from './services/base64/base64.service';
import { CookieService } from './services/cookie/cookie.service';
import { CredentialsService } from './services/credentials/credentials.service';
import { UuidService } from './services/uuid/uuid.service';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
    ],
    providers: [
        //         BackgroundService,
        Base64Service,
        CookieService,
        CredentialsService,
        UuidService
    ]
})
export class AppModule {
    ngDoBootstrap() {
        // Do nothing yet
    }
}
