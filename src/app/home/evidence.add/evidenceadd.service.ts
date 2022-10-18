import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EVIDENCES_LOWERCASE, FILE_LOWERCASE, UPLOAD_LOWERCASE } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';
import { DataCollection } from '../checklist/checklist.models';
import { ApiResponse, BackendEvidences } from '../home.models';


/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class EvidenceAddService {
  baseUrl: string = environment.ENDPOINT;
  upload: string = UPLOAD_LOWERCASE;

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

  public uploadFile(file: File, businessUnit: string, projectName: string, milestone: string): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('businessUnit', businessUnit.toLowerCase().replace(/\s/g, ""))
      .set('projectName', projectName.toLowerCase().replace(/\s/g, ""))
      .set('milestone', milestone.toLowerCase().replace(/\s/g, ""))
      .set('dataCollection', EVIDENCES_LOWERCASE);

    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params: params,
    }
    return this.httpClient.post<ApiResponse>(`${this.baseUrl}upload`, formData, requestOptions);
    // const req = new HttpRequest('POST', `${this.baseUrl}upload`, formData, requestOptions);

    // return this.httpClient.request(req);
  }

  public saveEvidence(evidence: BackendEvidences): Observable<BackendEvidences> {
    const body = JSON.stringify(evidence);
    return this.httpClient.post<BackendEvidences>(`${this.baseUrl}evidences`, body, { headers: this.headers });
  }

  public updateEvidence(evidence: BackendEvidences): Observable<boolean> {
    const body = JSON.stringify(evidence);
    return this.httpClient.put<boolean>(`${this.baseUrl}evidences`, body, { headers: this.headers });
  }

  file: string = FILE_LOWERCASE;
  public deleteFile(data_collection: DataCollection, fileName: string): Observable<any> {
    let params = new HttpParams()
      .set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', data_collection.file_type)
      .set('file_name', fileName);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'blob',
      params: params,
    }

    return this.httpClient.delete<any>(this.baseUrl + this.file, requestOptions);
  }

}
