import { Component, OnInit } from '@angular/core';
import { OwnerNotificationStatus } from '../home.models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  ownerDefaultChecklist:string[]=['assigntask','taskupdate','taskreleasestatusupdate'];
  stakeholderDefaultChecklist:string[]=['addrelease','releasestatusupdate','releaseschduleupdate'];
  qualOwnerDefaultChecklist:string[]=['taskupdate','taskreleaseschduleupdate','releasestatusupdate','releaseschduleupdate'];

  ownerNotificationStatus!:OwnerNotificationStatus;

  ownerNotificationList: any[] = [
    { value: 'assigntask', viewValue: 'Notify owner upon assignment to a task.', checked: false},
    { value: 'taskupdate', viewValue: 'Notify owner upon task status update.', checked: false },
    { value: 'commentupdate', viewValue: 'Notify owner upon task comments update.', checked: false },
    { value: 'taskreleasestatusupdate', viewValue: 'Notify all task owners when release status was updated.', checked: false },
    { value: 'taskreleaseschduleupdate', viewValue: 'Notify all task owners when release schedule was updated.' , checked: false},
  ];

  stakeholderNotificationList: any[] = [
    { value: 'addrelease', viewValue: 'Notify stakeholder when added to a release.' , checked: false},
    { value: 'removerelease', viewValue: 'Notify stakeholder when removed from a release.', checked: false },
    { value: 'releasestatusupdate', viewValue: 'Notify all stakeholders when release status was updated.' , checked: false},
    { value: 'releaseschduleupdate', viewValue: 'Notify all stakeholders when release schedule was updated.' , checked: false}
  ];

  qualOwnerNotificationList: any[] = [
    { value: 'assigntask', viewValue: 'Notify owner upon assignment to a task.', checked: false},
    { value: 'taskupdate', viewValue: 'Notify owner upon task status update.', checked: false },
    { value: 'commentupdate', viewValue: 'Notify owner upon task comments update.', checked: false },
    { value: 'taskreleasestatusupdate', viewValue: 'Notify all task owners when release status was updated.', checked: false },
    { value: 'taskreleaseschduleupdate', viewValue: 'Notify all task owners when release schedule was updated.' , checked: false},
    { value: 'addrelease', viewValue: 'Notify stakeholder when added to a release.' , checked: false},
    { value: 'removerelease', viewValue: 'Notify stakeholder when removed from a release.', checked: false },
    { value: 'releasestatusupdate', viewValue: 'Notify all stakeholders when release status was updated.' , checked: false},
    { value: 'releaseschduleupdate', viewValue: 'Notify all stakeholders when release schedule was updated.' , checked: false}
  ];


  constructor() {
    this.setDefaultChecks(this.ownerDefaultChecklist,this.stakeholderDefaultChecklist,this.qualOwnerDefaultChecklist);
  }

  setDefaultChecks(ownerDefaultChecklist:string[],stakeholderDefaultChecklist:string[],qualOwnerDefaultChecklist:string[]){
    for(let ownerCheck of ownerDefaultChecklist){
      this.ownerNotificationList.find(x => x.value == ownerCheck).checked = true;
    }
    for(let stakeholderCheck of stakeholderDefaultChecklist){
      this.stakeholderNotificationList.find(x => x.value == stakeholderCheck).checked = true;
    }
    for(let qualOwnerCheck of qualOwnerDefaultChecklist){
      this.qualOwnerNotificationList.find(x => x.value == qualOwnerCheck).checked = true;
    }
  }

  ngOnInit(): void {
    
  }

  checkOwner(event:any,item:any){
    this.ownerNotificationList.find(x => x.value == item.value).checked=true;
  }

  checkStakeholder(event:any,item:any){
    this.stakeholderNotificationList.find(x => x.value == item.value).checked=true;
  }

  checkQualOwner(event:any,item:any){
    this.qualOwnerNotificationList.find(x => x.value == item.value).checked=true;
  }

  /**
   * 
   */
  clearAll(){
    for(let ownerCheck of this.ownerNotificationList){
      this.ownerNotificationList.find(x => x.value == ownerCheck.value).checked = false;
    }
    for(let stakeholderCheck of this.stakeholderNotificationList){
      this.stakeholderNotificationList.find(x => x.value == stakeholderCheck.value).checked = false;
    }
    for(let qualOwnerCheck of this.qualOwnerNotificationList){
      this.qualOwnerNotificationList.find(x => x.value == qualOwnerCheck.value).checked = false;
    }
  }

  setDefault(){
    this,this.clearAll();
    this.setDefaultChecks(this.ownerDefaultChecklist,this.stakeholderDefaultChecklist,this.qualOwnerDefaultChecklist);
  }

  selectAll(){
    for(let ownerCheck of this.ownerNotificationList){
      this.ownerNotificationList.find(x => x.value == ownerCheck.value).checked = true;
    }
    for(let stakeholderCheck of this.stakeholderNotificationList){
      this.stakeholderNotificationList.find(x => x.value == stakeholderCheck.value).checked = true;
    }
    for(let qualOwnerCheck of this.qualOwnerNotificationList){
      this.qualOwnerNotificationList.find(x => x.value == qualOwnerCheck.value).checked = true;
    }
  }

  save(){
    console.log(JSON.stringify(this.stakeholderNotificationList));
  }

}
