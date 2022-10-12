import { Component } from '@angular/core';
import { TokenStorageService } from './account/token-storage.service';
import { RTC_VERSION } from './release/release.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rtc';
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  rtcVersion: string = RTC_VERSION;
  constructor(private tokenStorageService: TokenStorageService) { }
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      // this.roles = user.roles;

      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      // this.username = user.username;
    }
  }



}
