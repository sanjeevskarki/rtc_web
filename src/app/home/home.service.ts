import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TASK_LOWERCASE } from '../release/release.constants';
import { PROJECT } from './home.constants';

import { BackendTask, Project } from './home.models';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  endpoint_url: string = environment.ENDPOINT;
  task: string = TASK_LOWERCASE;
  project: string = PROJECT;
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


}
