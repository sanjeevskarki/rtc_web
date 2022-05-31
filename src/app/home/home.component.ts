import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Checklist, ReleaseShortChecklist } from './home.models';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  checklist:Checklist[]=[];

  public urlValue!: String;

  public cssClass: string = 'e-list-template';

  @ViewChild('listview') element:any;
  
  constructor(private service:HomeService, private router: Router) { 
  }

  ngOnInit(): void {
    this.getShortList();
  }

  getShortList(){
    this.checklist = JSON.parse(localStorage.getItem("checkList")!);
    // this.service.shortCheckList().subscribe(
    //   (response) => {
    //     this.checklist = response;
    //   },
    //   (err) => {
    //     console.log(err.name);
    //   }
    // );
  }

  onClick(event: any){
    // localStorage.removeItem('relaesechecklist');
    let selecteditem =this.element.getSelectedItems();
    localStorage.setItem('releaseId', selecteditem["data"].id);
    // this.sharedChecklistService.setReleaseList(selecteditem["data"]);
    this.router.navigate([ 'checklist' ]);
  }

}
