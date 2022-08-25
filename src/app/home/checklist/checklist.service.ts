import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FILE_LOWER, GUIDELINE_LOWER, TASK_LOWER } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';
import { BDBA_SCAN_FILE, BDBA_SCAN_PDF_FILE, CHECKMARX_SCAN_FILE, FILE_PATH, FUTURE, KW_SCAN_FILE, PAST, PROTEX_SCAN_FILE, TIMEINTERVAL } from '../home.constants';

import { BackendTask, BackendGuideline, ReleaseDetails, ReleaseShortChecklist, ReleaseTask, Unit, Success } from '../home.models';
import { Bdba, Checkmarx, DATA_COLLECTION, Kw, Project } from './checklist.models';
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
  task: string = TASK_LOWER;
  file: string = FILE_LOWER;
  guideline: string = GUIDELINE_LOWER;
  unit!: Unit;
  UNITS: Unit[];
  amount!: number;
  displayTime!: string;
  remaining!: number;
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


  // public checkList(): Observable<Checklist[]> { 
  //   return this.httpClient.get<Checklist[]>("assets/data/checklist.json");
  //   // this.apiUrl = API_URL(system);
  //   // return this.httpClient.get<Data>(this.apiUrl);
  // }

  // public updateCheckList(id:string): Observable<Checklist[]> { 
  //   return this.httpClient.put<Checklist[]>("assets/data/checklist.json",id);
  //   // this.apiUrl = API_URL(system);
  //   // return this.httpClient.get<Data>(this.apiUrl);
  // }

  public details(fileName: string): Observable<ReleaseDetails[]> {
    return this.httpClient.get<ReleaseDetails[]>("assets/data/" + fileName + ".json");
    // this.apiUrl = API_URL(system);
    // return this.httpClient.get<Data>(this.apiUrl);
  }

  public getSelectedProject(projectId: number): Observable<BackendTask[]> {
    return this.httpClient.get<BackendTask[]>(this.endpoint_url + this.task + "/" + projectId);
  }

  public getEvidences(projectId: number): Observable<BackendTask[]> {
    return this.httpClient.get<BackendTask[]>(this.endpoint_url + this.task + "/" + projectId);
  }

  public updateGuidelines(guideline: BackendGuideline[]): Observable<BackendGuideline[]> {
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<BackendGuideline[]>(this.endpoint_url + this.guideline, guideline, { headers: this.headers });
  }

  public updateTasks(task: ReleaseTask[]): Observable<Success> {
    // const body=JSON.stringify(task);
    return this.httpClient.put<Success>(this.endpoint_url + this.task, task, { headers: this.headers });
  }

  public checkmarxScan(data_collection: DATA_COLLECTION): Observable<Checkmarx> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_name', CHECKMARX_SCAN_FILE);
    return this.httpClient.get<Checkmarx>(this.endpoint_url + this.file, { params: params });
  }

  public bdbaScan(data_collection: DATA_COLLECTION): Observable<Bdba> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_name', BDBA_SCAN_FILE);
    return this.httpClient.get<Bdba>(this.endpoint_url + this.file, { params: params });
  }

  public bdbaPdf(data_collection: DATA_COLLECTION): Observable<any> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_name', BDBA_SCAN_PDF_FILE);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }

    return this.httpClient.get<any>(this.endpoint_url + this.file, requestOptions);
  }

  public kwScan(data_collection: DATA_COLLECTION): Observable<any> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_name', KW_SCAN_FILE);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }

    return this.httpClient.get<any>(this.endpoint_url + this.file, requestOptions);
  }

  public protexScan(data_collection: DATA_COLLECTION): Observable<Project> {
    let params = new HttpParams().set('business_unit', data_collection.business_unit)
      .set('milestone_id', data_collection.milestone_id)
      .set('project_id', data_collection.project_id)
      .set('file_name', PROTEX_SCAN_FILE);
    const requestOptions: Object = {
      headers: this.headers,
      responseType: 'text',
      params: params,
    }
    return this.httpClient
      .get(this.endpoint_url + this.file, requestOptions)
      .pipe(
        switchMap(async xml => await this.parseXmlToJson(xml))
      );
    // return this.httpClient.get<Project>(FILE_PATH+PROTEX_SCAN_FILE, requestOptions);
  }

  async parseXmlToJson(xml: any) {
    // With parser
    /* const parser = new xml2js.Parser({ explicitArray: false });
    parser
      .parseStringPromise(xml)
      .then(function(result) {
        console.log(result);
        console.log("Done");
      })
      .catch(function(err) {
        // Failed
      }); */

    // Without parser
    if (xml) {
      return await xml2js
        .parseStringPromise(xml, { explicitArray: false })
        .then((response: { Project: Project; }) => response.Project);
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

  public uploadFile(file: File, businessUnit: string, projectName: string, milestone: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('businessUnit', businessUnit.toLowerCase().replace(/\s/g, ""))
      .set('projectName', projectName.toLowerCase().replace(/\s/g, ""))
      .set('milestone', milestone.toLowerCase().replace(/\s/g, ""))
      .set('dataCollection', 'attachments');

    const requestOptions: Object = {
      reportProgress: true,
      responseType: 'json',
      params: params,
    }

    const req = new HttpRequest('POST', `${this.endpoint_url}upload`, formData, requestOptions);

    return this.httpClient.request(req);
  }


}
