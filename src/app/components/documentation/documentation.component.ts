import { Component, OnInit, Input } from '@angular/core';
import { Documentation } from 'app/models/documentation';

@Component({
    selector: 'app-documentation',
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
    @Input('documentation')
    public documentation: Documentation;
}
