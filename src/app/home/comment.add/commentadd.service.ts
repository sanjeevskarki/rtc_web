import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UPLOAD_LOWER } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';

import { ReleaseTask, Success } from '../home.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class CommentAddService {
  baseUrl: string = environment.ENDPOINT;
  upload: string = UPLOAD_LOWER;

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

  public updateCommentFile(task: ReleaseTask[]): Observable<Success> {
    // const body=JSON.stringify(task);
    return this.httpClient.post<Success>(this.baseUrl + this.upload, task, { headers: this.headers });
  }

  public uploadFile(file: File, businessUnit: string, projectName: string, milestone: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('businessUnit', businessUnit.toLowerCase().replace(/\s/g, ""))
      .set('projectName', projectName.toLowerCase().replace(/\s/g, ""))
      .set('milestone', milestone.toLowerCase().replace(/\s/g, ""))
      .set('dataCollection', 'attachments');

    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params: params,
    }

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, requestOptions);

    return this.httpClient.request(req);
  }

}
