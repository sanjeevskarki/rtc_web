import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BDBA_LOWERCASE, KW_LOWERCASE, PROTEX_LOWERCASE, STAKEHOLDER_LOWERCASE, TASK_LOWERCASE } from '../release/release.constants';
import { PROJECT_LOWERCASE } from './home.constants';

import { ApiResponse, BackendTask, Project } from './home.models';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  endpoint_url: string = environment.ENDPOINT;
  task: string = TASK_LOWERCASE;
  stakeholder: string = STAKEHOLDER_LOWERCASE;
  kw: string = KW_LOWERCASE;
  protex: string = PROTEX_LOWERCASE;
  bdba: string = BDBA_LOWERCASE;
  project: string = PROJECT_LOWERCASE;
  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor(public httpClient: HttpClient) {

  }

  public shortCheckList(): Observable<Project[]> {
    // return this.httpClient.get<Checklist[]>("assets/data/checklist.json");
    // this.apiUrl = API_URL(system);
    return this.httpClient.get<Project[]>(this.endpoint_url + this.project);
  }

  /**
   * Get the given Project Task list
   * @param projectId Project ID
   * @returns List of task associated with the Project
   */
   public getSelectedProjectTask(projectId: number): Observable<BackendTask[]> {
    return this.httpClient.get<BackendTask[]>(this.endpoint_url + this.task + "/" + projectId);
  }

  public getPojectsByEmail(emailId: string): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.endpoint_url + this.project + "/email/"+emailId);
  }

  public deleteTask(projectId: number): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.task + "/"+projectId);
  }

  public deleteStakeholder(projectId: number): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.stakeholder + "/project/"+projectId);
  }

  public deleteKwConfig(projectId: number): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.kw + "/project/"+projectId);
  }

  public deleteProtexConfig(projectId: number): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.protex + "/project/"+projectId);
  }

  public deleteBdbaConfig(projectId: number): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.bdba + "/project/"+projectId);
  }

  public deleteProject(projectId: number): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.project + "/"+projectId);
  }


}
