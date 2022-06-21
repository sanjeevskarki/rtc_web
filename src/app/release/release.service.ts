import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReleaseDetails } from '../home/home.models';

/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseService {

  amount!: number;
  displayTime!: string;
  remaining!: number;
  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor(public httpClient: HttpClient) {
    
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
  public milestones(): Observable<string[]> { 
    return this.httpClient.get<string[]>("assets/data/milestone.json");
  }
  
}
