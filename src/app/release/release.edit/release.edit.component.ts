import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ATTACHMENTS_LOWER, BUSINESS_UNIT_LOWER, DATA_COLLECTIONS_LOWER, DATE_FORMAT, DATE_LOWER, DESCRIPTION_LOWER, EVIDENCES_LOWER, EXTERNAL_WITHOUT_HANDOVER_LOWER, EXTERNAL_WITH_HANDOVER_LOWER, HANDOVER_LOWER, INTERNAL_LOWER, MILESTONE_LOWER, NAME_LOWER, TYPE_LOWER } from '../release.constants';

import { BusinessUnit, Milestone } from '../release.models';
import { ReleaseService } from '../release.service';
import { BackendGuideline, NewRelease, Notes, Project, ReleaseDetails, ReleaseTask } from 'src/app/home/home.models';
import { v4 as uuidv4 } from 'uuid';

import * as moment from 'moment';
import { ReleaseEditService } from './release.service';

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
  isWorkWeekVisible:boolean=false;
  workWeek!:string;
  public milestones: any[] = [];
  public milestonefields: Object = { text: 'Milestone', value: 'Id' };
  // public releaseTypes: Object[] = [
  //   { Id: EXTERNAL_WITH_HANDOVER_LOWER, Type: 'External With Handover' },
  //   { Id: EXTERNAL_WITHOUT_HANDOVER_LOWER, Type: 'External Without Handover' },
  //   { Id: INTERNAL_LOWER, Type: 'Internal' }
  // ];
  releaseTypes: any[] = [
    {value: EXTERNAL_WITH_HANDOVER_LOWER, viewValue: 'External With Handover'},
    {value: EXTERNAL_WITHOUT_HANDOVER_LOWER, viewValue: 'External Without Handover'},
    {value: INTERNAL_LOWER, viewValue: 'Internal'},
  ];

  public releaseTypeFields: Object = { text: 'Type', value: 'Id' };
  public businessUnitfields: Object = { text: 'BusinessUnit', value: 'Id' };
  public height: string = '220px';
  public businessUnits: any[] = [];
  showSpinner :boolean=false; 
  public value3: number = 20;
  public min3: number = 0;
  public max3: number = 100;
  public type3: string = 'Circular';
  public width: string = '70';
  public spinnerheight: string = '70';
  // public animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  public isIndeterminate3: boolean = true;
  public pageSettings!: Object;
  public editSettings!: Object;
  public toolbar!: string[];
  milestoneList:Milestone[]=[];
  selectedProject!: Project;
  @ViewChild('formlayout')
  public formlayout!: ElementRef;
  // public commentsPopSettings!: PopupSettingsModel;
  
  // @ViewChild('element') inplaceCommentEditor!: InPlaceEditorComponent;
  // public commentEditorModel: RichTextEditorModel = {
  //   toolbarSettings: {
  //       enableFloating: false,
  //       items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor',
  //           'LowerCase', 'UpperCase', '|', 'OrderedList', 'UnorderedList']
  //   }
  // };
  public commentRule: { [name: string]: { [rule: string]: Object } } = {
    rte: { required: [true, 'Enter valid notes'] }
  };
  constructor(private formBuilder: FormBuilder, private service:ReleaseEditService) { }

  ngOnInit(): void {
    this.isWorkWeekVisible=false;
    this.tempRelease = <NewRelease>{};
    this.getBusinessUnits();
    this.getMilestones();
    
    this.tempRelease = JSON.parse(localStorage.getItem("tempCheckList")!);
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);

    //  alert(this.selectedProject.project_milestone_id);
    
    this.pageSettings = { pageCount: 5 };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true , newRowPosition: 'Top'  };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    this.releaseForm = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, []],
      handover: [null, []],
      milestone:  [null, Validators.required],
      date: [null, Validators.required],
      // contact: [null, Validators.required],
      // email: [null, [Validators.required,Validators.email]],
      businessunit: [null, Validators.required],
      description:[null, Validators.required],
      qualowner:[null, []],
      status:[null, []],
      attorney:[null, []],
      notes:[null, []],
    });
    
  }

  newRelease!:NewRelease;
  createNewRelease() {
    this.newRelease =<NewRelease>{};
    this.newRelease.id = uuidv4();
    this.newRelease.name = this.releaseForm.controls[NAME_LOWER].value;
    this.newRelease.type = this.releaseForm.controls[TYPE_LOWER].value;
    this.newRelease.handover = this.releaseForm.controls[HANDOVER_LOWER].value;
    this.newRelease.milestone = this.releaseForm.controls[MILESTONE_LOWER].value;
  
    if(this.releaseForm.controls[DATE_LOWER].value !== null){
      this.newRelease.date = this.releaseForm.controls[DATE_LOWER].value;
    }else{
      this.newRelease.date =  new Date();
    }
    
    this.newRelease.description = this.releaseForm.controls[DESCRIPTION_LOWER].value;
    this.newRelease.businessunit = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    // this.newRelease.contact =this.releaseForm.controls['contact'].value;
    // this.newRelease.email = this.releaseForm.controls['email'].value;
  }


  saveAsDraft(){
    this.createNewRelease();
    localStorage.setItem("tempCheckList", JSON.stringify(this.newRelease));
    // this.toastObj.show(this.toasts[1]);
    this.releaseForm.reset();
    this.isWorkWeekVisible=false;
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

  onChange(args:any) {
    // alert("select date");
    this.workWeek = args.value;
    // this.workWeek = "ww"+moment(new Date(args.value), "MM-DD-YYYY").week()+"'"+new Date(args.value).getFullYear();
    this.isWorkWeekVisible=true;
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

  businessUnitList:BusinessUnit[]=[];
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

  tempRelease!:NewRelease;
  createBusinessUnitDropdown(){
    if(this.businessUnitList != null){
        for (var i = 0; i < this.businessUnitList.length; i++) {
            this.businessUnits.push({ value: this.businessUnitList[i].name, viewValue: this.businessUnitList[i].name });
        }
    }
    if(this.tempRelease){
      this.setDraftForm();
    }
  }

  createMilestoneDropdown(){
    if(this.milestoneList != null){
        for (var i = 0; i < this.milestoneList.length; i++) {
            this.milestones.push({ value: this.milestoneList[i].milestone, viewValue: this.milestoneList[i].milestone });
        }
    }
    this.editForm();
  }

  setDraftForm(){
    // if(this.tempRelease.handover && this.tempRelease.type === EXTERNAL_LOWER && this.tempRelease.milestone === POC_LOWER){
    //   this.isExternal=true;
    // }else{
    //   this.isExternal=false;
    // }
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
    this.workWeek = this.tempRelease.date!.toString();
    // this.workWeek = "ww"+moment(new Date(tempRelease.date), "MM-DD-YYYY").week()+"'"+new Date(tempRelease.date).getFullYear();
    this.isWorkWeekVisible=true;
  }



  // public load(args: ILoadedEventArgs): void {
  //   let div: HTMLCollection = document.getElementsByClassName('progress-text-align');
  //   let selectedTheme: string = location.hash.split('/')[1];
  //   selectedTheme = selectedTheme ? selectedTheme : 'Material';
  //   args.progressBar.theme = <ProgressTheme>(selectedTheme.charAt(0).toUpperCase() +
  //       selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
  //   if(args.progressBar.theme === 'HighContrast' || args.progressBar.theme === 'Bootstrap5Dark' || args.progressBar.theme === 'BootstrapDark' || args.progressBar.theme === 'FabricDark'
  //   || args.progressBar.theme === 'TailwindDark' || args.progressBar.theme === 'MaterialDark' || args.progressBar.theme === 'FluentDark') {
  //       for (let i = 0; i < div.length; i++) {
  //           div[i].setAttribute('style', 'color:white');
  //       }
  //   }
  // }

  actionBegin(args: any) :void {
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

  editForm(){
    if(this.selectedProject){
      this.releaseForm.patchValue({
        name: this.selectedProject.project_name,
        // type: this.selectedProject.,
        milestone:  this.selectedProject.project_milestone_id,
        // handover:this.selectedProject.handover,
        date: this.selectedProject.project_release_date,
        // contact: this.tempRelease.contact,
        // email: this.tempRelease.email,
        businessunit:this.selectedProject.project_business_unit_id,
        // description:this.selectedProject.description,
        qualowner:'',
        status:'',
        attorney:'',
        notes:''
      });
      this.workWeek = this.selectedProject.project_release_date!.toString();
      this.isWorkWeekVisible=true;
    }
  }
    
    // this.workWeek = "ww"+moment(new Date(tempRelease.date), "MM-DD-YYYY").week()+"'"+new Date(tempRelease.date).getFullYear();
    

  // public commentEditorValue: String = 'The extensive adoption of JavaScript for application development, and the ability to use HTML and JavaScript to create Windows Store apps, has made JavaScript a vital part of the Windows development ecosystem. Microsoft has done extensive work to make JavaScript easier to use';
  
  // commentCreated(): void {
  //   this.commentsPopSettings = {
  //       model: {
  //           width: this.formlayout.nativeElement.offsetWidth
  //       }
  //   };
  // }
  newProject!:Project;

  updateRelease(){
    // alert(this.releaseForm.controls['notes'].value);
    this.newProject=<Project>{};
    
    // alert(this.selectedProject);
    this.newProject.project_name = this.releaseForm.controls[NAME_LOWER].value;
    this.newProject.project_business_unit_id = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    this.newProject.project_milestone_id = this.releaseForm.controls[MILESTONE_LOWER].value;
    this.newProject.project_release_date = moment(this.releaseForm.controls[DATE_LOWER].value).format(DATE_FORMAT);
    this.newProject.project_description = this.releaseForm.controls[DESCRIPTION_LOWER].value;
    if(this.selectedProject){
      // alert(this.selectedProject.project_id);
      this.newProject.project_id = this.selectedProject.project_id;
      this.updateProject();
    }else{
      // alert('adding new release');
      this.newProject.project_id = Math.floor(Math.random()*90000) + 10000;
      this.getDetails();
    }
    
  }

  saveProject(){
    this.service.addProject(this.newProject).subscribe(() => {
      this.createGuideLine();
      this.createBuFolder();
    });
  }

  selectedMilestone!:string;
  selectedType!:string;
  selectedHandoverType!:string;

  getDetails() {
    this.selectedMilestone=this.releaseForm.controls[MILESTONE_LOWER].value;
    this.selectedType=this.releaseForm.controls[TYPE_LOWER].value;
    this.selectedHandoverType=this.releaseForm.controls[HANDOVER_LOWER].value;
    this.service.details(this.selectedMilestone.toLocaleLowerCase()!,this.selectedHandoverType?.toLocaleLowerCase()!,this.selectedType?.toLocaleLowerCase()!).subscribe(
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
  createBuFolder(){
    let folders:string[]=[];
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim()+"\\"+this.newProject.project_name.toLocaleLowerCase().trim()+"\\"+this.newProject.project_milestone_id.toLocaleLowerCase().trim()+"\\"+EVIDENCES_LOWER);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim()+"\\"+this.newProject.project_name.toLocaleLowerCase().trim()+"\\"+this.newProject.project_milestone_id.toLocaleLowerCase().trim()+"\\"+DATA_COLLECTIONS_LOWER);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim()+"\\"+this.newProject.project_name.toLocaleLowerCase().trim()+"\\"+this.newProject.project_milestone_id.toLocaleLowerCase().trim()+"\\"+ATTACHMENTS_LOWER);
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim()+"\\"+this.newProject.project_name.toLocaleLowerCase().trim()+"\\"+this.newProject.project_milestone_id.toLocaleLowerCase().trim());
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase().trim()+"\\"+this.newProject.project_name.toLocaleLowerCase());
    folders.push(this.newProject.project_business_unit_id.toLocaleLowerCase());
    this.service.createFolder(folders).subscribe(() => {  
    });
  }

  guidlines:BackendGuideline[]=[];
  details:ReleaseDetails[]=[];
  releaseGuideline!:BackendGuideline;
  newGuidlines:BackendGuideline[]=[];
  task!:ReleaseTask;
  taskList:ReleaseTask[]=[];
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
      this.releaseForm.reset();
      this.showSpinner = false;
    });      
  }
  
  // updateExistingProject(){
  
    
  // }
  
  updateProject(){
    // alert(this.newProject.project_name);
    this.service.updateProject(this.newProject).subscribe(data => {
      // alert(data);
    })

  }

  submit() {
    // emppty stuff
    }
  
    confirmAdd(){

    }
    onNoClick(){

    }
  
}
