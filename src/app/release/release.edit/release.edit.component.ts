import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BUSINESS_UNIT_LOWER, DATE_FORMAT, DATE_LOWER, DESCRIPTION_LOWER, EXTERNAL_WITHOUT_HANDOVER_LOWER, EXTERNAL_WITH_HANDOVER_LOWER, INTERNAL_LOWER, MILESTONE_LOWER, NAME_LOWER } from '../release.new/release.constants';
import { AnimationModel, ILoadedEventArgs, ProgressTheme } from '@syncfusion/ej2-angular-progressbar';
import { EditService, ToolbarService, PageService, NewRowPosition } from '@syncfusion/ej2-angular-grids';
import { Milestone } from '../release.new/release.models';
import { ReleaseService } from '../release.new/release.service';
import { Notes, Project } from 'src/app/home/home.models';
import { PopupSettingsModel } from '@syncfusion/ej2-inplace-editor/src/inplace-editor/base/models-model';
import { RichTextEditorModel } from '@syncfusion/ej2-angular-richtexteditor';
import { ActionEventArgs, InPlaceEditorComponent, MultiSelectService, RteService } from '@syncfusion/ej2-angular-inplace-editor';
import * as moment from 'moment';

@Component({
  selector: 'app-release.edit',
  templateUrl: './release.edit.component.html',
  styleUrls: ['./release.edit.component.scss'],
  providers: [ToolbarService, EditService, PageService, RteService, MultiSelectService]
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
  public milestones: Object[] = [];
  public milestonefields: Object = { text: 'Milestone', value: 'Id' };
  public releaseTypes: Object[] = [
    { Id: EXTERNAL_WITH_HANDOVER_LOWER, Type: 'External With Handover' },
    { Id: EXTERNAL_WITHOUT_HANDOVER_LOWER, Type: 'External Without Handover' },
    { Id: INTERNAL_LOWER, Type: 'Internal' }
  ];
  public releaseTypeFields: Object = { text: 'Type', value: 'Id' };
  public businessUnitfields: Object = { text: 'BusinessUnit', value: 'Id' };
  public height: string = '220px';
  public businessUnits: Object[] = [];
  showSpinner :boolean=false; 
  public value3: number = 20;
  public min3: number = 0;
  public max3: number = 100;
  public type3: string = 'Circular';
  public width: string = '70';
  public spinnerheight: string = '70';
  public animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  public isIndeterminate3: boolean = true;
  public pageSettings!: Object;
  public editSettings!: Object;
  public toolbar!: string[];
  milestoneList:Milestone[]=[];
  selectedProject!: Project;
  @ViewChild('formlayout')
  public formlayout!: ElementRef;
  public commentsPopSettings!: PopupSettingsModel;
  
  @ViewChild('element') inplaceCommentEditor!: InPlaceEditorComponent;
  public commentEditorModel: RichTextEditorModel = {
    toolbarSettings: {
        enableFloating: false,
        items: ['Bold', 'Italic', 'Underline', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|', 'OrderedList', 'UnorderedList']
    }
  };
  public commentRule: { [name: string]: { [rule: string]: Object } } = {
    rte: { required: [true, 'Enter valid notes'] }
  };
  constructor(private formBuilder: FormBuilder, private service:ReleaseService) { }

  ngOnInit(): void {
    this.getMilestones();
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    
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
      description:[null, []],
      qualowner:[null, []],
      status:[null, []],
      attorney:[null, []],
      notes:[null, []],
    });
    
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

  createMilestoneDropdown(){
    if(this.milestoneList != null){
        for (var i = 0; i < this.milestoneList.length; i++) {
            this.milestones.push({ Milestone: this.milestoneList[i].milestone, Id: this.milestoneList[i].milestone });
        }
    }
    this.editForm();
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
    // this.dummyMessage.id="1";
    // this.dummyMessage.note="Message1";
    // this.dummyMessageArray.push(this.dummyMessage);
    // this.dummyMessage.id="2";
    // this.dummyMessage.note="Message2";
    // this.dummyMessageArray.push(this.dummyMessage);
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
    // this.workWeek = "ww"+moment(new Date(tempRelease.date), "MM-DD-YYYY").week()+"'"+new Date(tempRelease.date).getFullYear();
    this.isWorkWeekVisible=true;
  }

  // public commentEditorValue: String = 'The extensive adoption of JavaScript for application development, and the ability to use HTML and JavaScript to create Windows Store apps, has made JavaScript a vital part of the Windows development ecosystem. Microsoft has done extensive work to make JavaScript easier to use';
  
  commentCreated(): void {
    this.commentsPopSettings = {
        model: {
            width: this.formlayout.nativeElement.offsetWidth
        }
    };
  }

  updateRelease(){
    alert(this.releaseForm.controls['notes'].value);
    this.updateExistingProject();
  }

  newProject!:Project;
  updateExistingProject(){
    this.newProject=<Project>{};
    alert(this.selectedProject.project_id);
    this.newProject.project_id = this.selectedProject.project_id;
    this.newProject.project_name = this.releaseForm.controls[NAME_LOWER].value;
    this.newProject.project_business_unit_id = this.releaseForm.controls[BUSINESS_UNIT_LOWER].value;
    this.newProject.project_milestone_id = this.releaseForm.controls[MILESTONE_LOWER].value;
    this.newProject.project_release_date = moment(this.releaseForm.controls[DATE_LOWER].value).format(DATE_FORMAT);
    this.newProject.project_description = this.selectedProject.project_description;
    this.updateProject();
    
  }
  
  updateProject(){
    alert(this.newProject.project_name);
    this.service.updateProject(this.newProject).subscribe(data => {
      alert(data);
    })

  }
  
}
