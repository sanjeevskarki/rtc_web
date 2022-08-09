import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
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
export class EvidenceAddService {
  baseUrl:string= environment.ENDPOINT;
  upload:string=UPLOAD_LOWER;
  
  headers! : HttpHeaders;
  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor (public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Accept': 'application/json'
    });
  }
   

  public updateEvidenceFile(file:File): Observable<HttpEvent<any>> { 
    // const body=JSON.stringify(task);
    const DATE_TIME_FORMAT = 'YYYY-MM-DD';
   
    
    
    // const data= new Blob([file]);
    // alert("size = "+data);
    let headers: Headers = new Headers();

    let formData = new FormData();
    formData.append('file', file);

  // let options: RequestOptionsArgs = { headers: headers };
    // const req = new HttpRequest('POST', `${this.baseUrl}upload`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    // return this.httpClient.request(req);
    // formData.append('file', data, file.name);
    return this.httpClient.post<any>(this.baseUrl+this.upload, formData);
  }

  
}
