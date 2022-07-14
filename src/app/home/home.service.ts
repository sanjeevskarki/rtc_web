import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PROJECT } from './home.constants';

import { Project } from './home.models';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  endpoint_url:string= environment.ENDPOINT;
  project:string=PROJECT;
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
    return this.httpClient.get<Project[]>(this.endpoint_url+this.project);
  }

  
}
