import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GUIDELINE_LOWER, TASK_LOWER } from 'src/app/release/release.constants';
import { environment } from 'src/environments/environment';
import { FUTURE, PAST, TIMEINTERVAL } from '../home.constants';

import { BackendTask, BackendGuideline, ReleaseDetails, ReleaseShortChecklist, ReleaseTask, Unit, Success } from '../home.models';
import { Checkmarx } from './checklist.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  endpoint_url:string= environment.ENDPOINT;
  task:string=TASK_LOWER;
  guideline:string = GUIDELINE_LOWER;
  unit!: Unit;
  UNITS: Unit[];
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers! : HttpHeaders;
  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor (public httpClient: HttpClient) {
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

  public details(fileName:string): Observable<ReleaseDetails[]> { 
    return this.httpClient.get<ReleaseDetails[]>("assets/data/"+fileName+".json");
    // this.apiUrl = API_URL(system);
    // return this.httpClient.get<Data>(this.apiUrl);
  }

  public getSelectedProject(projectId:number): Observable<BackendTask[]> { 
    return this.httpClient.get<BackendTask[]>(this.endpoint_url+this.task+"/"+projectId);
  }

  public updateGuidelines(guideline:BackendGuideline[]): Observable<BackendGuideline[]> { 
    // const body=JSON.stringify(guideline);
    return this.httpClient.put<BackendGuideline[]>(this.endpoint_url+this.guideline, guideline,{headers:this.headers});
  }

  public updateTasks(task:ReleaseTask[]): Observable<Success> { 
    // const body=JSON.stringify(task);
    return this.httpClient.put<Success>(this.endpoint_url+this.task, task,{headers:this.headers});
  }

  public checkmarxScan(): Observable<Checkmarx> { 
    return this.httpClient.get<Checkmarx>("assets/data/checkmarx_issues.json");
    // this.apiUrl = API_URL(system);
    // return this.httpClient.get<Data>(this.apiUrl);
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

  
}
