import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TokenStorageService } from '../account/token-storage.service';
import { OPEN, PENIDING_EXCEPTION, WIP_UPPERCASE } from '../release/release.constants';
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
  displayedColumns = ['actions', 'businessunit', 'name', 'version','milestone', 'date', 'releasetype','releasestatus','delete'];
  color = '#f1f3f4';
  isLoading = true;
  projectList:Project[]=[];
  backendTasks: BackendTask[] = [];
  taskToolTipMessage!:string;
  userName!:string;
  deleteTemplateRef!:any;
  selectedDeleteRelease!:Project;
  deleteDialogRef: any;
  openTask=0;
  wipTask=0;
  pendingTask=0;
  taskDialogRef: any;
  templateRef!:any;
  constructor(private service: HomeService, public dialog: MatDialog, private router: Router, private tokenStorage: TokenStorageService) {

  }

  ngOnInit(): void {
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('notificationSettings');
    localStorage.setItem('newProtexConfigList', JSON.stringify([]));
    localStorage.setItem('newBdbaConfigList', JSON.stringify([]));
    localStorage.setItem('newKwConfigList', JSON.stringify([]));
    this.userName = this.tokenStorage.getUser();
    this.getReleases();
    
  }

  getReleases(){
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


  onReleaseDelete(selectedProject: Project,taskDialog:any){
    this.selectedDeleteRelease=selectedProject;
    this.deleteTemplateRef = taskDialog;
    if(selectedProject.project_owner_email === this.userName){
      this.deleteDialogRef = this.dialog.open(this.deleteTemplateRef, {
        height: '18%',
        width: '22%',
        disableClose: true
      });
    }else{
      alert("You are not a user!!");
    }
    
  }

  closeRelease(){
    this.deleteDialogRef.close();
  }

  deleteRelease(){
    let res2 = this.service.deleteTask(this.selectedDeleteRelease.project_id!);
    let res3 = this.service.deleteStakeholder(this.selectedDeleteRelease.project_id!);
    let res4 = this.service.deleteKwConfig(this.selectedDeleteRelease.project_id!);
    let res5 = this.service.deleteBdbaConfig(this.selectedDeleteRelease.project_id!);
    let res6 = this.service.deleteProtexConfig(this.selectedDeleteRelease.project_id!);

    forkJoin([res2, res3, res4, res5,res6]).subscribe(([data2, data3, data4, data5, data6]) => {
      this.deleteProject();
    });
    
  }

  deleteProject(){
    this.service.deleteProject(this.selectedDeleteRelease.project_id!).subscribe(
      (result) => {
        if(result.message === 'success'){
          this.getReleases();
        }
        this.deleteDialogRef.close();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  openReleaseInfo() {
    this.router.navigate(['checklist/releaseinfo']);
  }


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

  getPendingTasks(){
    
    for(var task of this.backendTasks){
      if (task.status_id === WIP_UPPERCASE) {
        this.wipTask++;
      }
      if (task.status_id === OPEN) {
        this.openTask++;
      }
      if (task.status_id === PENIDING_EXCEPTION) {
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

