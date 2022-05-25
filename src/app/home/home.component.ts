import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
    localStorage.removeItem('relaesechecklist');
    let selecteditem =this.element.getSelectedItems();
    localStorage.setItem('relaesechecklist', JSON.stringify(selecteditem["data"])  );
    // this.sharedChecklistService.setReleaseList(selecteditem["data"]);
    this.router.navigate([ 'release' ]);
  }

}
