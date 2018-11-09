import { Component, OnInit, Input } from '@angular/core';
import { Documentation, MethodGroup, Method, Response, Parameter } from 'app/models/documentation';
import { DialogService } from 'app/services';
import { BodyComponent } from '../shared/body/body.component';

@Component({
    selector: 'app-documentation',
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
    @Input('documentation')
    public documentation: Documentation;

    constructor(
        private readonly dialog: DialogService) { }

    public openBody(parameter: any) {
        this.dialog.open(BodyComponent, parameter);
    }
}
