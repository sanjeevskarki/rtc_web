import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project, NotificationSetting } from '../../home/home.models';
import { Stakeholder } from 'src/app/home/home.models';
import { NOTIFICATION_LOWER } from '../home.constants';
/**
 * Dependecy Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  endpoint_url: string = environment.ENDPOINT;
  
  notification: string = NOTIFICATION_LOWER;

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

  }


  public addNotification(notificationSetting: NotificationSetting): Observable<Project> {
    const body = JSON.stringify(notificationSetting);
    return this.httpClient.post<Project>(this.endpoint_url + this.notification, body, { headers: this.headers });
  }

  public updateNotification(notificationSetting: NotificationSetting): Observable<string> {
    const body = JSON.stringify(notificationSetting);
    return this.httpClient.put<string>(this.endpoint_url + this.notification, body, { headers: this.headers });
  }

  public getNotifications(qualOwnerId:number): Observable<Stakeholder[]> {
    return this.httpClient.get<Stakeholder[]>(this.endpoint_url + this.notification+ "/" + qualOwnerId);
  }


}
