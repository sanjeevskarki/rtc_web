import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BackendGuideline, Project, ReleaseDetails, ReleaseTask, ApiResponse, NotificationSetting } from '../../home/home.models';
import { TASK_LOWER, BUSINESS_UNIT, MILESTONE, PROJECT, GUIDELINE_LOWER, IS_FOLDER_EXIST, STAKEHOLDER_LOWER, EMAIL_LOWER, KW_LOWER, PROTEX_LOWER, BDBA_LOWER } from '../release.constants';
import { BusinessUnit, Milestone } from '../release.models';
import { Stakeholder } from 'src/app/home/home.models';
import { Bdba_Config, Kw_Config, Protex_Config } from '../datacollection.configure/datacollection.models';
import { NOTIFICATION_LOWER } from 'src/app/home/home.constants';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseEditService {
  endpoint_url: string = environment.ENDPOINT;
  milestone: string = MILESTONE;
  businessUnit: string = BUSINESS_UNIT;
  task: string = TASK_LOWER;
  isFolderExist: string = IS_FOLDER_EXIST;
  project: string = PROJECT;
  guideline: string = GUIDELINE_LOWER;
  stakeholder: string = STAKEHOLDER_LOWER;
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers!: HttpHeaders;
  email: string = EMAIL_LOWER;
  kw: string = KW_LOWER;
  bdba: string = BDBA_LOWER;
  protex: string = PROTEX_LOWER;
  notification: string = NOTIFICATION_LOWER;
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

  public getBusinessUnit(): Observable<BusinessUnit[]> {
    return this.httpClient.get<BusinessUnit[]>(this.endpoint_url + this.businessUnit);
  }

  public addProject(project: Project): Observable<Project> {
    const body = JSON.stringify(project);
    return this.httpClient.post<Project>(this.endpoint_url + this.project, body, { headers: this.headers });
  }

  public updateProject(project: Project): Observable<string> {
    const body = JSON.stringify(project);
    return this.httpClient.put<string>(this.endpoint_url + this.project, body, { headers: this.headers });
  }

  public addGuidelines(guideline: BackendGuideline[]): Observable<BackendGuideline[]> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<BackendGuideline[]>(this.endpoint_url + this.guideline, guideline, { headers: this.headers });
  }

  public addTasks(task: ReleaseTask[]): Observable<ReleaseTask[]> {
    // const body=JSON.stringify(task);
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

  public addStakeholders(stakeholders: Stakeholder[]): Observable<Stakeholder[]> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<Stakeholder[]>(this.endpoint_url + this.stakeholder, stakeholders, { headers: this.headers });
  }

  public updateStakeholder(stakeholder: Stakeholder): Observable<Stakeholder> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<Stakeholder>(this.endpoint_url + this.stakeholder, stakeholder, { headers: this.headers });
  }

  public deleteStakeholder(stakeholder: Stakeholder): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + this.stakeholder+ "/" + stakeholder.id, { headers: this.headers });
  }

  public getProjectStakeholders(projectId:number): Observable<Stakeholder[]> {
    return this.httpClient.get<Stakeholder[]>(this.endpoint_url + this.stakeholder+ "/" + projectId);
  }

  /**
   * Send Email toStakeholders
   * @param stakeholders List of stakeholders to whom we need to send email
   * @returns Api Response
   */
  public sendEmail(stakeholders: Stakeholder[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.endpoint_url + this.stakeholder + '/' + this.email, stakeholders, { headers: this.headers });
  }

  public getProtexConfig(projectId:number): Observable<Protex_Config[]> {
    return this.httpClient.get<Protex_Config[]>(this.endpoint_url + this.protex+"/"+projectId);
  }

  public getKwConfig(projectId:number): Observable<Kw_Config[]> {
    return this.httpClient.get<Kw_Config[]>(this.endpoint_url + this.kw+"/"+projectId);
  }

  public getBdbaConfig(projectId:number): Observable<Bdba_Config[]> {
    return this.httpClient.get<Bdba_Config[]>(this.endpoint_url + this.bdba+"/"+projectId);
  }

  public addNotification(notificationSetting: NotificationSetting): Observable<Project> {
    const body = JSON.stringify(notificationSetting);
    return this.httpClient.post<Project>(this.endpoint_url + this.notification, body, { headers: this.headers });
  }
}
