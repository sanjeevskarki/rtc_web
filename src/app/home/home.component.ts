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

  projects: Project[] = [];

  @ViewChild("listview") element: any;
  displayedColumns = ['actions', 'businessunit', 'name', 'milestone', 'date', 'releasetype','releasestatus'];
  color = '#f1f3f4';
  isLoading = true;
  projectList:Project[]=[];
  constructor(private service: HomeService, private router: Router) {

  }

  ngOnInit(): void {
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('notificationSettings');
    this.getShortList();

  }

  getShortList() {
    this.service.shortCheckList().subscribe(
      (response) => {
        this.projects = response;
        this.isLoading = false;
        this.checkComingReleases();
        this.checkOverdueProject();
        
      },
      (err) => {
        console.log(err.name);
        this.isLoading = false;
      }
    );
  }

  checkOverdueProject(){
    var ToDate = new Date();
    for(var project of this.projects){
      if (new Date(project.project_release_date).getTime() <= ToDate.getTime() && project.project_release_status !== 'Released') {
        project.isOverdue = true;
        project.isReaching=false;
      }
    }
  }

  numDaysBetween = function(d1:any, d2:any) {
    // alert("Date = "+d2);
    var diff = Math.abs(d1.getTime() - new Date(d2).getTime());
    return diff / (1000 * 60 * 60 * 24);
  };

  checkComingReleases(){
    var ToDate = new Date();
    for(var project of this.projects){
      var days = this.numDaysBetween(ToDate,project.project_release_date);
      if(days < 14){
        project.reachingInDays = Math.round(days);
        project.isReaching=true;
      }
      // if (new Date(project.project_release_date).getTime() <= ToDate.getTime() && project.project_release_status !== 'Released') {
      //   project.isOverdue = true;
      // }
    }
  }

  /**
   * Select a Release
   * @param selectedProject Selected Project
   */
  onReleaseSelect(selectedProject: Project) {
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
    // this.sharedChecklistService.setReleaseList(selecteditem["data"]);
    this.router.navigate(['checklist/releasecompliance']);
  }

  openReleaseInfo() {
    this.router.navigate(['checklist/releaseinfo']);
  }


}

