import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenStorageService } from '../account/token-storage.service';
import { ADMIN_USER } from './home.constants';

import { BackendTask, Project } from './home.models';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects: Project[] = [];
  // ownerProject!:OwnerProject;
  @ViewChild("listview") element: any;
  displayedColumns = ['actions', 'businessunit', 'name', 'milestone', 'date', 'releasetype','releasestatus'];
  color = '#f1f3f4';
  isLoading = true;
  projectList:Project[]=[];
  backendTasks: BackendTask[] = [];
  taskToolTipMessage!:string;
  userName!:string;
  constructor(private service: HomeService, public dialog: MatDialog, private router: Router, private tokenStorage: TokenStorageService) {

  }

  ngOnInit(): void {
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('notificationSettings');
    localStorage.setItem('newProtexConfigList', JSON.stringify([]));
    localStorage.setItem('newBdbaConfigList', JSON.stringify([]));
    localStorage.setItem('newKwConfigList', JSON.stringify([]));
    this.userName = this.tokenStorage.getUser();
    if(this.userName === ADMIN_USER){
      this.getAdminProject();
    }else{
      this.getProjectByEmail(this.userName);
    }
    
  }

  getAdminProject() {
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

  getProjectByEmail(email:string) {
    this.service.getPojectsByEmail(email).subscribe(
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
      if(!project.project_task_status && project.project_release_status === 'Released'){
        project.isTaskCompleted=true;
        this.taskToolTipMessage = "Task(s) Not Completed";
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

  templateRef!:any;
  getTaskDetail(selectedProject: Project,taskDialog:any){
    this.templateRef = taskDialog;
    this.service.getSelectedProjectTask(selectedProject.project_id!).subscribe(
      (response) => {
        this.backendTasks = response;
        this.getPendingTasks();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }
  openTask=0;
  wipTask=0;
  pendingTask=0;
  taskDialogRef: any;
  getPendingTasks(){
    
    for(var task of this.backendTasks){
      if (task.status_id === 'WIP') {
        this.wipTask++;
      }
      if (task.status_id === 'Open') {
        this.openTask++;
      }
      if (task.status_id === 'Pending Exception') {
        this.pendingTask++;
      }
    }
    this.taskDialogRef = this.dialog.open(this.templateRef, {
      height: '22%',
      width: '20%',
      disableClose: true
    });

    // this.evidenceDialogRef.afterClosed().subscribe(() => {
    //   localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));
    // });
    // alert(wipTask+"------"+openTask+"-----"+pendingTask);
  }

  /**
   * Close Comments List Dialog
   */
   closeTaskDialog() {
    this.taskDialogRef.close();
    // this.commentDialog.hide();
  }


}

