import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BackendGuideline, Project, ReleaseDetails, ReleaseTask } from '../home/home.models';
import { TASK_LOWER, BUSINESS_UNIT, MILESTONE, PROJECT, GUIDELINE_LOWER } from './release.constants';
import { BusinessUnit,  Milestone } from './release.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  endpoint_url:string= environment.ENDPOINT;
  milestone:string=MILESTONE;
  businessUnit:string=BUSINESS_UNIT;
  task:string=TASK_LOWER;
  project:string = PROJECT;
  guideline:string = GUIDELINE_LOWER;
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers! : HttpHeaders;
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


  public details(milestone:string,handoverType:string,type:string): Observable<ReleaseDetails[]> { 
    var fileName;
    if(milestone === 'poc' && type === 'external'){
      fileName = milestone+"_"+handoverType+".json";
    }
    else if(milestone === 'pre-alpha' && type === 'external'){
      fileName = milestone+"_"+handoverType+".json";
    }else{
      fileName = milestone+".json";
    }
    return this.httpClient.get<ReleaseDetails[]>("assets/data/"+fileName);
  }
  /**
   * Get All Milestones
   * @returns String array of milestones
   */
  public getMilestones(): Observable<Milestone[]> { 
    return this.httpClient.get<Milestone[]>(this.endpoint_url+this.milestone);
  }

  public getBusinessUnit(): Observable<BusinessUnit[]> { 
    return this.httpClient.get<BusinessUnit[]>(this.endpoint_url+this.businessUnit);
  }

  public addProject(project:Project): Observable<Project> { 
    const body=JSON.stringify(project);
    return this.httpClient.post<Project>(this.endpoint_url+this.project, body,{headers:this.headers});
  }

  public addGuidelines(guideline:BackendGuideline[]): Observable<BackendGuideline[]> { 
    // const body=JSON.stringify(guideline);
    return this.httpClient.post<BackendGuideline[]>(this.endpoint_url+this.guideline, guideline,{headers:this.headers});
  }

  public addTasks(task:ReleaseTask[]): Observable<ReleaseTask[]> { 
    // const body=JSON.stringify(task);
    return this.httpClient.post<ReleaseTask[]>(this.endpoint_url+this.task, task,{headers:this.headers});
  }
  
}
