import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UPLOAD_LOWER } from 'src/app/release/release.new/release.constants';
import { environment } from 'src/environments/environment';

import { ReleaseTask, Success } from '../home.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class CommentAddService {
  endpoint_url:string= environment.ENDPOINT;
  upload:string=UPLOAD_LOWER;
  
  headers! : HttpHeaders;
  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor (public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
  }

  public updateCommentFile(task:ReleaseTask[]): Observable<Success> { 
    // const body=JSON.stringify(task);
    return this.httpClient.post<Success>(this.endpoint_url+this.upload, task,{headers:this.headers});
  }

  
}
