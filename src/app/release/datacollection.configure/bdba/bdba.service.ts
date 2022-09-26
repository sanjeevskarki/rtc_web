import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { BDBA_LOWERCASE } from '../../release.constants';
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
  bdba: string = BDBA_LOWERCASE;

  constructor(public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });

  }

  /**
   * Get All BDBA Config for provided Project
   * @param projectId Selected Project Id
   * @returns BDBA Config List
   */
  public getBdbaConfig(projectId:number): Observable<Bdba_Config[]> {
    return this.httpClient.get<Bdba_Config[]>(this.endpoint_url + this.bdba+"/"+projectId);
  }

  /**
   * Add new BDBA Config object
   * @param bdbaConfig BDBA Config object
   * @returns Added BDBA Config object
   */
  public addBdbaConfig(bdbaConfig: Bdba_Config): Observable<Bdba_Config> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<Bdba_Config>(this.endpoint_url + this.bdba, bdbaConfig, { headers: this.headers });
  }

  /**
   * Update Existing BDBA Config Object
   * @param bdbaConfig BDBA Config object
   * @returns Updated BDBA Config object
   */
  public updateBdbaConfig(bdbaConfig: Bdba_Config): Observable<Bdba_Config> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<Bdba_Config>(this.endpoint_url + this.bdba, bdbaConfig, { headers: this.headers });
  }

  /**
   * Delete Selected BDBAB Config object
   * @param bdbaConfig Selected BDBA Config Object
   * @returns API response message
   */
  public deleteBdbaConfig(bdbaConfig: Bdba_Config): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.bdba+ "/" + bdbaConfig.id, { headers: this.headers });
  }

}
