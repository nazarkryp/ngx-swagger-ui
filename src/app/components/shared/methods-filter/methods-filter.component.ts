import { Component, Input } from '@angular/core';
import { Documentation } from 'app/models/documentation';

@Component({
    selector: 'app-methods-filter',
    templateUrl: './methods-filter.component.html',
    styleUrls: ['./methods-filter.component.scss']
})
export class MethodsFilterComponent {
    @Input('documentation')
    public documentation: Documentation;
}
