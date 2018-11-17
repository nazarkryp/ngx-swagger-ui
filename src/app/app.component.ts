import { Component, OnInit, ViewChild } from '@angular/core';

import { SwaggerDataService, DialogService } from './services';
import { Documentation } from './models/documentation';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';
import { SigninComponent } from './components/shared';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public documentation: Documentation;

    @ViewChild('sidenav')
    private sidenav: MatSidenav;

    constructor(
        private readonly observer: BreakpointObserver,
        private readonly dialog: DialogService,
        private readonly swaggerService: SwaggerDataService) {
    }

    public signIn() {
        this.dialog.open(SigninComponent, null);
    }

    public ngOnInit(): void {
        this.sidenav.mode = 'over';
        this.swaggerService.getScheme()
            .subscribe(documentation => {
                this.documentation = documentation;
            });

        this.observer.observe('(min-width: 1000px)')
            .subscribe(state => {
                this.sidenav.opened = state.matches;
                this.sidenav.mode = state.matches ? 'side' : 'over';
            });
    }
}
