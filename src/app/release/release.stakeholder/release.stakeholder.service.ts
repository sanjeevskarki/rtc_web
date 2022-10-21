import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PROTEX_LOWERCASE, ROLES_LOWERCASE } from '../release.constants';
import { Roles } from '../release.models';


/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseStakeholderService {
  endpoint_url: string = environment.ENDPOINT;
  headers!: HttpHeaders;
  protex: string = PROTEX_LOWERCASE;
  roles: string = ROLES_LOWERCASE;

  /**
   *
   * @param httpClient Http Client.
   */
  constructor(public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });

  }

  /**
   * Get All Roles from DB
   * @returns Get All Roles
   */
  public getRoles(): Observable<Roles[]> {
    return this.httpClient.get<Roles[]>(this.endpoint_url + this.roles);
  }

  

}
