import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ATTACHMENTS_LOWER, BUSINESS_UNIT_LOWER, DATA_COLLECTIONS_LOWER, DATE_FORMAT, DATE_LOWER, DESCRIPTION_LOWER,
  EVIDENCES_LOWER, EXTERNAL_WITHOUT_HANDOVER_LOWER, EXTERNAL_WITH_HANDOVER_LOWER, HANDOVER_LOWER, INTERNAL_LOWER, MILESTONE_LOWER,
  NAME_LOWER, TYPE_LOWER
} from '../release.constants';
import { BusinessUnit, Milestone, Stakeholder } from '../release.models';
import { BackendGuideline, NewRelease, Project, ReleaseDetails, ReleaseTask } from 'src/app/home/home.models';
import { v4 as uuidv4 } from 'uuid';

import * as moment from 'moment';
import { ReleaseEditService } from './release.service';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseStakeholderComponent } from '../release.stakeholder/release.stakeholder.component';

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
  releaseForm!: FormGroup;
  public date: Object = new Date();
  public format: string = 'dd-MMM-yy';
  isWorkWeekVisible: boolean = false;
  workWeek!: string;
  public milestones: any[] = [];
  public milestonefields: Object = { text: 'Milestone', value: 'Id' };

  releaseTypes: any[] = [
    { value: EXTERNAL_WITH_HANDOVER_LOWER, viewValue: 'External With Handover' },
    { value: EXTERNAL_WITHOUT_HANDOVER_LOWER, viewValue: 'External Without Handover' },
    { value: INTERNAL_LOWER, viewValue: 'Internal' },
  ];

  public businessUnits: any[] = [];
  showSpinner: boolean = false;

  milestoneList: Milestone[] = [];
  selectedProject!: Project;
  @ViewChild('formlayout')
  public formlayout!: ElementRef;
  newProject!: Project;
  selectedMilestone!: string;
  selectedType!: string;
  selectedHandoverType!: string;
  guidlines: BackendGuideline[] = [];
  details: ReleaseDetails[] = [];
  releaseGuideline!: BackendGuideline;
  newGuidlines: BackendGuideline[] = [];
  task!: ReleaseTask;
  taskList: ReleaseTask[] = [];
  contactDisplayedColumns = ['name', 'email', 'wwid', 'role'];
  color = '#f1f3f4';
  public commentRule: { [name: string]: { [rule: string]: Object } } = {
    rte: { required: [true, 'Enter valid notes'] }
  };
  newStakeholder!:Stakeholder;
  stakeholders!:Stakeholder[];

  constructor(private formBuilder: FormBuilder, private service: ReleaseEditService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.stakeholders=[];
    this.isWorkWeekVisible = false;
    this.tempRelease = <NewRelease>{};
    this.getBusinessUnits();
    this.getMilestones();

    this.tempRelease = JSON.parse(localStorage.getItem("tempCheckList")!);
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);

    this.releaseForm = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, []],
      handover: [null, []],
      milestone: [null, Validators.required],
      date: [null, Validators.required],
      // contact: [null, Validators.required],
      // email: [null, [Validators.required,Validators.email]],
      businessunit: [null, Validators.required],
      description: [null, Validators.required],
      qualowner: [null, []],
      status: [null, []],
      attorney: [null, []],
      notes: [null, []],
    });

    this.addContactForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      wwid: [null, Validators.required],
      role: [null, Validators.required],
    });

  }

  newRelease!: NewRelease;
  createNewRelease() {
    this.newRelease = <NewRelease>{};
    this.newRelease.id = uuidv4();
    this.newRelease.name = this.releaseForm.controls[NAME_LOWER].value;
    this.newRelease.type = this.releaseForm.controls[TYPE_LOWER].value;
    this.newRelease.handover = this.releaseForm.controls[HANDOVER_LOWER].value;
    this.newRelease.milestone = this.releaseForm.controls[MILESTONE_LOWER].value;

    if (this.releaseForm.controls[DATE_LOWER].value !== null) {
      this.newRelease.date = this.releaseForm.controls[DATE_LOWER].value;
    } else {
      this.newRelease.date = new Date();
    }

    this.newRelease.description = this.releaseForm.controls[DESCRIPTION_LOWER].value;
    this.newRelease.businessunit = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    // this.newRelease.contact =this.releaseForm.controls['contact'].value;
    // this.newRelease.email = this.releaseForm.controls['email'].value;
  }


  saveAsDraft() {
    this.createNewRelease();
    localStorage.setItem("tempCheckList", JSON.stringify(this.newRelease));
    // this.toastObj.show(this.toasts[1]);
    this.releaseForm.reset();
    this.isWorkWeekVisible = false;
  }

  public newRowPosition: { [key: string]: Object }[] = [
    { id: 'Top', newRowPosition: 'Top' },
    { id: 'Bottom', newRowPosition: 'Bottom' }
  ];
  public localFields: Object = { text: 'newRowPosition', value: 'id' };

  onLoad(args: any) {
    /*Date need to be disabled*/
    if (args.date.getTime() <= new Date().getTime()) {
      args.isDisabled = true;
    }
  }

  onChange(args: any) {
    // alert("select date");
    this.workWeek = args.value;
    // this.workWeek = "ww"+moment(new Date(args.value), "MM-DD-YYYY").week()+"'"+new Date(args.value).getFullYear();
    this.isWorkWeekVisible = true;
  }

  getMilestones() {
    this.service.getMilestones().subscribe(
      (response) => {
        this.milestoneList = response;
        this.createMilestoneDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  businessUnitList: BusinessUnit[] = [];
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

  tempRelease!: NewRelease;
  createBusinessUnitDropdown() {
    if (this.businessUnitList != null) {
      for (var i = 0; i < this.businessUnitList.length; i++) {
        this.businessUnits.push({ value: this.businessUnitList[i].name, viewValue: this.businessUnitList[i].name });
      }
    }
    if (this.tempRelease) {
      this.setDraftForm();
    }
  }

  createMilestoneDropdown() {
    if (this.milestoneList != null) {
      for (var i = 0; i < this.milestoneList.length; i++) {
        this.milestones.push({ value: this.milestoneList[i].milestone, viewValue: this.milestoneList[i].milestone });
      }
    }
    this.editForm();
  }

  setDraftForm() {
    this.releaseForm.patchValue({
      name: this.tempRelease.name,
      type: this.tempRelease.type,
      milestone: this.tempRelease.milestone,
      handover: this.tempRelease.handover,
      date: this.tempRelease.date,
      // contact: this.tempRelease.contact,
      // email: this.tempRelease.email,
      businessunit: this.tempRelease.businessunit,
      description: this.tempRelease.description
    });
    this.workWeek = this.tempRelease.date!.toString();
    // this.workWeek = "ww"+moment(new Date(tempRelease.date), "MM-DD-YYYY").week()+"'"+new Date(tempRelease.date).getFullYear();
    this.isWorkWeekVisible = true;
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
    if (args.requestType === 'delete') {
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
    if (args.requestType === 'delete') {
      return false;
    }
  }

  // dummyMessageArray:Notes[]=[];
  // dummyMessage!:Notes;

  editForm() {
    if (this.selectedProject) {
      this.releaseForm.patchValue({
        name: this.selectedProject.project_name,
        // type: this.selectedProject.,
        milestone: this.selectedProject.project_milestone_id,
        // handover:this.selectedProject.handover,
        date: this.selectedProject.project_release_date,
        // contact: this.tempRelease.contact,
        // email: this.tempRelease.email,
        businessunit: this.selectedProject.project_business_unit_id,
        // description:this.selectedProject.description,
        qualowner: '',
        status: '',
        attorney: '',
        notes: ''
      });
      this.workWeek = this.selectedProject.project_release_date!.toString();
      this.isWorkWeekVisible = true;
    }
  }




  updateRelease() {
    // alert(this.releaseForm.controls['notes'].value);
    this.newProject = <Project>{};

    // alert(this.selectedProject);
    this.newProject.project_name = this.releaseForm.controls[NAME_LOWER].value;
    this.newProject.project_business_unit_id = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    this.newProject.project_milestone_id = this.releaseForm.controls[MILESTONE_LOWER].value;
    this.newProject.project_release_date = moment(this.releaseForm.controls[DATE_LOWER].value).format(DATE_FORMAT);
    this.newProject.project_description = this.releaseForm.controls[DESCRIPTION_LOWER].value;
    if (this.selectedProject) {
      // alert(this.selectedProject.project_id);
      this.newProject.project_id = this.selectedProject.project_id;
      this.updateProject();
    } else {
      // alert('adding new release');
      this.newProject.project_id = Math.floor(Math.random() * 90000) + 10000;
      this.getDetails();
    }

  }

  saveProject() {
    this.service.addProject(this.newProject).subscribe(() => {
      this.createGuideLine();
      this.createBuFolder();
    });
  }


  getDetails() {
    this.selectedMilestone = this.releaseForm.controls[MILESTONE_LOWER].value;
    this.selectedType = this.releaseForm.controls[TYPE_LOWER].value;
    this.selectedHandoverType = this.releaseForm.controls[HANDOVER_LOWER].value;
    this.service.details(this.selectedMilestone.toLocaleLowerCase()!, this.selectedHandoverType?.toLocaleLowerCase()!, this.selectedType?.toLocaleLowerCase()!).subscribe(
      (response) => {
        this.details = response;
        // this.createNewCheckList();
        this.saveProject();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  /**
 * Check folder on server if not exist create it.
 */
  createBuFolder() {
    let folders: string[] = [];
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim() + "\\" + EVIDENCES_LOWER);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim() + "\\" + DATA_COLLECTIONS_LOWER);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim() + "\\" + ATTACHMENTS_LOWER);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase().trim() + "\\" + this.newProject.project_milestone_id.toLocaleLowerCase().trim());
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim() + "\\" + this.newProject.project_name.toLocaleLowerCase());
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase());
    this.service.createFolder(folders).subscribe(() => {
    });
  }

  createGuideLine() {
    this.guidlines = [];
    for (var release of this.details!) {
      for (var detail of release.details) {
        this.releaseGuideline = <BackendGuideline>{};

        // this.releaseGuideline.id = Math.floor(Math.random()*90000) + 10000;
        this.releaseGuideline.vector_id = release.vector;
        this.releaseGuideline.task_name = detail.detail;
        this.releaseGuideline.task_description = detail.detail;
        this.releaseGuideline.required_evidence = "Yes";

        this.guidlines.push(this.releaseGuideline);
      }
    }
    this.saveGuidelines();
  }

  saveGuidelines() {
    this.service.addGuidelines(this.guidlines).subscribe(data => {
      this.newGuidlines = data;
      this.saveTask();
    });
  }

  saveTask() {
    this.taskList = [];
    for (var _guideline of this.newGuidlines!) {
      this.task = <ReleaseTask>{};
      this.task.guidelines_ptr_id = _guideline.id;
      this.task.owner = "";
      this.task.project_id_id = this.newProject.project_id!;
      this.task.status_id = "Open";
      this.taskList.push(this.task);
    }
    this.service.addTasks(this.taskList).subscribe(data => {
      this.releaseForm.reset();
      this.showSpinner = false;
    });
  }

  // updateExistingProject(){


  // }

  updateProject() {
    // alert(this.newProject.project_name);
    this.service.updateProject(this.newProject).subscribe(data => {
      // alert(data);
      // this.releaseForm.reset();
      this.clear(this.releaseForm);
    })

  }

  clear(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.controls[key].setErrors(null)
    });
  }

  temppStakeholders:Stakeholder[]=[];
  addStakeholder(){
    this.stakeholders=[];
    this.temppStakeholders
    const dialogRef = this.dialog.open(ReleaseStakeholderComponent, {
      height: '50%',
      width: '30%',
      backdropClass: 'backdropBackground',
      panelClass:'bg-blue'
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.newStakeholder = result.data;
      console.log('The dialog was closed'+this.newStakeholder.name);
      this.temppStakeholders.push(this.newStakeholder);
      this.stakeholders = this.temppStakeholders;
    });
  }

  addContactForm!: FormGroup;
  checkFormFields(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      if(key !== 'description')
      form.controls[key].setErrors(null)
    });
  }

  Submit() {

  }


}
