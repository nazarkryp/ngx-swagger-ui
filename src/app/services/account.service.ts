import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Token } from 'app/models/common';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(
        private readonly httpClient: HttpClient) { }

    public signIn(username: string, password: string): Observable<any> {
        const data = `grant_type=password&username=${username}&password=${password}`;
        return this.httpClient.post<any>(environment.signinUri, data)
            .pipe(map(response => {
                const token = new Token();

                token.accessToken = response['access_token'];

                return token;
            }));
    }
}
