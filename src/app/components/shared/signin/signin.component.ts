import { Component } from '@angular/core';
import { AccountService } from 'app/services';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
    constructor(
        private readonly accountService: AccountService) { }

    public signIn() {
        this.accountService.signIn('EcosystemJob', 'eeb920fce8cb2d1527a5bd1874a1cdef')
            .subscribe();
    }
}
