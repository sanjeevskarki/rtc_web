import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BKC_LOWERCASE } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';

import { ApiResponse, Bkc } from '../home.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class BkcService {
  endpoint_url: string = environment.ENDPOINT;
  bkc: string = BKC_LOWERCASE;
  headers!: HttpHeaders;

  constructor(public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
  }

  /**
   * Get BKC object list for a selected Project from DB
   * @param projectId Selected Project
   * @returns BKC object List
   */
  public getBkcList(projectId: number): Observable<Bkc[]> {
    return this.httpClient.get<Bkc[]>(this.endpoint_url + this.bkc + "/" + projectId);
  }

  /**
   * Saving a new BKC object in DB
   * @param bkc New BKC object
   * @returns Saved BKC object
   */
  public addBkc(bkc: Bkc): Observable<Bkc> {
    return this.httpClient.post<Bkc>(this.endpoint_url + this.bkc, bkc, { headers: this.headers });
  }

  /**
   * Updating an Existing BKC object in DB
   * @param bkc Updated BKC object
   * @returns Updated BKC object
   */
  public updateBkc(bkc: Bkc): Observable<Bkc> {
    return this.httpClient.put<Bkc>(this.endpoint_url + this.bkc, bkc, { headers: this.headers });
  }

  /**
   * Delete the selected BKC from DB
   * @param bkc Selected BKC object
   * @returns response message
   */
  public deleteBkc(bkc: Bkc): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.bkc + "/" + bkc.id, { headers: this.headers });
  }

}
