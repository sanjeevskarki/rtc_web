import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project, ReleaseDetails } from '../home/home.models';
import { BUSINESS_UNIT, MILESTONE, PROJECT } from './release.constants';
import { BusinessUnit, Milestone } from './release.models';

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
  project:string = PROJECT;
  amount!: number;
  displayTime!: string;
  remaining!: number;
  headers! : HttpHeaders
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
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': 'Bearer szdp79a2kz4wh4frjzuqu4sz6qeth8m3',
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

  public addProject(project:Project): Observable<number> { 
    // const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(project);
    console.log("------------>>>>>>>>>>>>>>>>>>>>>"+body)
    return this.httpClient.post<number>(this.endpoint_url+this.project, body,{headers:this.headers});
  }
  
}
