import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  ATTACHMENTS_LOWERCASE, BUSINESS_UNIT_LOWERCASE, DATA_COLLECTION_LOWERCASE, DATE_FORMAT, DATE_LOWERCASE, DELETE_LOWERCASE, DESCRIPTION_LOWERCASE,
  EVIDENCES_LOWERCASE, EXTERNAL_WITHOUT_HANDOVER, EXTERNAL_WITH_HANDOVER, HANDOVER_LOWERCASE, INTERNAL, MILESTONE_LOWERCASE,
  NAME_LOWERCASE, ownerNotificationList, qualOwnerNotificationList, QUAL_OWNER_EMAIL, QUAL_OWNER_NAME, RELEASE_STATUS, RELEASE_TYPE, stakeholderNotificationList,
  SUCCESS_LOWERCASE, TABLE_HEADER_COLOR, RELEASE_TYPE_LOWERCASE, CHECKLIST_LOWERCASE, NOT_ASSOCIATED_PLATFORM, PLATFORM, INGREDIENT, PLATFORM_LOWERCASE, GRADING_TYPE, VERSION_LOWERCASE
} from '../release.constants';
import { BusinessUnit, Milestone } from '../release.models';
import { NotificationSetting, Platform, ReleaseChecklist, Stakeholder } from 'src/app/home/home.models';
import { BackendGuideline, Project, ReleaseDetails, ReleaseTask } from 'src/app/home/home.models';

import * as moment from 'moment';
import { ReleaseEditService } from './release.edit.service';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseStakeholderComponent } from '../release.stakeholder/release.stakeholder.component';
import { ConfirmDeleteStakeholderDialogComponent } from '../confirmdeletestakeholderdialog/confirm.delete.stakeholder.dialog.component';
import { DatacollectionConfigureComponent } from '../datacollection.configure/datacollection.configure.component';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { Bdba_Config, Kw_Config, Protex_Config } from '../datacollection.configure/datacollection.models';

import { ACTIVE_LOWERCASE, CANCELLED_LOWERCASE, DEFERRED_LOWERCASE, openStatusArray, RELEASED_LOWERCASE } from 'src/app/home/home.constants';
import { ConfirmReleaseStatusComponent } from '../confirm.release.status/confirm.release.status.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-release.edit',
  templateUrl: './release.edit.component.html',
  styleUrls: ['./release.edit.component.scss'],
  providers: []
})
export class ReleaseEditComponent implements OnInit {

  public businessUnit: string = 'Select a Business Unit';
  public milestonePlaceholder: string = 'Select a Milestone';
  public type: string = 'Select a Release Type';
  releaseForm!: UntypedFormGroup;
  public date: Object = new Date();
  public format: string = 'dd-MMM-yy';
  isWorkWeekVisible: boolean = false;
  workWeek!: string;
  public milestones: any[] = [];
  public milestonefields: Object = { text: 'Milestone', value: 'Id' };

  releaseTypes: any[] = [
    { value: EXTERNAL_WITH_HANDOVER, viewValue: EXTERNAL_WITH_HANDOVER },
    { value: EXTERNAL_WITHOUT_HANDOVER, viewValue: EXTERNAL_WITHOUT_HANDOVER },
    { value: INTERNAL, viewValue: INTERNAL },
  ];

  gradingTypes: any[] = [
    { value: INGREDIENT, viewValue: INGREDIENT },
    { value: PLATFORM, viewValue: PLATFORM },
    { value: NOT_ASSOCIATED_PLATFORM, viewValue: NOT_ASSOCIATED_PLATFORM },
  ];

  releaseStatus: any[] = [
    { value: ACTIVE_LOWERCASE, viewValue: ACTIVE_LOWERCASE },
    { value: RELEASED_LOWERCASE, viewValue: RELEASED_LOWERCASE },
    { value: CANCELLED_LOWERCASE, viewValue: CANCELLED_LOWERCASE },
    { value: DEFERRED_LOWERCASE, viewValue: DEFERRED_LOWERCASE },
  ];

  public businessUnits: any[] = [];
  public platformProjects: string[] = [];
  showSpinner: boolean = false;

  milestoneList: Milestone[] = [];
  selectedProject!: Project;
  @ViewChild('formlayout')
  public formlayout!: ElementRef;
  newProject!: Project;
  selectedMilestone!: string;
  selectedBusinessUnit!: string;
  selectedType!: string;
  selectedHandoverType!: string;
  guidlines: BackendGuideline[] = [];
  details: ReleaseDetails[] = [];
  releaseGuideline!: BackendGuideline;
  newGuidlines: BackendGuideline[] = [];
  task!: ReleaseTask;
  taskList: ReleaseTask[] = [];
  stakeholderDisplayedColumns = ['notification', 'name', 'email', 'wwid', 'role', 'actions'];
  color = TABLE_HEADER_COLOR;
  public commentRule: { [name: string]: { [rule: string]: Object } } = {
    rte: { required: [true, 'Enter valid notes'] }
  };
  newStakeholder!: Stakeholder;
  stakeholders!: Stakeholder[];
  projectStakeholders!: Stakeholder[];
  tempProjectStakeholders!: Stakeholder[];
  milestoneOrderCategory: any = { 'VS0': 1, 'VS1': 2, 'VSV': 3, 'POC': 4, 'Pre-Alpha': 5, 'Alpha': 6, 'Beta': 7, 'PC': 8, 'Gold': 9 };
  formVaueChanged: boolean = false;
  protexConfigList: Protex_Config[] = [];
  kwConfigList: Kw_Config[] = [];
  bdbaConfigList: Bdba_Config[] = [];
  dataCollectionStatus!: string;
  existingStakeholder!: Stakeholder;
  notification!: any;
  notificationSetting!: NotificationSetting;
  stakeholderEmails: Stakeholder[] = [];
  public newRowPosition: { [key: string]: Object }[] = [
    { id: 'Top', newRowPosition: 'Top' },
    { id: 'Bottom', newRowPosition: 'Bottom' }
  ];
  public localFields: Object = { text: 'newRowPosition', value: 'id' };
  businessUnitList: BusinessUnit[] = [];
  editMode: boolean = false;
  taskCompletionStatus: boolean = true;
  newProtexConfigList: Protex_Config[] = [];
  newBdbaConfigList: Bdba_Config[] = [];
  newKwConfigList: Kw_Config[] = [];
  productLabel: string = 'Name';
  isGradeSelected: boolean = true;
  showMsg: boolean = false;
  tiers: string[] = [
    'Tier0',
    'Tier1', 
    'Tier3'
  ];
  constructor(private formBuilder: UntypedFormBuilder, private service: ReleaseEditService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.releaseForm.controls['name'].disable();
    this.stakeholders = [];
    this.isWorkWeekVisible = false;
    // this.tempRelease = <NewRelease>{};
    this.getBusinessUnits();
    this.getMilestones();
    this.getPlatformProject();


    this.projectStakeholders = [];
    // this.tempRelease = JSON.parse(localStorage.getItem("tempCheckList")!);
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);

    if (this.selectedProject) {
      this.editMode = true;
      this.getProjectStakeholders();
      this.checkDataCollectionStatus();
    } else {
      this.editMode = false;
    }

    this.releaseForm = this.formBuilder.group({
      name: [null ,[Validators.required]],
      handover: [null, []],
      milestone: [null, Validators.required],
      date: [null, Validators.required],
      // contact: [null, Validators.required],
      // email: [null, [Validators.required,Validators.email]],
      qualowneremail: [null, [Validators.required, Validators.email]],
      businessunit: [null, Validators.required],
      description: [null, []],
      qualowner: [null, Validators.required],
      status: [null, []],
      // attorneyname: [null, []],
      // attorneyemail: [null, [Validators.email]],
      releasestatus: [null, Validators.required],
      releasetype: [null, []],
      notes: [null, []],
      gradingtype: [null, Validators.required],
      platform: [null, []],
      version: [null, []],
      tier: [null, []],
    });


    this.addContactForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      wwid: [null, Validators.required],
      role: [null, Validators.required],
    });

    this.filteredOptions = this.releaseForm.controls['name'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value!)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.platformProjects.filter(option => option.toLowerCase().includes(filterValue));
  }
  filteredOptions!: Observable<string[]>;
  public initalValues: any;

  getProjectStakeholders() {
    this.projectStakeholders = [];
    this.service.getProjectStakeholders(this.selectedProject.project_id!).subscribe(
      (response) => {
        this.projectStakeholders = response;
        this.tempProjectStakeholders = response;
        // alert(this.tempProjectStakeholders);
        this.stakeholders = this.projectStakeholders;
        console.log(JSON.stringify(this.stakeholders));
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  // newRelease!: NewRelease;
  // createNewRelease() {
  //   this.newRelease = <NewRelease>{};
  //   this.newRelease.id = uuidv4();
  //   this.newRelease.name = this.releaseForm.controls[NAME_LOWERCASE].value;
  //   this.newRelease.type = this.releaseForm.controls[RELEASE_TYPE_LOWERCASE].value;
  //   this.newRelease.handover = this.releaseForm.controls[HANDOVER_LOWERCASE].value;
  //   this.newRelease.milestone = this.releaseForm.controls[MILESTONE_LOWERCASE].value;

  //   if (this.releaseForm.controls[DATE_LOWERCASE].value !== null) {
  //     this.newRelease.date = this.releaseForm.controls[DATE_LOWERCASE].value;
  //   } else {
  //     this.newRelease.date = new Date();
  //   }

  //   this.newRelease.description = this.releaseForm.controls[DESCRIPTION_LOWERCASE].value;
  //   this.newRelease.businessunit = this.releaseForm.controls[BUSINESS_UNIT_LOWERCASE].value;
  //   // this.newRelease.contact =this.releaseForm.controls['contact'].value;
  //   this.newRelease.email = this.releaseForm.controls['email'].value;
  // }

  onChange(args: any) {
    this.workWeek = args.value;
    // this.workWeek = "ww"+moment(new Date(args.value), "MM-DD-YYYY").week()+"'"+new Date(args.value).getFullYear();
    this.isWorkWeekVisible = true;
  }



  getMilestones() {
    this.service.getMilestones().subscribe(
      (response) => {
        this.milestoneList = response;
        this.createSortOrder();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }


  getBusinessUnits() {
    this.service.getBusinessUnit().subscribe(
      (response) => {
        this.businessUnitList = response;
        this.createBusinessUnitDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  createBusinessUnitDropdown() {
    if (this.businessUnitList != null) {
      for (var i = 0; i < this.businessUnitList.length; i++) {
        this.businessUnits.push({ value: this.businessUnitList[i].name, viewValue: this.businessUnitList[i].name });
      }
    }
  }

  platformList!: any[];
  getPlatformProject() {
    this.service.getPlatform().subscribe(
      (response) => {
        this.platformList = response;
        this.createPlatformDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  createPlatformDropdown() {
    if (this.platformList != null) {
      for (var i = 0; i < this.platformList.length; i++) {
        this.platformProjects.push(this.platformList[i].name);
      }
    }
  }

  createSortOrder() {
    this.milestoneList.sort((milestoneA, milestoneB) => {
      if (milestoneA.milestone !== milestoneB.milestone) {
        return this.milestoneOrderCategory[milestoneA.milestone] - this.milestoneOrderCategory[milestoneB.milestone];
      } else {
        return milestoneA.milestone - milestoneB.milestone;
      }
    });
    this.editForm();
    // this.createMilestoneDropdown();
  }

 

  actionBegin(args: any): void {
    let gridInstance: any = (<any>document.getElementById('Normalgrid')).ej2_instances[0];
    if (args.requestType === 'save') {
      if (gridInstance.pageSettings.currentPage !== 1 && gridInstance.editSettings.newRowPosition === 'Top') {
        args.index = (gridInstance.pageSettings.currentPage * gridInstance.pageSettings.pageSize) - gridInstance.pageSettings.pageSize;
      } else if (gridInstance.editSettings.newRowPosition === 'Bottom') {
        args.index = (gridInstance.pageSettings.currentPage * gridInstance.pageSettings.pageSize) - 1;
      }
    }
  }

  actionNoteComplete(args: any) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.showCloseIcon = false;
      dialog.height = 400;
      // change the header of the dialog
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Notes' : 'Add Notes';
    }
    if (args.requestType === DELETE_LOWERCASE) {
      return true;
    }
  }

  actionContactComplete(args: any) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.showCloseIcon = false;
      dialog.height = 400;
      // change the header of the dialog
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Contact' : 'Add Contact';
    }
    if (args.requestType === DELETE_LOWERCASE) {
      return false;
    }
  }
  previousSelectedValue!: string;
  editForm() {
    if (this.selectedProject) {
      this.previousSelectedValue = this.selectedProject.project_release_status;
      this.releaseForm.patchValue({
        name: this.selectedProject.project_name,
        releasetype: this.selectedProject.project_release_type,
        milestone: this.selectedProject.project_milestone_id,
        // handover:this.selectedProject.handover,
        date: this.selectedProject.project_release_date,
        // contact: this.tempRelease.contact,
        // email: this.tempRelease.email,
        businessunit: this.selectedProject.project_business_unit_id,
        // description:this.selectedProject.description,
        qualowner: this.selectedProject.project_owner_name,
        status: '',
        qualowneremail: this.selectedProject.project_owner_email,
        // attorneyname: this.selectedProject.project_attorney_name,
        // attorneyemail: this.selectedProject.project_attorney_email,
        notes: '',
        description: this.selectedProject.project_description,
        releasestatus: this.selectedProject.project_release_status,
        gradingtype: this.selectedProject.project_grading_type,
        platform: this.selectedProject.project_platform,
        version: this.selectedProject.project_version
      });
      this.workWeek = this.selectedProject.project_release_date!.toString();
      this.isWorkWeekVisible = true;
      if (this.selectedProject.project_grading_type === INGREDIENT) {
        this.isIngredient = true;
        this.isPlatform = false;
        this.productLabel = 'Ingredient Name';
      }
      else if (this.selectedProject.project_grading_type === PLATFORM) {
        this.isIngredient = false;
        this.isPlatform = true;
        this.productLabel = 'Platform Name';
      }
      else {
        this.productLabel = 'Product Name';
        this.isIngredient = false;
        this.isPlatform = false;
      }
    }

    this.initalValues = this.releaseForm.value;
  }


  isReallyDifferent() {
    if (JSON.stringify(this.initalValues) !== JSON.stringify(this.releaseForm.value)) {
      return false;
    } else {
      return true;
    }
  }

  updateRelease() {
    this.showMsg=true;
    this.newProject = <Project>{};

    this.newProject.project_name = this.releaseForm.controls[NAME_LOWERCASE].value;
    this.newProject.project_business_unit_id = this.releaseForm.controls[BUSINESS_UNIT_LOWERCASE].value;
    this.newProject.project_milestone_id = this.releaseForm.controls[MILESTONE_LOWERCASE].value;
    this.newProject.project_release_date = moment(this.releaseForm.controls[DATE_LOWERCASE].value).format(DATE_FORMAT);
    this.newProject.project_description = this.releaseForm.controls[DESCRIPTION_LOWERCASE].value;
    this.newProject.project_owner_name = this.releaseForm.controls[QUAL_OWNER_NAME].value;
    this.newProject.project_owner_email = this.releaseForm.controls[QUAL_OWNER_EMAIL].value;
    // this.newProject.project_attorney_name = this.releaseForm.controls[ATTORNEY_NAME].value;
    // this.newProject.project_attorney_email = this.releaseForm.controls[ATTORNEY_EMAIL].value;
    this.newProject.project_release_status = this.releaseForm.controls[RELEASE_STATUS].value;
    this.newProject.project_release_type = this.releaseForm.controls[RELEASE_TYPE].value;
    this.newProject.project_grading_type = this.releaseForm.controls[GRADING_TYPE].value;
    this.newProject.project_platform = this.releaseForm.controls[PLATFORM_LOWERCASE].value;
    this.newProject.project_task_status = this.taskCompletionStatus;
    this.newProject.project_version = this.releaseForm.controls[VERSION_LOWERCASE].value;
    if (this.selectedProject) {
      this.newProject.project_id = this.selectedProject.project_id;
      this.updateProject();
    } else {
      // this.newProject.project_id = Math.floor(Math.random() * 90000) + 10000;
      this.getStaticData();
    }
    alert(this.newProject.project_grading_type);
    if (this.newProject.project_grading_type === PLATFORM && this.platformProjects.indexOf(this.newProject.project_name!) === -1) {
      this.createPlatform(this.newProject.project_name!);
    }
    this.initalValues = this.releaseForm.value;
    localStorage.setItem('selectedProject', JSON.stringify(this.newProject));
  }

  
  

  savedPlatform!: Platform;
  createPlatform(platformName: string) {
    var paltform: Platform = <Platform>{};
    paltform.name = platformName;
    this.service.createPlatform(paltform).subscribe(
      (response) => {
        this.savedPlatform = response;
      },
      (err) => {
        console.log(err.name);
      }
    );

  }

  /**
   * Get Details for Guidelines file, Getting the file based on the Project Data.
   * (Currently we are picking those file from asset folder)
   */
  getStaticData() {
    this.selectedMilestone = this.releaseForm.controls[MILESTONE_LOWERCASE].value;
    this.selectedType = this.releaseForm.controls[RELEASE_TYPE_LOWERCASE].value;
    this.selectedHandoverType = this.releaseForm.controls[HANDOVER_LOWERCASE].value;
    this.selectedBusinessUnit = this.releaseForm.controls[BUSINESS_UNIT_LOWERCASE].value;
    this.service.details(this.selectedMilestone.toLocaleLowerCase()!, this.selectedHandoverType?.toLocaleLowerCase()!, this.selectedType?.toLocaleLowerCase()!, this.selectedBusinessUnit?.toLocaleLowerCase()!).subscribe(
      (response) => {
        this.details = response;
        this.saveProject();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  saveProject() {
    let project: Project;
    this.service.addProject(this.newProject).subscribe((data) => {
      project = data;
      this.showMsg=false;
      this.createGuideLine(project);
      this.createBuFolder();
      this.createStakeholders(project);
      this.createNotificationSetting(project);
      this.saveProtexConfig(project);
      this.saveBdbaConfig(project);
      this.saveKwConfig(project);
    });
  }

  createGuideLine(project: Project) {
    this.guidlines = [];
    for (var release of this.details!) {
      for (var detail of release.details) {
        this.releaseGuideline = <BackendGuideline>{};
        this.releaseGuideline.vector_id = release.vector;
        this.releaseGuideline.task_name = detail.detail;
        this.releaseGuideline.task_description = detail.detail;
        this.releaseGuideline.required_evidence = "Yes";

        this.guidlines.push(this.releaseGuideline);
      }
    }
    this.saveGuidelines(project.project_id!);
  }

  saveGuidelines(id: number) {
    this.service.addGuidelines(this.guidlines).subscribe(data => {
      this.newGuidlines = data;
      this.saveTask(id);
    });
  }

  /**
   * Check folder heirarchy on server if not exist create it.
   * It is used for saving Data Collection, Evidences and Attachments file
   */
  createBuFolder() {
    let folders: string[] = [];
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim() + "\\" + EVIDENCES_LOWERCASE);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim() + "\\" + DATA_COLLECTION_LOWERCASE);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim() + "\\" + ATTACHMENTS_LOWERCASE);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim());
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase());
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase());
    this.service.createFolder(folders).subscribe(() => {
    });
  }



  saveTask(id: number) {
    this.taskList = [];
    for (var _guideline of this.newGuidlines!) {
      this.task = <ReleaseTask>{};
      this.task.guidelines_ptr_id = _guideline.id;
      this.task.owner = "";
      this.task.project_id_id = id;
      this.task.status_id = "Open";
      this.taskList.push(this.task);
    }
    this.service.addTasks(this.taskList).subscribe(data => {
      this.showSpinner = false;
    });
  }

  createNotificationSetting(project: Project) {
    this.notification = <any>{};
    this.notificationSetting = <NotificationSetting>{};
    this.notificationSetting.qual_owner_id = project.project_owner_email;
    for (let ownerCheck of ownerNotificationList) {
      this.notification[ownerCheck.value] = ownerNotificationList.find(x => x.value == ownerCheck.value).checked;
    }
    for (let stakeholder of stakeholderNotificationList) {
      this.notification[stakeholder.value] = stakeholderNotificationList.find(x => x.value == stakeholder.value).checked;
    }
    for (let qualOwner of qualOwnerNotificationList) {
      this.notification[qualOwner.value] = qualOwnerNotificationList.find(x => x.value == qualOwner.value).checked;
    }
    this.notificationSetting.setting = this.notification;
    this.notificationSetting.id = Math.floor(Math.random() * 90000) + 10000;
    this.service.addNotification(this.notificationSetting).subscribe(data => {
    });

  }

  saveProtexConfig(project: Project) {
    this.newProtexConfigList = JSON.parse(localStorage.getItem('newProtexConfigList')!);
    if (this.newProtexConfigList.length > 0) {
      var protexConfigs: Protex_Config[] = [];

      for (var protexConfig of this.newProtexConfigList) {
        protexConfig.project_id = project.project_id;
        protexConfigs.push(protexConfig);
      }
      this.service.addProtexConfigs(protexConfigs).subscribe(data => {
        localStorage.setItem('newProtexConfigList', JSON.stringify([]));
      });
    }
  }

  saveBdbaConfig(project: Project) {
    this.newBdbaConfigList = JSON.parse(localStorage.getItem('newBdbaConfigList')!);
    if (this.newBdbaConfigList.length > 0) {
      var bdbaConfigs: Bdba_Config[] = [];

      for (var bdbaConfig of this.newBdbaConfigList) {
        bdbaConfig.project_id = project.project_id;
        bdbaConfigs.push(bdbaConfig);
      }
      this.service.addBdbaConfigs(bdbaConfigs).subscribe(data => {
        localStorage.setItem('newBdbaConfigList', JSON.stringify([]));
      });
    }
  }

  saveKwConfig(project: Project) {
    this.newKwConfigList = JSON.parse(localStorage.getItem('newKwConfigList')!);
    if (this.newKwConfigList.length > 0) {
      var kwConfigs: Kw_Config[] = [];

      for (var kwConfig of this.newKwConfigList) {
        kwConfig.project_id = project.project_id;
        kwConfigs.push(kwConfig);
      }
      this.service.addKwConfigs(kwConfigs).subscribe(data => {
        localStorage.setItem('newKwConfigList', JSON.stringify([]));
      });
    }
  }

  sendEmail() {
    // alert('sending email = '+this.stakeholderEmails);
    if (this.stakeholderEmails.length > 0) {
      this.service.sendEmail(this.stakeholderEmails).subscribe(data => {
        // this.stakeholders=[];
      });
    }

  }

  /**
   * Update the Existing Project
   */
  updateProject() {
    this.service.updateProject(this.newProject).subscribe(data => {
      this.showMsg=false;
    });

  }

  /**
   * Open Dialog for adding/updating a Stakeholder
   */
  openAddStakeholderDialog() {
    const dialogRef = this.dialog.open(ReleaseStakeholderComponent, {
      height: '55%',
      width: '30%',
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.stakeholders=[];
        this.newStakeholder = <Stakeholder>{};
        this.newStakeholder = result.data;
        if (this.tempProjectStakeholders?.indexOf(this.newStakeholder) == -1) {
          this.stakeholderEmails.push(this.newStakeholder);
        }

        // alert(this.projectStakeholders.length);
        this.projectStakeholders.unshift(this.newStakeholder);
        // alert(this.projectStakeholders.length);
        this.createStakeholderList(this.projectStakeholders);
        this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);

        if (this.selectedProject) {
          var tempStakeholders = [];
          this.newStakeholder.project_id = this.selectedProject.project_id;
          tempStakeholders.push(this.newStakeholder);
          this.service.addStakeholders(tempStakeholders).subscribe(data => {
            // this.sendEmail();
          });
          // this.createStakeholders(this.selectedProject);
        }
      }
    });
  }

  /**
   * Create a list of Stakeholder
   * @param stakeholders List of Stakeholder
   */
  createStakeholderList(stakeholders: Stakeholder[]) {
    this.stakeholders = [];
    for (var stakeholder of stakeholders) {
      this.stakeholders.push(stakeholder);
    }
  }

  createStakeholders(project: Project) {
    let tempStakeHolders: Stakeholder[] = [];
    if (this.stakeholders.length > 0) {
      for (var stakeholder of this.stakeholders) {
        stakeholder.project_id = project.project_id;
        tempStakeHolders.push(stakeholder);
      }

      this.service.addStakeholders(tempStakeHolders).subscribe(data => {
        // this.sendEmail();
      });
    }
  }

  addContactForm!: UntypedFormGroup;
  checkFormFields(form: UntypedFormGroup): void {
    Object.keys(form.controls).forEach(key => {
      if (key !== DESCRIPTION_LOWERCASE)
        form.controls[key].setErrors(null)
    });
  }

  /**
   * Delete the selected stakeholder
   * @param selectedStakeholder selected stakeholder to delete
   */
  deleteStakeholder(selectedStakeholder: Stakeholder) {
    const deleteStakeholderDialogRef = this.dialog.open(ConfirmDeleteStakeholderDialogComponent, {
      height: '18%',
      width: '23%',
      disableClose: true,
      data: { name: selectedStakeholder.name }
    });

    deleteStakeholderDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === DELETE_LOWERCASE) {
          this.service.deleteStakeholder(selectedStakeholder).subscribe(data => {
            if (data.message === SUCCESS_LOWERCASE) {
              const index = this.projectStakeholders.indexOf(selectedStakeholder, 0);
              // alert(index)
              if (index > -1) {
                this.projectStakeholders.splice(index, 1);
                this.createStakeholderList(this.projectStakeholders);
              }
            }
          });
        }
      }
    });
  }

  /**
   * Open Updated Stakeholder Dialog
   * @param selectedStakeholder Selected Stakeholder
   */
  updateStakeholder(selectedStakeholder: Stakeholder) {
    const dialogRef = this.dialog.open(ReleaseStakeholderComponent, {
      height: '50%',
      width: '30%',
      disableClose: true,
      data: {
        data: selectedStakeholder
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stakeholderEmails = [];
        // this.stakeholders=[];
        this.newStakeholder = <Stakeholder>{};
        this.newStakeholder = result.data;
        this.existingStakeholder = this.tempProjectStakeholders.find(x => x.id == this.newStakeholder.id)!;
        // if(JSON.stringify(this.existingStakeholder) !== JSON.stringify(this.newStakeholder)){
        const index = this.projectStakeholders.indexOf(this.existingStakeholder, 0);
        if (index > -1) {
          this.service.updateStakeholder(this.newStakeholder).subscribe(data => {
            this.projectStakeholders.splice(index, 1);
            this.projectStakeholders.unshift(this.newStakeholder);
            this.createStakeholderList(this.projectStakeholders);
          })
        }
      }
    });
  }

  /**
   * Open Data Collection Dialog
   */
  openDataCollectionDialog() {
    const dialogRef = this.dialog.open(DatacollectionConfigureComponent, {
      height: '70%',
      width: '90%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.checkDataCollectionStatus();
    });
  }

  /**
   * Select Data Collection status based on the result
   */
  checkDataCollectionStatus() {
    if (this.selectedProject) {
      let res1 = this.service.getProtexConfig(this.selectedProject.project_id!);
      let res2 = this.service.getKwConfig(this.selectedProject.project_id!);
      let res3 = this.service.getBdbaConfig(this.selectedProject.project_id!);
      forkJoin([res1, res2, res3]).subscribe(([data1, data2, data3]) => {
        this.protexConfigList = data1;
        this.kwConfigList = data2;
        this.bdbaConfigList = data3;
        if (this.protexConfigList!.length > 0 || this.kwConfigList!.length > 0 || this.bdbaConfigList!.length > 0) {
          if (this.protexConfigList.find(x => x.user_added) || this.bdbaConfigList.find(x => x.user_added)) {
            this.dataCollectionStatus = ACTIVE_LOWERCASE;
          } else {
            this.dataCollectionStatus = "Not Active";
          }
        } else {
          this.dataCollectionStatus = "Not Active";
        }
      });
    }
  }


  releaseStatusChange() {
    if (this.selectedProject) {
      if (this.releaseForm.controls[RELEASE_STATUS].value === RELEASED_LOWERCASE) {
        this.checkAllTaskStatus();
      } else {
        this.taskCompletionStatus = true;
      }
    }
  }


  checkAllTaskStatus() {
    var storedReleaseChecklist: ReleaseChecklist[] = JSON.parse(localStorage.getItem(CHECKLIST_LOWERCASE)!);
    for (var task of storedReleaseChecklist) {
      if (openStatusArray.find((str) => str === task.status)) {
        const dialogRef = this.dialog.open(ConfirmReleaseStatusComponent, {
          height: '25%',
          width: '30%',
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result.data === 'close') {
              this.releaseForm.patchValue({
                releasestatus: this.previousSelectedValue
              });
            }
            if (result.data === 'change') {
              this.taskCompletionStatus = false;
            }
          }
        });
        break;
      }
    }
  }

  isIngredient: boolean = false;
  isPlatform: boolean = false;
  
  selectGrade(selectedGrade: string) {
    // alert(selectedGrade);
    if (selectedGrade === INGREDIENT) {
      this.productLabel = 'Ingredient Name';
      this.isIngredient = true;
      this.isPlatform = false;
      this.isGradeSelected = false;
    }
    else if (selectedGrade === PLATFORM) {
      this.productLabel = 'Platform Name';
      this.isIngredient = false;
      this.isPlatform = true;
      this.isGradeSelected = false;
    }
    else {
      this.productLabel = 'Project Name';
      this.isIngredient = false;
      this.isPlatform = false;
      this.isGradeSelected = false;
    }
  }

  selectBU(selectedBusinessUnit: string){
    let milestoneList:Milestone[]=[];
    if(selectedBusinessUnit === 'AXG'){
      milestoneList = this.milestoneList.filter(x => x.business_unit === selectedBusinessUnit);
      // alert();
      this.createMilestoneDropdown(milestoneList);
    }else{
      this.Axg=false;
      // milestoneList = this.milestoneList.filter(({business_unit}) => !business_unit!.includes(selectedBusinessUnit))
      milestoneList = this.milestoneList.filter(r => r.business_unit === null)
      
      this.createMilestoneDropdown(milestoneList);
    }
  }


  createMilestoneDropdown(mList: Milestone[]) {
    this.milestones =[];
    if (mList != null) {
      for (var i = 0; i < mList.length; i++) {
        this.milestones.push({ value: mList[i].milestone, viewValue: mList[i].milestone });
      }
    }
  }

  changeEmailNotification(event: MatCheckboxChange, item: any) {
    // alert(item.email_notification);
    // alert(event.checked);
    this.service.changeEmailNotification(item.id, event.checked).subscribe((status) => {
    });
  }

  Axg:boolean=false;
  preSiMilestone:string[]=['IPVal 0.85','IPVal 0.5/ VS0','IPVal 1/ VS1','VSV']
  selectMilestone(selectedMilestone: string){
    var bu = this.releaseForm.controls[BUSINESS_UNIT_LOWERCASE].value;
    let milestoneList:Milestone[]=[];
    if(bu === 'AXG' && this.preSiMilestone.indexOf(selectedMilestone) !== -1){
      this.Axg=true;
      // milestoneList = this.milestoneList.filter(x => x.business_unit === selectedBusinessUnit);
      // // alert();
      // this.createMilestoneDropdown(milestoneList);
    }
    else{
      this.Axg=false;
      // milestoneList = this.milestoneList.filter(({business_unit}) => !business_unit!.includes(selectedBusinessUnit))
      milestoneList = this.milestoneList.filter(r => r.business_unit === null)
      
      this.createMilestoneDropdown(milestoneList);
    }
  }

}
