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
        this.checkReleaseDateStatus();
      },
      (err) => {
        console.log(err.name);
        this.isLoading = false;
      }
    );
  }

  numDaysBetween = function(d1:any, d2:any) {
    var diff = (new Date(d2).getTime() - d1.getTime());
    return diff / (1000 * 60 * 60 * 24);
  };

  checkReleaseDateStatus(){
    var ToDate = new Date();
    for(var project of this.projects){
      var days = this.numDaysBetween(ToDate,project.project_release_date);
      if(days < 14 && days > 1){
        project.toolTipMessage = "Release Date Due in "+Math.round(days)+" day(s)";
        project.isReaching=true;
      }
      else if(days >-1 && days < 1){
        project.isReaching=true;
        project.toolTipMessage = "Release Date Due Today";
      }
      else if(days < -1){
        project.isOverdue = true;
        project.toolTipMessage = "Release Date OverdueDue by "+ Math.abs(Math.round(days))+" day(s)";
      }
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

