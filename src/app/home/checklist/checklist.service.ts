import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ATTACHMENTS_LOWERCASE, BDBA_RESULTS_LOWERCASE, EMAIL_LOWERCASE, FILE_LOWERCASE, GUIDELINE_LOWERCASE, KW_RESULTS_LOWERCASE, PROTEX_RESULTS_LOWERCASE, TASK_LOWERCASE, TASK_STATUS_LOWERCASE } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';
import { BDBA_SCAN_FILE, BDBA_SCAN_PDF_FILE, CHECKMARX_SCAN_FILE, DATA_COLLECTION, FUTURE, KW_SCAN_FILE, NOTIFICATION_LOWER, PAST, PROJECT_LOWERCASE, PROTEX_D457_SCAN_FILE1, PROTEX_D457_SCAN_FILE2, PROTEX_META_SCAN_FILE1, PROTEX_META_SCAN_FILE2, PROTEX_SCAN_FILE, TIMEINTERVAL } from '../home.constants';

import { BackendTask, BackendGuideline, ReleaseDetails, ReleaseTask, Unit, ApiResponse, BackendComments, OwnerEmail, NotificationSetting } from '../home.models';
import { Bdba, BdbaResult, Checkmarx, DataCollection, KwResults, Project, ProtexResult, TaskStatus } from './checklist.models';
import { switchMap } from "rxjs/operators";

declare var require: any;
const xml2js = require("xml2js");

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  endpoint_url: string = environment.ENDPOINT;
  task: string = TASK_LOWERCASE;
  email: string = EMAIL_LOWERCASE;
  file: string = FILE_LOWERCASE;
  guideline: string = GUIDELINE_LOWERCASE;
  taskStatus: string = TASK_STATUS_LOWERCASE;
  bdbaResults: string = BDBA_RESULTS_LOWERCASE;
  kwResults: string = KW_RESULTS_LOWERCASE;
  protexResults: string = PROTEX_RESULTS_LOWERCASE;
  unit!: Unit;
  UNITS: Unit[];
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers!: HttpHeaders;
  notification: string = NOTIFICATION_LOWER;
  project:string= PROJECT_LOWERCASE;
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
    this.UNITS = [
      {
        name: 'YEAR',
        value: 31536000,
        precision: 2592000,
        more: 'MONTH',
      },
      {
        name: 'MONTH',
        value: 2592000,
        precision: 86400,
        more: 'DAY',
      },
      {
        name: 'WEEK',
        value: 604800,
        exact: [1, 2, 3, 4],
      },
      {
        name: 'DAY',
        value: 86400,
        precision: 3600,
        more: 'HOUR',
      },
      {
        name: 'HOUR',
        value: 3600,
        precision: 900,
        more: '15',
      },
      {
        name: 'MINUTE',
        value: 60,
      },
      {
        name: 'SECOND',
        value: 1,
      },
    ];
  }

  /**
   * Read the Static data file of a given miletone
   * @param fileName Name of the File
   * @returns File
   */
  public getStaticData(fileName: string): Observable<ReleaseDetails[]> {
    return this.httpClient.get<ReleaseDetails[]>("assets/data/" + fileName + ".json");
    // this.apiUrl = API_URL(system);
    // return this.httpClient.get<Data>(this.apiUrl);
  }

  /**
   * Get the given Project Task list
   * @param projectId Project ID
   * @returns List of task associated with the Project
   */
  public getSelectedProjectTask(projectId: number): Observable<BackendTask[]> {
    return this.httpClient.get<BackendTask[]>(this.endpoint_url + this.task + "/" + projectId);
  }

  // public getEvidences(projectId: number): Observable<BackendTask[]> {
  //   return this.httpClient.get<BackendTask[]>(this.endpoint_url + this.task + "/" + projectId);
  // }

  public updateGuidelines(guideline: BackendGuideline[]): Observable<BackendGuideline[]> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<BackendGuideline[]>(this.endpoint_url + this.guideline, guideline, { headers: this.headers });
  }

  public updateTasks(task: ReleaseTask[]): Observable<ApiResponse> {
    // const body=JSON.stringify(task);
    return this.httpClient.put<ApiResponse>(this.endpoint_url + this.task, task, { headers: this.headers });
  }

  public checkmarxScan(data_collection: DataCollection): Observable<Checkmarx> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', DATA_COLLECTION)
      .set('file_name', CHECKMARX_SCAN_FILE);
    return this.httpClient.get<Checkmarx>(this.endpoint_url + this.file, { params: params });
  }

  public bdbaScan(data_collection: DataCollection): Observable<Bdba> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', DATA_COLLECTION)
      .set('file_name', data_collection.project_id.toLowerCase() + BDBA_SCAN_FILE);
    return this.httpClient.get<Bdba>(this.endpoint_url + this.file, { params: params });
  }

  public bdbaPdf(data_collection: DataCollection): Observable<any> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', DATA_COLLECTION)
      .set('file_name', data_collection.project_id.toLowerCase() + BDBA_SCAN_PDF_FILE);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }

    return this.httpClient.get<any>(this.endpoint_url + this.file, requestOptions);
  }

  public kwScan(data_collection: DataCollection): Observable<any> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', DATA_COLLECTION)
      .set('file_name', KW_SCAN_FILE);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }

    return this.httpClient.get<any>(this.endpoint_url + this.file, requestOptions);
  }

  public protexScanFile1(data_collection: DataCollection): Observable<Project> {
    let fileName!: string;
    if (data_collection.project_id === "d457") {
      fileName = PROTEX_D457_SCAN_FILE1;
    }
    else if (data_collection.project_id === "meta") {
      fileName = PROTEX_META_SCAN_FILE1;
    } else {
      fileName = PROTEX_SCAN_FILE;
    }
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', DATA_COLLECTION)
      .set('file_name', fileName);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }
    return this.httpClient
      .get(this.endpoint_url + this.file, requestOptions)
      .pipe(
        switchMap(async xml => await this.parseXmlToJson(xml, fileName))
      );
    // return this.httpClient.get<Project>(FILE_PATH+PROTEX_SCAN_FILE, requestOptions);
  }

  public protexScanFile2(data_collection: DataCollection): Observable<Project> {
    let fileName!: string;
    if (data_collection.project_id === "d457") {
      fileName = PROTEX_D457_SCAN_FILE2;
    }
    else if (data_collection.project_id === "meta") {
      fileName = PROTEX_META_SCAN_FILE2;
    } else {
      fileName = PROTEX_SCAN_FILE;
    }
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', DATA_COLLECTION)
      .set('file_name', fileName);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }
    return this.httpClient
      .get(this.endpoint_url + this.file, requestOptions)
      .pipe(
        switchMap(async xml => await this.parseXmlToJson(xml, fileName))
      );
    // return this.httpClient.get<Project>(FILE_PATH+PROTEX_SCAN_FILE, requestOptions);
  }

  async parseXmlToJson(xml: any, fileName: string) {
    if (xml) {
      let protextProj: any;
      protextProj = await xml2js
        .parseStringPromise(xml, { explicitArray: false })
        .then((response: { Project: Project; }) => response.Project);
      protextProj.FileName = fileName;
      return protextProj
    } else {
      return '';
    }
  }


  /**
   * Formats a duration as a nice string.
   *
   * @param duration Duration.
   * @returns Nice Formatted String.
   */
  getNiceTime(duration: number) {
    this.displayTime = duration <= 0 ? 'PAST' : 'FUTURE';
    // we handle seconds only, not millis
    duration = Math.round(Math.abs(duration) / 1000);

    main: for (const unit of this.UNITS) {
      this.unit = unit;
      this.amount = duration / this.unit.value;

      if (unit.exact) {
        for (const exact of unit.exact) {
          if (Math.abs(this.amount - exact) < 0.1) {
            break main;
          }
        }
      } else if (this.amount > 0.9) {
        break;
      }
    }
    if (this.unit.precision) {
      this.amount = Math.floor(this.amount);
      this.remaining = duration - this.amount * this.unit.value;
      if (this.remaining / this.unit.value < 0.25) {
        this.remaining = 0;
      } else {
        this.remaining = Math.round(this.remaining / this.unit.precision);
      }
    } else {
      this.amount = Math.round(this.amount);
    }
    return this.lastValidateTime(this.remaining);
  }
  /**
   * Calculate the time string and pass to getTimeString.
   *
   * @param remaining Time.
   * @returns Formated time string.
   */
  lastValidateTime(remaining: number) {
    const lastValidateTime =
      this.unit.name +
      (this.amount > 1 ? 'S' : '') +
      (remaining > 0 && this.unit.more ? '_' + this.unit.more + (this.remaining > 1 ? 'S' : '') : '');

    const timeDuration = TIMEINTERVAL[lastValidateTime as keyof typeof TIMEINTERVAL];
    const timeString = timeDuration(this.amount, this.remaining);

    return this.getTimeString(timeString);
  }
  /**
   * Create formated time string which display on list.
   *
   * @param timeString Calculated timestring.
   * @returns Formated time string.
   */
  getTimeString(timeString: string | null) {
    if (timeString !== null) {
      return this.displayTime === 'PAST' ? PAST(timeString) : FUTURE(timeString);
    } else {
      return;
    }
  }

  /**
   * Upload the Evidence and Comment files
   * @param file File to upload
   * @param businessUnit Business Unit of the Project
   * @param projectName Name of the Project
   * @param milestone Milestone of Project
   * @returns Status of Upload
   */
  public uploadFile(file: File, businessUnit: string, projectName: string, milestone: string): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('businessUnit', businessUnit.toLowerCase().replace(/\s/g, ""))
      .set('projectName', projectName.toLowerCase().replace(/\s/g, ""))
      .set('milestone', milestone.toLowerCase().replace(/\s/g, ""))
      .set('dataCollection', ATTACHMENTS_LOWERCASE);

    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params: params,
    }

    return this.httpClient.post<ApiResponse>(`${this.endpoint_url}upload`, formData, requestOptions);
    // const req = new HttpRequest('POST', `${this.endpoint_url}upload`, formData, requestOptions);

    // return this.httpClient.request(req);
  }

  /**
   * Save comment in DB
   * @param comment Comments
   * @returns Status of API
   */
  public saveComment(comment: BackendComments): Observable<boolean> {
    const body = JSON.stringify(comment);
    return this.httpClient.post<boolean>(`${this.endpoint_url}comments`, body, { headers: this.headers });
  }

  /**
   * Get the comments related file
   * @param data_collection Folder Heirarchy where file saved
   * @param fileName Name of the file
   * @returns file
   */
  public getFile(data_collection: DataCollection, fileName: string): Observable<any> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_type', data_collection.file_type)
      .set('file_name', fileName);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'blob',
      params: params,
    }

    return this.httpClient.get<any>(this.endpoint_url + this.file, requestOptions);
  }

  /**
   * Send Email to task owner
   */
  public sendEmail(ownerEmails: OwnerEmail[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.endpoint_url + this.task + '/' + this.email, ownerEmails, { headers: this.headers });
  }

  download(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob'
    })
  }

  public getTaskStatus(): Observable<TaskStatus[]> {
    return this.httpClient.get<TaskStatus[]>(this.endpoint_url + this.taskStatus);
  }

  public getNotifications(qualOwnerId: string): Observable<NotificationSetting> {
    let params = new HttpParams().set('id', qualOwnerId);
    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params: params,
    }
    return this.httpClient.get<NotificationSetting>(this.endpoint_url + this.notification, requestOptions);
  }

  public getBdbaResults(projectId: number): Observable<BdbaResult[]> {
    return this.httpClient.get<BdbaResult[]>(this.endpoint_url + this.bdbaResults + "/" + projectId);
  }

  public getKwResults(projectId: number): Observable<KwResults[]> {
    return this.httpClient.get<KwResults[]>(this.endpoint_url + this.kwResults + "/" + projectId);
  }

  public getProtexResults(projectId: number): Observable<ProtexResult[]> {
    return this.httpClient.get<ProtexResult[]>(this.endpoint_url + this.protexResults + "/" + projectId);
  }
  

  public changeTaskStatus(projectId: number,status:boolean): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(this.endpoint_url + this.project + "/"+projectId+ "/"+status);
  }

  public updateComment(comment: BackendComments): Observable<boolean> {
    const body = JSON.stringify(comment);
    return this.httpClient.put<boolean>(`${this.endpoint_url}comments`, body, { headers: this.headers });
  }
  
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

    return this.httpClient.delete<any>(this.endpoint_url + this.file, requestOptions);
  }

}
