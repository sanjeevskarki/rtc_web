import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from './home.models';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects:Project[]=[];

  public urlValue!: String;

  public cssClass: string = 'e-list-template';

  @ViewChild("listview") element: any;
  
  constructor(private service:HomeService, private router: Router) { 
  }

  ngOnInit(): void {
    localStorage.removeItem('selectedProject');
    this.getShortList();
  }

  getShortList(){
    this.service.shortCheckList().subscribe(
      (response) => {
        this.projects = response;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  onClick(selectedProject: Project){
    // localStorage.removeItem('relaesechecklist');
    // alert(selectedProject.project_id);
    // let selecteditem =this.element.getSelectedItems();
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
    // this.sharedChecklistService.setReleaseList(selecteditem["data"]);
    this.router.navigate([ 'checklist/releasecompliance' ]);
  }

}

