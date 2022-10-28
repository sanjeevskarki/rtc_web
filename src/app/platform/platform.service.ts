import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Platform } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { Kw_Config } from '../release/datacollection.configure/datacollection.models';
import { KW_LOWERCASE, PLATFORM_LOWERCASE } from '../release/release.constants';


/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class PlatfromService {
  endpoint_url: string = environment.ENDPOINT;
  headers!: HttpHeaders;
  kw: string = KW_LOWERCASE;

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

  public getPlatform(): Observable<Platform[]> {
    return this.httpClient.get<Platform[]>(this.endpoint_url + PLATFORM_LOWERCASE, { headers: this.headers });
  }

  
  public createPlatform(platform:Platform): Observable<Platform> {
    return this.httpClient.post<Platform>(this.endpoint_url + PLATFORM_LOWERCASE, platform,{ headers: this.headers });
  }

}
