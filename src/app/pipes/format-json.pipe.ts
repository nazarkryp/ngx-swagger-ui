import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatjson'
})
export class FormatJsonPipe implements PipeTransform {
    public transform(val) {
        return JSON.stringify(val, undefined, 4)
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br/>');
    }
}
