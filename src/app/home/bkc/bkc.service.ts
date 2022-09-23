import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BKC_LOWER } from 'src/app/release/release.constants';
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
  bkc: string = BKC_LOWER;
  headers!: HttpHeaders;
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


  public getBkcList(projectId:number): Observable<Bkc[]> {
    return this.httpClient.get<Bkc[]>(this.endpoint_url + this.bkc + "/" + projectId);
  }

  public addBkc(bkc: Bkc): Observable<Bkc> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<Bkc>(this.endpoint_url + this.bkc, bkc, { headers: this.headers });
  }

  public updateBkc(bkc: Bkc): Observable<Bkc> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<Bkc>(this.endpoint_url + this.bkc, bkc, { headers: this.headers });
  }

  public deleteBkc(bkc: Bkc): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.bkc+ "/" + bkc.id, { headers: this.headers });
  }

}

