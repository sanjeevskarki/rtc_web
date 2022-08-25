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
  displayedColumns = ['actions', 'businessunit', 'name', 'milestone', 'date', 'releaseType'];
  color = '#f1f3f4';
  isLoading = true;
  constructor(private service: HomeService, private router: Router) {

  }

  ngOnInit(): void {
    localStorage.removeItem('selectedProject');
    this.getShortList();

  }

  getShortList() {
    this.service.shortCheckList().subscribe(
      (response) => {
        this.projects = response;
        this.isLoading = false;
      },
      (err) => {
        console.log(err.name);
        this.isLoading = false;
      }
    );
  }

  onClick(selectedProject: Project) {
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
    // this.sharedChecklistService.setReleaseList(selecteditem["data"]);
    this.router.navigate(['checklist/releasecompliance']);
  }

  openReleaseInfo() {
    this.router.navigate(['checklist/releaseinfo']);
  }


}

