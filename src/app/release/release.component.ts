import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { AnimationModel, ILoadedEventArgs, ProgressTheme } from '@syncfusion/ej2-angular-progressbar';
import { BackendGuideline, NewRelease, Project, ReleaseDetails, ReleaseTask } from '../home/home.models';
import { ReleaseService } from './release.service';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Subject } from 'rxjs';
import { EmitType } from '@syncfusion/ej2-base';
import { BusinessUnit,  Milestone } from './release.models';
import { ALPHA, BUSINESS_UNIT_LOWER, DATE_FORMAT, DATE_LOWER, DESCRIPTION_LOWER, EXTERNAL_LOWER, HANDOVER_LOWER, INTERNAL_LOWER, MILESTONE_LOWER, NAME_LOWER, POC_LOWER, POC_UPPER, PRE_ALPHA, TYPE_LOWER } from './release.constants';

// export type Status = 'Done' | 'WIP'| 'N/A' | 'Open';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})

export class ReleaseComponent implements OnInit {

  @ViewChild('releaseConfirmDialog')
  public releaseConfirmDialog!: DialogComponent;

  releaseForm!: FormGroup;
  public isModal: Boolean = true;
  // set the placeholder to DropDownList input element
  public type: string = 'Select a Release Type';
  public handover: string = 'Select a Handover Type';
  public businessUnit: string = 'Select a Business Unit';
  public milestonePlaceholder: string = 'Select a Milestone';
  public description: string = 'Project Description';
  @ViewChild('release')
  public releaseObj!: DropDownListComponent;
  // public value: string = 'dd-MMM-yy';
  // public format: string = 'dd-MMM-yy';
  // public formatData: string[] = ['dd-MMM-yy', 'yyyy-MM-dd', 'dd-MMMM'];
  // set the height of the popup element
  public height: string = '220px';
  public date: Object = new Date();
  public format: string = 'dd-MMM-yy';
  
  showSpinner :boolean=false; 
  public width: string = '70';
  public spinnerheight: string = '70';
  public animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  public isIndeterminate3: boolean = true;
  public value3: number = 20;
  public min3: number = 0;
  public max3: number = 100;
  public type3: string = 'Circular';
  selectedMilestone!:string;
  selectedType!:string;
  selectedHandoverType!:string;
  isExternal:boolean=false;

  public releaseTypes: Object[] = [
    { Id: EXTERNAL_LOWER, Type: 'External' },
    { Id: INTERNAL_LOWER, Type: 'Internal' }
  ];
  public milestones: Object[] = [];
  public businessUnits: Object[] = [];
  public handoverType: Object[] = [
    { Id: 'whandover', HandoverType: 'With Handover' },
    { Id: 'wohandover', HandoverType: 'Without Handover' }
  ];

  // maps the appropriate column to fields property
  public releaseTypeFields: Object = { text: 'Type', value: 'Id' };
  public handoverTypeFields: Object = { text: 'HandoverType', value: 'Id' };
  public milestonefields: Object = { text: 'Milestone', value: 'Id' };
  public businessUnitfields: Object = { text: 'BusinessUnit', value: 'Id' };

  details:ReleaseDetails[]=[];
  // newChecklist!:Checklist;
  newProject!:Project;
  // releaseChecklist!: ReleaseChecklist;
  
  // release: ReleaseChecklist[]=[];
  // existingCheckList:Checklist[]=[];

  @ViewChild('toasttype')
  private toastObj!: ToastComponent;
  @Output() childEvent = new EventEmitter<any>();
  public toastPosition: ToastPositionModel = { X: 'Right' };

  public toasts: { [key: string]: Object }[] = [
    { title: 'Error!', content: 'You have already added a link. Please remove it for upoading a file', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Success!', content: 'Release Drafted Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Release Generate Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  ];

  newRelease!:NewRelease;
  workWeek!:string;
  isWorkWeekVisible:boolean=false;
  milestoneList:Milestone[]=[];
  businessUnitList:BusinessUnit[]=[];
  public target: string = '#modalTarget';
  public hidden: boolean = false;
  
  
  public animationSettings: AnimationSettingsModel = { effect: 'None' };

  releaseGuideline!:BackendGuideline;
  guidlines:BackendGuideline[]=[];
  newGuidlines:BackendGuideline[]=[];
  task!:ReleaseTask;
  taskList:ReleaseTask[]=[];
  tempRelease!:NewRelease;
  
  constructor(private formBuilder: FormBuilder, private service:ReleaseService) { }

  ngOnInit(): void {
    this.tempRelease = <NewRelease>{};
    this.getMilestones();
    this.getBusinessUnits();
    this.tempRelease = JSON.parse(localStorage.getItem("tempCheckList")!);
    // this.existingCheckList = JSON.parse(localStorage.getItem("checkList")!);
    // this.existingCheckList = this.existingCheckList === null ? []:this.existingCheckList

    this.releaseForm = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      handover: [null, []],
      milestone:  [null, Validators.required],
      date: [null, Validators.required],
      // contact: [null, Validators.required],
      // email: [null, [Validators.required,Validators.email]],
      businessunit: [null, Validators.required],
      description:[null, Validators.required],
    });
    
  }

  

  // public onChange(args: any): void {
  //   let value: Element = document.getElementById('value')!;
  //   let text: Element = document.getElementById('text')!;
  //   // update the text and value property values in property panel based on selected item in DropDownList
  //   value.innerHTML = this.releaseObj.value.toString();
  //   text.innerHTML = this.releaseObj.text;
  // }

  onValueChange(args: any):void {
    /*Displays selected date in the label*/
    (<HTMLInputElement>document.getElementById('selected')).textContent = 'Selected Value: ' + args.value.toLocaleDateString();
  }

  onTypeSelect(args:any): void {
    if(args.value === EXTERNAL_LOWER && (this.releaseForm.controls[MILESTONE_LOWER].value === POC_UPPER || this.releaseForm.controls[MILESTONE_LOWER].value === PRE_ALPHA || this.releaseForm.controls[MILESTONE_LOWER].value === ALPHA)){
      this.isExternal=true;
    }else{
      this.isExternal=false;
    }
  }

  onMilestoneSelect(args:any): void {
    if((args.value === POC_UPPER || args.value === PRE_ALPHA || args.value === ALPHA) && this.releaseForm.controls[TYPE_LOWER].value === EXTERNAL_LOWER){
      this.isExternal=true;
    }else{
      this.isExternal=false;
    }
  }

  saveRelease(){
    this.showSpinner = true;
    this.getDetails();
    this.isWorkWeekVisible=false;
  }

  draftRelease(){
    this.createNewRelease();
    localStorage.setItem("tempCheckList", JSON.stringify(this.newRelease));
    this.toastObj.show(this.toasts[1]);
    this.releaseForm.reset();
    this.isWorkWeekVisible=false;
  }

  resetRelease(){
    this.releaseForm.reset();
    localStorage.removeItem("tempCheckList");
    this.isWorkWeekVisible=false;
  }

  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  public load(args: ILoadedEventArgs): void {
    let div: HTMLCollection = document.getElementsByClassName('progress-text-align');
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.progressBar.theme = <ProgressTheme>(selectedTheme.charAt(0).toUpperCase() +
        selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
    if(args.progressBar.theme === 'HighContrast' || args.progressBar.theme === 'Bootstrap5Dark' || args.progressBar.theme === 'BootstrapDark' || args.progressBar.theme === 'FabricDark'
    || args.progressBar.theme === 'TailwindDark' || args.progressBar.theme === 'MaterialDark' || args.progressBar.theme === 'FluentDark') {
        for (let i = 0; i < div.length; i++) {
            div[i].setAttribute('style', 'color:white');
        }
    }
  }

  createNewRelease() {
    this.newRelease =<NewRelease>{};
    this.newRelease.id = uuidv4();
    this.newRelease.name = this.releaseForm.controls[NAME_LOWER].value;
    this.newRelease.type = this.releaseForm.controls[TYPE_LOWER].value;
    this.newRelease.handover = this.releaseForm.controls[HANDOVER_LOWER].value;
    this.newRelease.milestone = this.releaseForm.controls[MILESTONE_LOWER].value;
    this.newRelease.date = new Date(this.releaseForm.controls[DATE_LOWER].value);
    this.newRelease.description = this.releaseForm.controls[DESCRIPTION_LOWER].value;
    this.newRelease.businessunit = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    // this.newRelease.contact =this.releaseForm.controls['contact'].value;
    // this.newRelease.email = this.releaseForm.controls['email'].value;
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


  getDetails() {
    this.selectedMilestone=this.releaseForm.controls[MILESTONE_LOWER].value;
    this.selectedType=this.releaseForm.controls[TYPE_LOWER].value;
    this.selectedHandoverType=this.releaseForm.controls[HANDOVER_LOWER].value;
    this.service.details(this.selectedMilestone.toLocaleLowerCase()!,this.selectedHandoverType?.toLocaleLowerCase()!,this.selectedType?.toLocaleLowerCase()!).subscribe(
      (response) => {
        this.details = response;
        // this.createNewCheckList();
        this.createNewProject();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  createNewProject(){
    this.newProject=<Project>{};
    this.newProject.project_id = Math.floor(Math.random()*90000) + 10000;
    this.newProject.project_name = this.releaseForm.controls[NAME_LOWER].value;
    this.newProject.project_business_unit_id = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    this.newProject.project_milestone_id = this.releaseForm.controls[MILESTONE_LOWER].value;
    this.newProject.project_release_date = moment(this.releaseForm.controls[DATE_LOWER].value).format(DATE_FORMAT);
    this.newProject.project_description = this.releaseForm.controls[DESCRIPTION_LOWER].value;
    this.saveProject();
    
  }

  saveProject(){
    this.service.addProject(this.newProject).subscribe(data => {
      this.createGuideLine();
    })

  }

  createGuideLine(){
    this.guidlines=[];
    for(var release of this.details!){
      for(var detail of release.details){
        this.releaseGuideline=<BackendGuideline>{};

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

  saveGuidelines(){
    this.service.addGuidelines(this.guidlines).subscribe(data => {
      this.newGuidlines = data;
      this.saveTask();
    });      
  }

  saveTask(){ 
    this.taskList=[];
    for(var _guideline of this.newGuidlines!){
      this.task=<ReleaseTask>{};
      this.task.guidelines_ptr_id = _guideline.id;
      this.task.owner= "";
      this.task.project_id_id = this.newProject.project_id!;
      this.task.status_id= "Open";
      this.taskList.push(this.task);
    }
    this.service.addTasks(this.taskList).subscribe(data => {
      this.toastObj.show(this.toasts[2]);
      this.releaseForm.reset();
      this.showSpinner = false;
    });      
  }


  // createNewCheckList(){
  //   this.newChecklist=<Checklist>{};
  //   this.release =[];
  //   this.newChecklist.id=uuidv4();
  //   this.newChecklist.releaseName = this.releaseForm.controls[NAME_LOWER].value;
  //   this.newChecklist.milestone = this.releaseForm.controls[MILESTONE_LOWER].value;
  //   this.newChecklist.workWeek = "ww"+moment(new Date(this.releaseForm.controls[DATE_LOWER].value), "MM-DD-YYYY").week()+"'"+new Date(this.releaseForm.controls[DATE_LOWER].value).getFullYear();
  
  //   for(var release of this.details!){
  //     for(var detail of release.details){
  //       this.releaseChecklist=<ReleaseChecklist>{};
  //       this.releaseChecklist.id = uuidv4();
  //       this.releaseChecklist.comments =[];
  //       this.releaseChecklist.evidences=[];
  //       this.releaseChecklist.details=detail.id;
  //       this.releaseChecklist.status = "Open";
  //       this.releaseChecklist.vector = release.vector;
  //       this.releaseChecklist.owner = "";
  //       this.releaseChecklist.detailedStatus = "";
  //       this.release.push(this.releaseChecklist);
  //     }
  //   }
  //   this.newChecklist.releaseChecklist = this.release;
  //   this.existingCheckList.push(this.newChecklist);
  //   this.toastObj.show(this.toasts[2]);
  //   this.releaseForm.reset();
  //   localStorage.setItem("checkList", JSON.stringify(this.existingCheckList));
  //   localStorage.removeItem("tempCheckList");
  //   this.showSpinner = false;
  // }

  onChange(args:any) {
    this.workWeek = args.value;
    // this.workWeek = "ww"+moment(new Date(args.value), "MM-DD-YYYY").week()+"'"+new Date(args.value).getFullYear();
    this.isWorkWeekVisible=true;
  }

  onLoad(args: any) {
    /*Date need to be disabled*/
    if (args.date.getTime() <= new Date().getTime()) {
        args.isDisabled = true;
    }
  }

  
  createMilestoneDropdown(){
    if(this.milestoneList != null){
        for (var i = 0; i < this.milestoneList.length; i++) {
            this.milestones.push({ Milestone: this.milestoneList[i].milestone, Id: this.milestoneList[i].milestone });
        }
    }
  }

  createBusinessUnitDropdown(){
    if(this.businessUnitList != null){
        for (var i = 0; i < this.businessUnitList.length; i++) {
            this.businessUnits.push({ BusinessUnit: this.businessUnitList[i].name, Id: this.businessUnitList[i].name });
        }
    }
    if(this.tempRelease){
      this.setDraftForm();
    }
  }

  setDraftForm(){
    if(this.tempRelease.handover && this.tempRelease.type === EXTERNAL_LOWER && this.tempRelease.milestone === POC_LOWER){
      this.isExternal=true;
    }else{
      this.isExternal=false;
    }
    this.releaseForm.patchValue({
      name: this.tempRelease.name,
      type: this.tempRelease.type,
      milestone:  this.tempRelease.milestone,
      handover:this.tempRelease.handover,
      date: this.tempRelease.date,
      // contact: this.tempRelease.contact,
      // email: this.tempRelease.email,
      businessunit:this.tempRelease.businessunit,
      description:this.tempRelease.description
    });
    this.workWeek = this.tempRelease.date.toString();
    // this.workWeek = "ww"+moment(new Date(tempRelease.date), "MM-DD-YYYY").week()+"'"+new Date(tempRelease.date).getFullYear();
    this.isWorkWeekVisible=true;
  }

    /**
   * Check whether any data has been changed before routing to other page
   * @returns boolean value true if data change, false when nothing changed
   */
  checkData(){
    if(this.releaseForm.dirty){
      return true;
    }else{
      return false;
    }
  }

  continueNavigation(){
    this.onSelection(true);
  }

  subject = new Subject<boolean>();

  onSelection(isNavigate: boolean) {
    if (isNavigate) {
      this.subject.next(true);
    } else {
      this.subject.next(false);
    }
  }

  
  openConfirmation(){
    this.releaseConfirmDialog.show();
  }

  public hideReleaseConfirmDialog: EmitType<object> = () => {
    this.releaseConfirmDialog.hide();
    
  }

  public saveButtons: Object = [
    {
        'click': this.continueNavigation.bind(this),
          buttonModel:{
          content:"Don't Save & Leave",
          cssClass:'e-danger',
        }
    },
    {
        'click': this.hideReleaseConfirmDialog.bind(this),
          buttonModel:{
          content:'Cancel',
          cssClass:'e-info',
        }
    }    
  ];
}
