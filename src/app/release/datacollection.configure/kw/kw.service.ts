import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { KW_LOWERCASE } from '../../release.constants';
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

  /**
   * Get KW Config Oject for provided project Id
   * @param projectId Selected Project Id
   * @returns 
   */
  public getKwConfig(projectId: number): Observable<Kw_Config[]> {
    return this.httpClient.get<Kw_Config[]>(this.endpoint_url + this.kw + "/" + projectId);
  }

  /**
   * Add New KW Config Object
   * @param kwConfig Selected Config Object
   * @returns Saved Config Object
   */
  public addKwConfig(kwConfig: Kw_Config): Observable<Kw_Config> {
    return this.httpClient.post<Kw_Config>(this.endpoint_url + this.kw, kwConfig, { headers: this.headers });
  }

  /**
   * Update KW Config Object
   * @param kwConfig Selected Config Object
   * @returns Updated Config Object
   */
  public updateKwConfig(kwConfig: Kw_Config): Observable<Kw_Config> {
    return this.httpClient.put<Kw_Config>(this.endpoint_url + this.kw, kwConfig, { headers: this.headers });
  }

  /**
   * Delete KW Config Object
   * @param kwConfig Selected Config Object
   * @returns API response message
   */
  public deleteKwConfig(kwConfig: Kw_Config): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.kw + "/" + kwConfig.id, { headers: this.headers });
  }

}
