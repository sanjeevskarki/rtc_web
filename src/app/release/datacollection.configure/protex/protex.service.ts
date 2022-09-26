import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/home/home.models';
import { environment } from 'src/environments/environment';
import { PROTEX_LOWERCASE } from '../../release.constants';
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
  protex: string = PROTEX_LOWERCASE;


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
   * Get All Protex Config for provided Project Id
   * @param projectId Project Id
   * @returns Protex Config Object List
   */
  public getProtexConfig(projectId: number): Observable<Protex_Config[]> {
    return this.httpClient.get<Protex_Config[]>(this.endpoint_url + this.protex + "/" + projectId);
  }

  /**
   * Add new Protex Config Object
   * @param protexConfig Selected Project Config
   * @returns Saved Protex Config Object
   */
  public addProtexConfig(protexConfig: Protex_Config): Observable<Protex_Config> {
    return this.httpClient.post<Protex_Config>(this.endpoint_url + this.protex, protexConfig, { headers: this.headers });
  }

  /**
   * Update Selected Protex Config Object
   * @param protexConfig Selected Project Config
   * @returns Updated Protex Config Object
   */
  public updateProtexConfig(protexConfig: Protex_Config): Observable<Protex_Config> {
    return this.httpClient.put<Protex_Config>(this.endpoint_url + this.protex, protexConfig, { headers: this.headers });
  }

  /**
   * Delete Protex Config Object
   * @param protexConfig Selected Project Config
   * @returns API response message
   */
  public deleteProtexConfig(protexConfig: Protex_Config): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.protex + "/" + protexConfig.id, { headers: this.headers });
  }

}
