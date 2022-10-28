import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project, ReleaseDetails, ReleaseTask, ApiResponse, NotificationSetting, Platform } from '../../home/home.models';
import { TASK_LOWERCASE, BUSINESS_UNIT, MILESTONE, PROJECT, GUIDELINE_LOWERCASE, IS_FOLDER_EXIST, STAKEHOLDER_LOWERCASE, EMAIL_LOWERCASE, KW_LOWERCASE, PROTEX_LOWERCASE, BDBA_LOWERCASE, PLATFORM_LOWERCASE, AXG_LOWERCASE, CHECKLIST_LOWERCASE } from '../release.constants';
import { BusinessUnit, Milestone } from '../release.models';
import { Stakeholder } from 'src/app/home/home.models';
import { Bdba_Config, Kw_Config, Protex_Config, ReleaseChecklistLookup } from '../datacollection.configure/datacollection.models';
import { NOTIFICATION_LOWER } from 'src/app/home/home.constants';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseEditService {
  endpoint_url: string = environment.ENDPOINT;
  // milestone: string = MILESTONE;
  // businessUnit: string = BUSINESS_UNIT;
  // task: string = TASK_LOWERCASE;
  isFolderExist: string = IS_FOLDER_EXIST;
  // project: string = PROJECT;
  // guideline: string = GUIDELINE_LOWERCASE;
  // stakeholder: string = STAKEHOLDER_LOWERCASE;
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers!: HttpHeaders;
  // email: string = EMAIL_LOWERCASE;
  // kw: string = KW_LOWERCASE;
  // bdba: string = BDBA_LOWERCASE;
  // protex: string = PROTEX_LOWERCASE;
  // notification: string = NOTIFICATION_LOWER;
  // platform: string = PLATFORM_LOWERCASE;

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


  public details(milestone: string, handoverType: string, type: string, businessUnit:string ): Observable<ReleaseDetails[]> {
    var fileName;
    if(businessUnit === AXG_LOWERCASE){
      fileName = 'axg_'+milestone + ".json";
    }else{
      if (milestone === 'poc' && type === 'external') {
        fileName = milestone + "_" + handoverType + ".json";
      }
      else if (milestone === 'pre-alpha' && type === 'external') {
        fileName = milestone + "_" + handoverType + ".json";
      } else {
        fileName = milestone + ".json";
      }
    }
    return this.httpClient.get<ReleaseDetails[]>("assets/data/" + fileName);
  }
  /**
   * Get All Milestones
   * @returns String array of milestones
   */
  public getMilestones(): Observable<Milestone[]> {
    return this.httpClient.get<Milestone[]>(this.endpoint_url + MILESTONE);
  }

  public getBusinessUnit(): Observable<BusinessUnit[]> {
    return this.httpClient.get<BusinessUnit[]>(this.endpoint_url + BUSINESS_UNIT);
  }

  public addProject(project: Project): Observable<Project> {
    const body = JSON.stringify(project);
    return this.httpClient.post<Project>(this.endpoint_url + PROJECT, body, { headers: this.headers });
  }

  public updateProject(project: Project): Observable<string> {
    const body = JSON.stringify(project);
    return this.httpClient.put<string>(this.endpoint_url + PROJECT, body, { headers: this.headers });
  }

  // public addGuidelines(guideline: BackendGuideline[]): Observable<BackendGuideline[]> {
  //   // const body=JSON.stringify(guideline);
  //   return this.httpClient.post<BackendGuideline[]>(this.endpoint_url + GUIDELINE_LOWERCASE, guideline, { headers: this.headers });
  // }

  public addTasks(task: ReleaseTask[]): Observable<ReleaseTask[]> {
    // const body=JSON.stringify(task);
    return this.httpClient.post<ReleaseTask[]>(this.endpoint_url + TASK_LOWERCASE, task, { headers: this.headers });
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
    return this.httpClient.post<Stakeholder[]>(this.endpoint_url + STAKEHOLDER_LOWERCASE, stakeholders, { headers: this.headers });
  }

  public updateStakeholder(stakeholder: Stakeholder): Observable<Stakeholder> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<Stakeholder>(this.endpoint_url + STAKEHOLDER_LOWERCASE, stakeholder, { headers: this.headers });
  }

  public deleteStakeholder(stakeholder: Stakeholder): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.endpoint_url + STAKEHOLDER_LOWERCASE + "/" + stakeholder.id, { headers: this.headers });
  }

  public getProjectStakeholders(projectId: number): Observable<Stakeholder[]> {
    return this.httpClient.get<Stakeholder[]>(this.endpoint_url + STAKEHOLDER_LOWERCASE + "/" + projectId);
  }

  /**
   * Send Email toStakeholders
   * @param stakeholders List of stakeholders to whom we need to send email
   * @returns Api Response
   */
  public sendEmail(stakeholders: Stakeholder[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.endpoint_url + STAKEHOLDER_LOWERCASE + '/' + EMAIL_LOWERCASE, stakeholders, { headers: this.headers });
  }

  /**
   * GGGet Protex Config List for provided Project
   * @param projectId Selected Project Id
   * @returns Protex Config List
   */
  public getProtexConfig(projectId: number): Observable<Protex_Config[]> {
    return this.httpClient.get<Protex_Config[]>(this.endpoint_url + PROTEX_LOWERCASE + "/" + projectId);
  }

  /**
   * Get KW Config List for provided Project
   * @param projectId Selected Project Id
   * @returns Protex Config List
   */
  public getKwConfig(projectId: number): Observable<Kw_Config[]> {
    return this.httpClient.get<Kw_Config[]>(this.endpoint_url + KW_LOWERCASE + "/" + projectId);
  }

  /**
   * Get BDBA Config List for provided Project
   * @param projectId Selected Project Id
   * @returns BDBA Config List
   */
  public getBdbaConfig(projectId: number): Observable<Bdba_Config[]> {
    return this.httpClient.get<Bdba_Config[]>(this.endpoint_url + BDBA_LOWERCASE + "/" + projectId);
  }

  /**
   * Add Notification
   * @param notificationSetting Selected Notification Setting
   * @returns Project
   */
  public addNotification(notificationSetting: NotificationSetting): Observable<Project> {
    const body = JSON.stringify(notificationSetting);
    return this.httpClient.post<Project>(this.endpoint_url + NOTIFICATION_LOWER, body, { headers: this.headers });
  }

  /**
   * Add new Protex Config Objects
   * @param protexConfigs protex config list
   * @returns Saved Protex Config Objects
   */
   public addProtexConfigs(protexConfigs: Protex_Config[]): Observable<Protex_Config[]> {
    return this.httpClient.post<Protex_Config[]>(this.endpoint_url + PROTEX_LOWERCASE+"/bulk", protexConfigs, { headers: this.headers });
  }

  /**
   * Add new BDBA Config Objects
   * @param bdbaConfigs bdba config list
   * @returns Saved BDBA Config Objects
   */
   public addBdbaConfigs(bdbaConfigs: Bdba_Config[]): Observable<Bdba_Config[]> {
    return this.httpClient.post<Bdba_Config[]>(this.endpoint_url + BDBA_LOWERCASE+"/bulk", bdbaConfigs, { headers: this.headers });
  }

  /**
   * Add new KW Config Objects
   * @param bdbaConfigs bdba config list
   * @returns Saved BDBA Config Objects
   */
   public addKwConfigs(kwConfigs: Kw_Config[]): Observable<Kw_Config[]> {
    return this.httpClient.post<Kw_Config[]>(this.endpoint_url + KW_LOWERCASE+"/bulk", kwConfigs, { headers: this.headers });
  }

  public getPlatform(): Observable<Platform[]> {
    return this.httpClient.get<Platform[]>(this.endpoint_url + PLATFORM_LOWERCASE, { headers: this.headers });
  }

  public changeEmailNotification(projectId: number,status:boolean): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(this.endpoint_url + STAKEHOLDER_LOWERCASE + "/"+projectId+ "/"+status);
  }
  
  public createPlatform(platform:Platform): Observable<Platform> {
    return this.httpClient.post<Platform>(this.endpoint_url + PLATFORM_LOWERCASE, platform,{ headers: this.headers });
  }
 
  public getReleaseChecklist(name: string): Observable<ReleaseChecklistLookup[]> {
    return this.httpClient.get<ReleaseChecklistLookup[]>(this.endpoint_url + CHECKLIST_LOWERCASE + "/" + name);
  }
}
