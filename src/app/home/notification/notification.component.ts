import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NotificationSetting, NotificationSettingAttributes, OwnerNotificationStatus, Project } from '../home.models';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  ownerDefaultChecklist: string[] = ['assigntask', 'taskupdate', 'taskreleasestatusupdate'];
  stakeholderDefaultChecklist: string[] = ['addrelease', 'releasestatusupdate', 'releaseschduleupdate'];
  qualOwnerDefaultChecklist: string[] = ['taskupdate_qualowner', 'taskreleasestatusupdate_qualowner', 'releasestatusupdate_qualowner', 'releasescheduleupdate_qualowner'];

  ownerNotificationStatus!: OwnerNotificationStatus;
  notificationSetting!: NotificationSetting;
  notification!: any;
  selectedProject!: Project;
  existingNotificationSetting!: NotificationSetting;
  ownerExistingChecklist!: string[];
  stakeholderExistingChecklist!: string[];
  qualOwnerExistingChecklist!: string[];

  ownerNotificationList: any[] = [
    { value: 'assigntask', viewValue: 'Notify owner upon assignment to a task.', checked: false },
    { value: 'taskupdate', viewValue: 'Notify owner upon task status update.', checked: false },
    { value: 'commentupdate', viewValue: 'Notify owner upon task comments update.', checked: false },
    { value: 'taskreleasestatusupdate', viewValue: 'Notify all task owners when release status was updated.', checked: false },
    { value: 'taskreleaseschduleupdate', viewValue: 'Notify all task owners when release schedule was updated.', checked: false },
  ];

  stakeholderNotificationList: any[] = [
    { value: 'addrelease', viewValue: 'Notify stakeholder when added to a release.', checked: false },
    { value: 'removerelease', viewValue: 'Notify stakeholder when removed from a release.', checked: false },
    { value: 'releasestatusupdate', viewValue: 'Notify all stakeholders when release status was updated.', checked: false },
    { value: 'releaseschduleupdate', viewValue: 'Notify all stakeholders when release schedule was updated.', checked: false }
  ];

  qualOwnerNotificationList: any[] = [
    { value: 'assigntask_qualowner', viewValue: 'Notify owner upon assignment to a task.', checked: false },
    { value: 'taskupdate_qualowner', viewValue: 'Notify owner upon task status update.', checked: false },
    { value: 'commentupdate_qualowner', viewValue: 'Notify owner upon task comments update.', checked: false },
    { value: 'taskreleasestatusupdate_qualowner', viewValue: 'Notify all task owners when release status was updated.', checked: false },
    { value: 'taskreleaseschduleupdate_qualowner', viewValue: 'Notify all task owners when release schedule was updated.', checked: false },
    { value: 'addrelease_qualowner', viewValue: 'Notify stakeholder when added to a release.', checked: false },
    { value: 'removerelease_qualowner', viewValue: 'Notify stakeholder when removed from a release.', checked: false },
    { value: 'releasestatusupdate_qualowner', viewValue: 'Notify all stakeholders when release status was updated.', checked: false },
    { value: 'releasescheduleupdate_qualowner', viewValue: 'Notify all stakeholders when release schedule was updated.', checked: false }
  ];


  constructor(private service: NotificationService,) {

  }

  ngOnInit(): void {
    this.notification = <NotificationSettingAttributes>{};
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.ownerExistingChecklist = [];
    this.stakeholderExistingChecklist = [];
    this.qualOwnerExistingChecklist = [];
    // this.service.getNotifications(this.selectedProject.project_owner_email).subscribe((response) => {

    this.existingNotificationSetting = JSON.parse(localStorage.getItem('notificationSettings')!);;
    if (this.existingNotificationSetting) {
      console.log(JSON.stringify(this.existingNotificationSetting.setting));
      for (let ownerCheck of this.ownerNotificationList) {
        if (this.existingNotificationSetting.setting[ownerCheck.value]) {
          this.ownerExistingChecklist.push(ownerCheck.value);
        }
      }
      for (let stakeholder of this.stakeholderNotificationList) {
        if (this.existingNotificationSetting.setting[stakeholder.value]) {
          this.stakeholderExistingChecklist.push(stakeholder.value);
        }
      }
      for (let qualOwner of this.qualOwnerNotificationList) {
        if (this.existingNotificationSetting.setting[qualOwner.value]) {
          this.qualOwnerExistingChecklist.push(qualOwner.value);
        }
      }
      this.setDefaultChecks(this.ownerExistingChecklist, this.stakeholderExistingChecklist, this.qualOwnerExistingChecklist);
    } else {
      this.setDefaultChecks(this.ownerDefaultChecklist, this.stakeholderDefaultChecklist, this.qualOwnerDefaultChecklist);
    }

    // });

  }

  /**
   * Save the Notification Setting once the user navigate from this page
   */
  ngOnDestroy(): void {
    this.notification = <any>{};
    this.notificationSetting = <NotificationSetting>{};
    this.notificationSetting.qual_owner_id = this.selectedProject.project_owner_email;
    for (let ownerCheck of this.ownerNotificationList) {
      this.notification[ownerCheck.value] = this.ownerNotificationList.find(x => x.value == ownerCheck.value).checked;
    }
    for (let stakeholder of this.stakeholderNotificationList) {
      this.notification[stakeholder.value] = this.stakeholderNotificationList.find(x => x.value == stakeholder.value).checked;
    }
    for (let qualOwner of this.qualOwnerNotificationList) {
      this.notification[qualOwner.value] = this.qualOwnerNotificationList.find(x => x.value == qualOwner.value).checked;
    }
    this.notificationSetting.setting = this.notification;
    if (this.existingNotificationSetting) {
      this.notificationSetting.id = this.existingNotificationSetting.id;
      this.service.updateNotification(this.notificationSetting).subscribe(data => {

      });
    } else {
      this.notificationSetting.id = Math.floor(Math.random() * 90000) + 10000;
      this.service.addNotification(this.notificationSetting).subscribe(data => {

      });
    }
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSetting));
  }

  /**
   * Select the Default Option
   * @param ownerDefaultChecklist Default Task Owner Option List
   * @param stakeholderDefaultChecklist Default Stakeholder Option List
   * @param qualOwnerDefaultChecklist Default Qual Owner Option List
   */
  setDefaultChecks(ownerDefaultChecklist: string[], stakeholderDefaultChecklist: string[], qualOwnerDefaultChecklist: string[]) {
    for (let ownerCheck of ownerDefaultChecklist) {
      this.ownerNotificationList.find(x => x.value == ownerCheck).checked = true;
    }
    for (let stakeholderCheck of stakeholderDefaultChecklist) {
      this.stakeholderNotificationList.find(x => x.value == stakeholderCheck).checked = true;
    }
    for (let qualOwnerCheck of qualOwnerDefaultChecklist) {
      this.qualOwnerNotificationList.find(x => x.value == qualOwnerCheck).checked = true;
    }
  }

  /**
   * Select Owner Notification option
   * @param event Mat Checkbox event 
   * @param item Checked Item
   */
  checkOwner(event: MatCheckboxChange, item: any) {
    // alert(item.value+" -- "+event.checked);
    this.ownerNotificationList.find(x => x.value == item.value).checked = event.checked;
  }

  /**
   * Select Stakeholder Owner Notification option
   * @param event Mat Checkbox event 
   * @param item Checked Item
   */
  checkStakeholder(event: MatCheckboxChange, item: any) {
    this.stakeholderNotificationList.find(x => x.value == item.value).checked = event.checked;
  }

  /**
   * Select Qual Owner Notification option
   * @param event Mat Checkbox event 
   * @param item Checked Item
   */
  checkQualOwner(event: MatCheckboxChange, item: any) {
    this.qualOwnerNotificationList.find(x => x.value == item.value).checked = event.checked;
  }

  /**
   * Uncheck all the Notification Setting option
   */
  clearAll() {
    for (let ownerCheck of this.ownerNotificationList) {
      this.ownerNotificationList.find(x => x.value == ownerCheck.value).checked = false;
    }
    for (let stakeholderCheck of this.stakeholderNotificationList) {
      this.stakeholderNotificationList.find(x => x.value == stakeholderCheck.value).checked = false;
    }
    for (let qualOwnerCheck of this.qualOwnerNotificationList) {
      this.qualOwnerNotificationList.find(x => x.value == qualOwnerCheck.value).checked = false;
    }
  }

  /**
   * Set Notification Setting to Default
   */
  setDefault() {
    this.clearAll();
    this.setDefaultChecks(this.ownerDefaultChecklist, this.stakeholderDefaultChecklist, this.qualOwnerDefaultChecklist);
  }

  /**
   * Select all the Notification Setting option
   */
  selectAll() {
    for (let ownerCheck of this.ownerNotificationList) {
      this.ownerNotificationList.find(x => x.value == ownerCheck.value).checked = true;
    }
    for (let stakeholderCheck of this.stakeholderNotificationList) {
      this.stakeholderNotificationList.find(x => x.value == stakeholderCheck.value).checked = true;
    }
    for (let qualOwnerCheck of this.qualOwnerNotificationList) {
      this.qualOwnerNotificationList.find(x => x.value == qualOwnerCheck.value).checked = true;
    }
  }

  trackByFn(index:any, item:any) {    
    return item.id; // unique id corresponding to the item
  }

}
