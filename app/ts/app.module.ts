import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EditorModule } from './editor/editor.module';
import { HttpModule } from '@angular/http';
import { UpgradeModule } from '@angular/upgrade/static';

// import { BackgroundService } from './services/background/background.service';
import { Base64Service } from './services/base64/base64.service';
import { CookieService } from './services/cookie/cookie.service';
import { CredentialsService } from './services/credentials/credentials.service';
import { DoodleManager } from './services/doodles/doodleManager.service';
import { GitHubGistService } from './services/github/github.gist.service';
import { GitHubRepoService } from './services/github/github.repo.service';
import { GitHubUserService } from './services/github/github.user.service';
import { JsModel } from './modules/jsmodel/JsModel';
// import { MonacoEditorService } from './services/editor/monaco-editor.service';
import { NativeEditorService } from './services/editor/native-editor.service';
import { OptionManager } from './services/options/optionManager.service';
import { RoomsService } from './modules/rooms/services/rooms.service';
import { UuidService } from './services/uuid/uuid.service';
import { WsModel } from './modules/wsmodel/WsModel';

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
        HttpModule,
        EditorModule,
        UpgradeModule
    ],
    // creators of services.
    providers: [
        // BackgroundService,
        Base64Service,
        CookieService,
        CredentialsService,
        DoodleManager,
        GitHubGistService,
        GitHubRepoService,
        GitHubUserService,
        JsModel,
        //      MonacoEditorService,
        NativeEditorService,
        OptionManager,
        RoomsService,
        UuidService,
        WsModel
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
    // Instead, we hybrid bootstrap in main.ts
    ngDoBootstrap() {
        // Do nothing yet.
    }
}
