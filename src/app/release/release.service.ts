import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BackendGuideline, Project, ReleaseDetails, ReleaseTask } from '../home/home.models';
import { Scan_Server } from './datacollection.configure/datacollection.models';
import { TASK_LOWERCASE, BUSINESS_UNIT, MILESTONE, PROJECT, GUIDELINE_LOWERCASE, IS_FOLDER_EXIST } from './release.constants';
import { BusinessUnit, Milestone } from './release.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  endpoint_url: string = environment.ENDPOINT;
  milestone: string = MILESTONE;
  businessUnit: string = BUSINESS_UNIT;
  task: string = TASK_LOWERCASE;
  isFolderExist: string = IS_FOLDER_EXIST;
  project: string = PROJECT;
  guideline: string = GUIDELINE_LOWERCASE;
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers!: HttpHeaders;


  /**
   *
   * @param httpClient Http Client.
   */
  constructor(public httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });

  }

  /**
   * Get Details
   * @param milestone Selected Milestone
   * @param handoverType Selected Handover type
   * @param type type
   * @returns 
   */
  public details(milestone: string, handoverType: string, type: string): Observable<ReleaseDetails[]> {
    var fileName;
    if (milestone === 'poc' && type === 'external') {
      fileName = milestone + "_" + handoverType + ".json";
    }
    else if (milestone === 'pre-alpha' && type === 'external') {
      fileName = milestone + "_" + handoverType + ".json";
    } else {
      fileName = milestone + ".json";
    }
    return this.httpClient.get<ReleaseDetails[]>("assets/data/" + fileName);
  }
  /**
   * Get All Milestones
   * @returns String array of milestones
   */
  public getMilestones(): Observable<Milestone[]> {
    return this.httpClient.get<Milestone[]>(this.endpoint_url + this.milestone);
  }

  /**
   * Get Business Unit list
   * @returns Get Business Unit List
   */
  public getBusinessUnit(): Observable<BusinessUnit[]> {
    return this.httpClient.get<BusinessUnit[]>(this.endpoint_url + this.businessUnit);
  }

  /**
   * Add new Project
   * @param project Selected Project
   * @returns Saved Project
   */
  public addProject(project: Project): Observable<Project> {
    const body = JSON.stringify(project);
    return this.httpClient.post<Project>(this.endpoint_url + this.project, body, { headers: this.headers });
  }

  /**
   * Update Project
   * @param project Selected Project
   * @returns message
   */
  public updateProject(project: Project): Observable<string> {
    const body = JSON.stringify(project);
    return this.httpClient.put<string>(this.endpoint_url + this.project, body, { headers: this.headers });
  }

  /**
   * Add Guideline
   * @param guideline Backend Guideline List
   * @returns Backend Guideline List
   */
  public addGuidelines(guideline: BackendGuideline[]): Observable<BackendGuideline[]> {
    return this.httpClient.post<BackendGuideline[]>(this.endpoint_url + this.guideline, guideline, { headers: this.headers });
  }

  /**
   * Add Task
   * @param task Release Task List
   * @returns Release Task List
   */
  public addTasks(task: ReleaseTask[]): Observable<ReleaseTask[]> {
    return this.httpClient.post<ReleaseTask[]>(this.endpoint_url + this.task, task, { headers: this.headers });
  }

  /**
   * Check if the folder exist on SMB server or not
   * @param path path of the folder
   * @returns boolean based on the file existence
   */
  public createFolder(path: string[]): Observable<boolean> {
    const body = JSON.stringify({ "names": path });
    return this.httpClient.post<boolean>(this.endpoint_url + this.isFolderExist, body, { headers: this.headers });
  }

  scanServer:string='scanserver';
  public getServer(name: string): Observable<Scan_Server[]> {
    return this.httpClient.get<Scan_Server[]>(this.endpoint_url + this.scanServer + "/" + name);
  }

}
