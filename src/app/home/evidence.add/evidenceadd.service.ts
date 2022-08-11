import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UPLOAD_LOWER } from 'src/app/release/release.new/release.constants';
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
   

  public updateEvidenceFile(file:any): Observable<HttpEvent<any>> { 

    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', this.baseUrl+this.upload, file, {
      reportProgress: true
    });
    return this.httpClient.request(req);
  }

  
}
