import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { KW_LOWER } from '../../release.constants';
import { Kw_Config } from '../datacollection.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class KwService {
  endpoint_url: string = environment.ENDPOINT;
  headers!: HttpHeaders;
  kw: string = KW_LOWER;
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

  public getKwConfig(projectId:number): Observable<Kw_Config[]> {
    return this.httpClient.get<Kw_Config[]>(this.endpoint_url + this.kw+"/"+projectId);
  }

  public addKwConfig(kwConfig: Kw_Config): Observable<Kw_Config> {
    return this.httpClient.post<Kw_Config>(this.endpoint_url + this.kw, kwConfig, { headers: this.headers });
  }

  public updateKwConfig(kwConfig: Kw_Config): Observable<Kw_Config> {
    return this.httpClient.put<Kw_Config>(this.endpoint_url + this.kw, kwConfig, { headers: this.headers });
  }

  public deleteKwConfig(kwConfig: Kw_Config): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.kw+ "/" + kwConfig.id, { headers: this.headers });
  }

}
