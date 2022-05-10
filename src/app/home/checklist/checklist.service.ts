import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Checklist, ReleaseChecklist, ReleaseShortChecklist } from '../home.models';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ChecklistService {

  /**
   *
   * @param httpClient Http Client.
   * @param sharedService Shared Service.
   */
  constructor(public httpClient: HttpClient) {
    
  }

  public checkList(): Observable<Checklist[]> { 
    return this.httpClient.get<Checklist[]>("assets/checklist.json");
    // this.apiUrl = API_URL(system);
    // return this.httpClient.get<Data>(this.apiUrl);
  }

  
}
