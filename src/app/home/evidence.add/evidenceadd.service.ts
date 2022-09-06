import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EVIDENCES_LOWER, UPLOAD_LOWER } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';
import { BackendEvidences } from '../home.models';


/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class EvidenceAddService {
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

  public uploadFile(file: File, businessUnit: string, projectName: string, milestone: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('businessUnit', businessUnit.toLowerCase().replace(/\s/g, ""))
      .set('projectName', projectName.toLowerCase().replace(/\s/g, ""))
      .set('milestone', milestone.toLowerCase().replace(/\s/g, ""))
      .set('dataCollection', EVIDENCES_LOWER);

    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params: params,
    }

    const req = new HttpRequest('POST', `${this.baseUrl}upload`, formData, requestOptions);

    return this.httpClient.request(req);
  }

  public saveEvidence(evidence: BackendEvidences): Observable<boolean> {
    const body = JSON.stringify(evidence);
    return this.httpClient.post<boolean>(`${this.baseUrl}evidences` , body, { headers: this.headers });
  }


}
