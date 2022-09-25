import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { PROTEX_LOWER } from '../../release.constants';
import { Protex_Config } from '../datacollection.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ProtexService {
  endpoint_url: string = environment.ENDPOINT;
  headers!: HttpHeaders;
  protex: string = PROTEX_LOWER;
  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor(public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });

  }

  public getProtexConfig(projectId: number): Observable<Protex_Config[]> {
    return this.httpClient.get<Protex_Config[]>(this.endpoint_url + this.protex + "/" + projectId);
  }

  public addProtexConfig(protexConfig: Protex_Config): Observable<Protex_Config> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<Protex_Config>(this.endpoint_url + this.protex, protexConfig, { headers: this.headers });
  }

  public updateProtexConfig(protexConfig: Protex_Config): Observable<Protex_Config> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<Protex_Config>(this.endpoint_url + this.protex, protexConfig, { headers: this.headers });
  }

  public deleteProtexConfig(protexConfig: Protex_Config): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.protex + "/" + protexConfig.id, { headers: this.headers });
  }

}
