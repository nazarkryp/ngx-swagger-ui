import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppMaterialModule } from './modules';
import { AppComponent } from './app.component';
import { MethodsFilterComponent } from './components/shared/methods-filter/methods-filter.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { FormatJsonPipe } from './pipes/format-json.pipe';
import { BodyComponent } from './components/shared/body/body.component';

@NgModule({
    declarations: [
        AppComponent,
        MethodsFilterComponent,
        DocumentationComponent,
        FormatJsonPipe,
        BodyComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FlexLayoutModule,
        AppMaterialModule
    ],
    entryComponents: [
        BodyComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
