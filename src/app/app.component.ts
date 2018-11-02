import { Component, OnInit } from '@angular/core';

import { SwaggerDataService } from './services';
import { Documentation } from './models/documentation';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public documentation: Documentation;

    constructor(
        private swaggerService: SwaggerDataService) { }

    public ngOnInit(): void {
        this.swaggerService.getScheme().subscribe(documentation => {
            this.documentation = documentation;
        });
    }
}
