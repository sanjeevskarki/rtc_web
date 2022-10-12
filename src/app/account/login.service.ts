import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserStatus } from './login.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    endpoint_url: string = environment.ENDPOINT;
    constructor(private http: HttpClient) { }

    login(userId: string): Observable<UserStatus> {
        return this.http.get(this.endpoint_url + 'login/'+userId, httpOptions);
    }

    // register(username: string, email: string, password: string): Observable<any> {
    //     return this.http.post(AUTH_API + 'signup', {
    //     username,
    //     email,
    //     password
    //     }, httpOptions);
    // }
}