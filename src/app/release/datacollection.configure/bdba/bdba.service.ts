import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { BDBA_LOWER } from '../../release.constants';
import { Bdba_Config } from '../datacollection.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class BdbaService {
  endpoint_url: string = environment.ENDPOINT;
  headers!: HttpHeaders;
  bdba: string = BDBA_LOWER;
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

  public getBdbaConfig(projectId:number): Observable<Bdba_Config[]> {
    return this.httpClient.get<Bdba_Config[]>(this.endpoint_url + this.bdba+"/"+projectId);
  }

  public addBdbaConfig(bdbaConfig: Bdba_Config): Observable<Bdba_Config> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<Bdba_Config>(this.endpoint_url + this.bdba, bdbaConfig, { headers: this.headers });
  }

  public updateBdbaConfig(bdbaConfig: Bdba_Config): Observable<Bdba_Config> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<Bdba_Config>(this.endpoint_url + this.bdba, bdbaConfig, { headers: this.headers });
  }

  public deleteBdbaConfig(bdbaConfig: Bdba_Config): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.bdba+ "/" + bdbaConfig.id, { headers: this.headers });
  }

}
