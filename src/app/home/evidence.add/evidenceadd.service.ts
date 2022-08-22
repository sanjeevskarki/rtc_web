import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UPLOAD_LOWER } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';


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

  public uploadFile(file: File,businessUnit:string,projectName:string,milestone:string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    
    let params = new HttpParams().set('businessUnit', businessUnit.toLowerCase().replace(/\s/g, ""))
    .set('projectName', projectName.toLowerCase().replace(/\s/g, ""))
    .set('milestone', milestone.toLowerCase().replace(/\s/g, ""))
    .set('dataCollection', 'evidence');
    
    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params:params,
    }
   
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, requestOptions);
    
    return this.httpClient.request(req);
  }

  
}
