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


  public details(fileName:string): Observable<ReleaseDetails[]> { 
    return this.httpClient.get<ReleaseDetails[]>("assets/data/"+fileName+".json");
  }
  
}
