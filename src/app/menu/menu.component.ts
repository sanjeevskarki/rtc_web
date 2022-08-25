import { Component } from '@angular/core';
import { RTC_VERSION } from '../release/release.constants';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent {

  rtcVersion: string = RTC_VERSION;

  constructor() { }

}
