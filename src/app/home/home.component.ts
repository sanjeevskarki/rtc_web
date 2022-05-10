import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { ReleaseShortChecklist } from './home.models';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  checklist:ReleaseShortChecklist[]=[];

  public urlValue!: String;

  public cssClass: string = 'e-list-template';

  @ViewChild('listview') element:any;
  
  constructor(private service:HomeService, private router: Router) { 
  }

  ngOnInit(): void {
    this.getShortList();
  }

  getShortList(){
    this.service.shortCheckList().subscribe(
      (response) => {
        this.checklist = response;
        console.log(this.checklist);
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  onClick(event: any){
    let selecteditem =this.element.getSelectedItems();
    this.router.navigate([ 'release' , selecteditem["data"].id]);
  }

}
