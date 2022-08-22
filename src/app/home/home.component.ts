import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ChecklistMenuComponent } from './checklist.menu/checklist.menu.component';
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
  // public lines:GridLine = 'Both';
  public homeToolbar!:Object[];
  public homeEditSettings!: Object;
  public formatoptions!: Object;
  @ViewChild("listview") element: any;
  displayedColumns = ['actions','businessunit', 'name', 'milestone', 'date', 'releaseType'];
  color = '#f1f3f4';
  constructor(private service:HomeService, private router: Router) { 
    
  }

  ngOnInit(): void {
    localStorage.removeItem('selectedProject');
    this.getShortList();
    this.homeToolbar = [{ text: 'Add Project', tooltipText: 'Add Project', prefixIcon: 'e-add', id: 'Add' }];
    this.homeEditSettings = { allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.formatoptions = { type: 'dateTime', format: 'M/d/y hh:mm a' }
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

  openEditReleaseDialog(project:Project){
    alert(project.project_name);
  }

  deleteRelease(project:Project){
    alert(project.project_name);
  }

  // clickHandler(args: ClickEventArgs): void {
  //   if (args.item.id === 'Add') {
  //       // this.childEvent1.emit(true);
  //   }
  // }

  openReleaseInfo(){
    this.router.navigate([ 'checklist/releaseinfo' ]);
  }


}

