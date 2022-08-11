import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridComponent, GridLine, QueryCellInfoEventArgs,GroupService, SortService, CommandModel, CommandColumnService, EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { BackendGuideline, BackendTask, Checklist, Comments, Evidences, Project, ReleaseChecklist, ReleaseDetails, ReleaseShortChecklist, ReleaseTask, ViewComment, ViewEvidence } from '../home.models';
import { ChecklistService } from './checklist.service';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { DialogComponent, AnimationSettingsModel, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import * as moment from 'moment';
import { LinkService, ImageService, HtmlEditorService, TableService, FileManagerService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { ClickEventArgs, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormGroup } from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
import { RemovingEventArgs } from '@syncfusion/ej2-angular-inputs';
import { EditService, ToolbarService, PageService } from '@syncfusion/ej2-angular-grids';
import { EvidenceAddComponent } from '../evidence.add/evidenceadd.component';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { forkJoin, Subject } from 'rxjs';
import { CommentAddComponent } from '../comment.add/commentadd.component';
import { Checkmarx, DATA_COLLECTION, Kw, Project as ProtexProject, Severity } from './checklist.models';
import { PROTEX_MATCHES_LICENSE_CONFLICTS, STATIC_ANALYSIS_ISSUE } from '../home.constants';



@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers:[ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, FileManagerService,EditService, PageService,GroupService, SortService, CommandColumnService],
  encapsulation: ViewEncapsulation.None
})

export class ChecklistComponent implements OnInit  {

  checkList:Checklist[]=[];
  releaseChecklist : ReleaseChecklist[]| undefined =[];
  release! : Checklist;
  /**
   * For storing selected Release Checklist
   */
  oldChecklist : ReleaseChecklist[]=[];
  

  @ViewChild('commentDialog')
  public commentDialog!: DialogComponent;

  @ViewChild('evidenceDialog')
  public evidenceDialog!: DialogComponent;

  @ViewChild('confirmDialog')
  public confirmDialog!: DialogComponent;

  @ViewChild('saveReleaseConfirmDialog')
  public saveReleaseConfirmDialog!: DialogComponent;

  public target: string = '#modalTarget';
  public target1: string = '#commentDialog';
  public evidenceDialogWidth: string = '850px';
  public width: string = '750px';
  public width1: string = '630px';
  public height: string = '250px';
  public commentsHeader!: string;
  public evidenceHeader!: string;

  //public addEvidenceHeader!: string;
  public isModal: Boolean = true;
  public showCloseIcon: Boolean = true;
  public hidden: Boolean = false;
  public position: PositionDataModel={ X: 'center', Y: 'center' };
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
 
  public lines!:GridLine;
  initialPage!:Object;
  evidencePage: Object = {pageSize:5};
  public filter!: Object;
  selectedProject!: Project;
  selectedReleaseId!: number;
  releaseName!: string| null;
  milestone!: string| null;
  workWeek!: string| null;
  comments:Comments[]=[];
  viewComments:ViewComment[]=[];
  displayComments:ViewComment[]=[];
  viewComment!:ViewComment;
  viewEvidence!:ViewEvidence;
  viewEvidences:ViewEvidence[]=[];
  displayEvidences:ViewEvidence[]=[];
  public cssClass: string = 'e-list-template';

  selectedRelease!:ReleaseChecklist;

  commentForm!: FormGroup;

  @ViewChild('toolsRTE')
  public rteObj!: RichTextEditorComponent;

  @ViewChild('evidenceRTE')
  private evidenceEle!: RichTextEditorComponent;

  @Output() childEvent = new EventEmitter();
  @Output() childEvent2 = new EventEmitter();

  public textArea!: HTMLElement;
  public confirmCloseIcon: Boolean = true;
  public confirmHeader: string = 'Delete Evidence';
  public confirmWidth: string = '400px';
  releaseShortChecklist!:ReleaseShortChecklist;
  public groupOptions!: Object;

  @ViewChild('dropdownbutton') element:any;

  @ViewChild( EvidenceAddComponent,{ static: false } ) evidenceAddComponent!: EvidenceAddComponent;
  @ViewChild( CommentAddComponent,{ static: false } ) commentAddComponent!: CommentAddComponent;

  public evidenceToolbar: Object[] =[];
  public evidenceEditSettings!: Object;
  selectOptions!:Object;
  selectedEvidence!:ViewEvidence;
  public uploadInput1: string = '';
  public multiple: boolean = false;
  viewReleaseChecklist:ReleaseChecklist[]=[];
  public refresh!: Boolean;
  @ViewChild('grid')
  public grid!: GridComponent;
  details:ReleaseDetails[]=[];
  // public toolbar!: string[];
  // newComment!:Comments;
  scanDate!:string;
  checkMarxIssue!:Checkmarx;
  // severity!:Severity;
  highCount:number=0;
  lowCount:number=0;
  mediumCount:number=0;
  infoCount:number=0;
  protexProj!:ProtexProject;
  newLine = "\r\n";
  @ViewChild('toasttype')
  private toastObj!: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Success!', content: 'Release Saved Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Status Changed Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'Some error occured during file upload.Please try after some time', cssClass: 'e-toast-error', icon: 'e-error toast-icons' },
    { title: 'Success!', content: 'Evidence Deleted Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Comment Added Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'File Uploaded Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Owner Updated Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Detailed Status Updated Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  ];
  public toastPosition: ToastPositionModel = { X: 'Right' };
  public commands!: CommandModel[];

  public tools: ToolbarModule = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize','|',
        'Formats', 'NumberFormatList', 'BulletFormatList','|',
        'CreateLink']
  };

  public evidenceTools: ToolbarModule = {
    items: [
        'CreateLink', 'image']
  };
  isExit:boolean = true;
  public editSettings!: EditSettingsModel;
  isAddCommentOpen:boolean = false;
  showSpinner:boolean=false;
  data_collection!:DATA_COLLECTION;
  protexData!:string[];
  checkmarxData!:string[];
  kwIssue:Kw[]=[];
  kwAnalyzeIssue:Kw[]=[];
  errorCount:number=0;
  criticalCount:number=0;
  responseText!:string;
  tempText!:string;
  kwData:string[]=[];

  constructor(private route: ActivatedRoute,private service:ChecklistService) { 
    
  }

  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;
  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
  };
  
  public onFileRemove(args: RemovingEventArgs): void {
    args.postRawFile = false;
  }

  public items: ItemModel[] = [
    {
      text: 'Done',
    },
    {
      text: 'N/A',  
    },
    {
      text: 'Open',
    },
    {
      text: 'WIP',  
    }
  ];

  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';

  ngOnInit(): void {
    this.data_collection = <DATA_COLLECTION>{};
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.data_collection.business_unit = this.selectedProject.project_business_unit_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.milestone_id = this.selectedProject.project_milestone_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.project_id = this.selectedProject.project_name.toLowerCase().replace(/\s/g, "");

    this.showSpinner = true;
    this.isAddCommentOpen = false;
    this.editSettings = { allowEditing: true, mode: 'Normal' };

    this.groupOptions = { showDropArea: false, showGroupedColumn: false, columns: ['vector'] };
    this.selectOptions = {persistSelection: true, type: "Multiple" };
    this.evidenceToolbar = [{ text: 'Add Evidence', tooltipText: 'Add Evidence', prefixIcon: 'e-plus1', id: 'Add' }];
    this.evidenceEditSettings = { allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    
    this.lines='Both';
    this.initialPage = {pageSize:5};
    this.filter = { type: "CheckBox" };
    this.checkList = JSON.parse(localStorage.getItem("checkList")!);
    this.commands = [
        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } }
    ];
    this.getSelectedTask();
  }

  backendTasks:BackendTask[]=[];

  getSelectedTask(){
    this.setTitle();
    this.service.getSelectedProject(this.selectedReleaseId!).subscribe(
      (response) => {
        this.getCheckMarxScan();
        this.backendTasks = response;        
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  setTitle(){
    // this.release = this.checkList.find(x => x.id === this.selectedReleaseId)!;
    // this.releaseChecklist = this.release.releaseChecklist;
    this.selectedReleaseId = this.selectedProject.project_id!;
    this.releaseName = this.selectedProject.project_name;
    this.milestone = this.selectedProject.project_milestone_id;
    this.workWeek = this.selectedProject.project_release_date;
    // this.oldChecklist = this.releaseChecklist!;
    
  }

  getDetails() {
    this.service.details(this.milestone?.toLocaleLowerCase()!).subscribe(
      (response) => {
        this.details = response;
        this.getEvidence();
        this.createTasks();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  getEvidence() {
    this.service.details(this.milestone?.toLocaleLowerCase()!).subscribe(
      (response) => {
        this.details = response;
        
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  createTasks(){
    var taskList:ReleaseChecklist[]=[];
    for(var task of this.backendTasks!){
      var checkList:ReleaseChecklist=<ReleaseChecklist>{};
      checkList.id=task.guidelines_ptr_id;
      checkList.vector=task.backend_guideline?.vector_id!;
      checkList.details = task.backend_guideline?.task_name!;
      checkList.owner=task.owner;
      checkList.status=task.status_id;
      checkList.detailedStatus = [];
      // alert(checkList.details.toLowerCase().replace(/\s/g, ""));
      if(checkList.details.toLowerCase().replace(/\s/g, "") === STATIC_ANALYSIS_ISSUE){
        checkList.detailedStatus = this.kwData.concat(this.checkmarxData);
        // checkList.detailedStatus = this.kwData;
      }
      if(checkList.details.toLowerCase().replace(/\s/g, "") === PROTEX_MATCHES_LICENSE_CONFLICTS){
        checkList.detailedStatus = this.protexData;
      }
      
      checkList.evidences=[];
      checkList.comments=[];
      // checkList.comments=release.comments.sort(function(a:any,b:any): any{
      //   return new Date(b.date).getTime() - new Date(a.date).getTime();
      // });
      var selectedDetail = this.details.find( x => x.vector === task.backend_guideline?.vector_id);
      // alert(selectedDetail?.vector);
     
      checkList.releaseCriteria = selectedDetail?.details.find(x => x.detail === task.backend_guideline?.task_name)?.releaseCriteria!;
      taskList.push(checkList);
    }
    this.showSpinner = false;
    this.viewReleaseChecklist = taskList;
    this.releaseChecklist = this.viewReleaseChecklist;
    localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
        
  }


  eveidenceRteCreated(): void {
    this.evidenceEle.element.focus();
  }

  commentDialogClose(){
    this.commentForm.reset();
    // this.uploadObj.clearAll();
  }

  public onUploadSuccess(args: any): void  {
    if (args.operation === 'upload') {
        // console.log('File uploaded successfully'+ JSON.stringify(args));
    }
  }

  public onUploadFailure(args: any): void  {
    this.toastObj.show(this.toasts[2]);
  }

  /**
   * Change Status of Checklist
   * @param id Unique Release Checklist ID
   * @param args New Changed Status
   */
  changeStatus (id:string,args: MenuEventArgs) {
    this.showSpinner=true;
    var newStatus:string|undefined = args.item.text;
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.viewReleaseChecklist![objIndex].status=newStatus;
    this.viewReleaseChecklist = [...this.viewReleaseChecklist]; 

    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.releaseChecklist![objIndex1].status=newStatus;
    this.showSpinner=false;
    // this.toastObj.show(this.toasts[1]);
  }

  /**
   * Used for Cell Background Color
   * @param args Cell Information
   */
  customiseCell(args: QueryCellInfoEventArgs) { 
    let rcList : ReleaseChecklist |undefined= <ReleaseChecklist> args.data;
      if (rcList?.status === "Done") { 
        args.cell!.classList.add('doneBackgroundColor'); 
      } 
      else if (rcList?.status === "N/A") { 
        args.cell!.classList.add('naBackgroundColor'); 
      } 
      else if (rcList?.status === "Open") { 
        args.cell!.classList.add('openBackgroundColor'); 
      } 
      else { 
        args.cell!.classList.add('wipBackgroundColor'); 
      } 
  }

  /**
   * Call when user click on View/Add Comment
   * @param id Unique Release Id
   */
  onCommentClicked(id: string) {
    this.selectedRelease=<ReleaseChecklist>{}    
    this.selectedRelease = this.getCurrentRelease(id)!;
    this.commentsHeader = this.selectedRelease.vector + " Comments"; 
    this.createCommentList(this.selectedRelease);  
  } 

  /**
   * Create a New Comment List with updated comments
   * @param _selectedRelease Update Release Checklist
   */
  createCommentList(_selectedRelease:ReleaseChecklist){
    this.viewComments=[];
    this.displayComments=[];
    if(_selectedRelease.comments.length > 0){
      for(var comment of _selectedRelease.comments){
        this.viewComment = <ViewComment>{};
        this.viewComment.message=comment.message;
        this.viewComment.date = moment(comment.date).format('LLL');
        this.viewComment.file = comment.file;
        this.viewComments.push(this.viewComment);
      }
      this.displayComments = this.viewComments;
      this.commentDialog.show(); 
    }else{
      this.commentDialog.show(); 
      this.openCommentDialog();
    }    
    this.updateReleaseCheckList(this.selectedRelease);
  }

  /**
   * Call when user click on View/Add Evidence
   * @param selectedReleaseChecklist Existing Release ChecklIst
   */
  onEvidenceClicked(id: string) {
    this.selectedRelease=<ReleaseChecklist>{};
    this.selectedRelease = this.getCurrentRelease(id)!;
    this.evidenceHeader = this.selectedRelease.vector + " Evidences";
    
    this.createEvidenceList(this.selectedRelease);
  }

  getCurrentRelease(releaseId:string) {
    var selectedRelease =  this.releaseChecklist!.find(t => t.id.toString() === releaseId)!;
    return selectedRelease;
  }

  /**
   * Create a new Evidence
   * @param newEvidence New Evidence
   */
  addEvidence(newEvidence:Evidences) {
    this.selectedRelease.evidences.unshift(newEvidence);
    this.createEvidenceList(this.selectedRelease);
  }

  /**
   * Create a new Comment
   * @param newComment New Comment
   */
  addComment(newComment:Comments) {
    this.selectedRelease.comments.unshift(newComment);
    this.createCommentList(this.selectedRelease);
  }

  /**
   * Create a new Comment
   * @param newComment New Comment
   */
  getComment() {
    
  }

  /**
   * Create Evidence List to show on View Evidence link
   * @param _selectedRelease Release Checklist
   */
  createEvidenceList(_selectedRelease:ReleaseChecklist){
    let num : number =0;
    this.displayEvidences=[];
    this.viewEvidences=[];
    if(_selectedRelease.evidences.length > 0){
      for(var evidence of _selectedRelease.evidences){
        num++;
        this.viewEvidence = <ViewEvidence>{};
        this.viewEvidence.seq = num;
        this.viewEvidence.evidence=evidence.evidence;
        this.viewEvidence.date = moment(evidence.date).format('LLL');
        this.viewEvidence.id = evidence.id;
        this.viewEvidence.title = evidence.title;
        this.viewEvidence.comments = evidence.comments;
        // this.viewComment.date = this.service.getNiceTime(duration);
        this.viewEvidences.push(this.viewEvidence);
      }
      this.displayEvidences = this.viewEvidences;
      this.evidenceDialog.show();
    }else{
      this.evidenceDialog.show(); 
      this.openEvidenceDialog();
    }
    this.updateReleaseCheckList(_selectedRelease);
  }

  /**
   * Update Existing release checklist
   * @param _selectedRelease ReleaseCheckList
   */
  updateReleaseCheckList(_selectedRelease:ReleaseChecklist){
    let itemIndex = this.releaseChecklist!.findIndex(item => item.id == _selectedRelease.id);
    this.releaseChecklist![itemIndex] = _selectedRelease;
  }

  /**
   * Open Add comment Dialog 
   */
  // openCommentDialog() {
    
  //   this.addCommentDialog.show();   
  // }
  
  /**
   * Create Updated Task List and Save 
   */
  saveRelease() {
    // var newBackendGuideline:BackendGuideline;
    // var newBackendGuidelineArray:BackendGuideline[]=[];
    var newBackendTask:ReleaseTask;
    
    var newBackendTaskArray:ReleaseTask[]=[];
    for(var release of this.releaseChecklist!){
      // newBackendGuideline = <BackendGuideline>{};
      // newBackendGuideline.id = release.id;
      // newBackendGuideline.task_name = release.details;
      // newBackendGuideline.vector_id = release.vector;
      // newBackendGuidelineArray.push(newBackendGuideline);

      newBackendTask = <ReleaseTask>{};
      newBackendTask.guidelines_ptr_id = release.id;
      newBackendTask.owner = release.owner;
      newBackendTask.status_id = release.status!;
      newBackendTask.project_id_id = this.selectedProject.project_id!;
      
      newBackendTaskArray.push(newBackendTask);
      
    }
    // console.log(JSON.stringify(newBackendTaskArray));
    // this.service.updateGuidelines(newBackendGuidelineArray).subscribe(data => {
      this.service.updateTasks(newBackendTaskArray).subscribe((status) => {
        localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
        this.toastObj.show(this.toasts[0]);
      });
    // });

  }

  /**
   * Open Add Evidence Dialog
   */
  openEvidenceDialog() {
    //this.addEvidenceHeader = "Add Evidence";
    this.evidenceAddComponent.addEvidence();  
  }
  
  /**
   * Open Add Evidence Dialog
   */
   openCommentDialog() {
    this.isAddCommentOpen = true;
    // this.addCommentHeader = "Add Comment";
    this.commentAddComponent.addComment();  
  }

  /**
   * Call when evidence delete
   * @param _selectedEvidence Selected Evidence to delete
   */
  selectDeletedEvidence (_selectedEvidence: ViewEvidence): void {
    this.selectedEvidence = _selectedEvidence;
    this.confirmDialog.show();
  }

  /**
   * Delete the selected Evidence
   */
  
  deleteEvidence() {
    let evidence = this.releaseChecklist!.find(item => item.evidences.find(x => x.id === this.selectedEvidence.id));
    let deletedItemIndex = evidence!.evidences.findIndex(x => x.id === this.selectedEvidence.id);  
    evidence?.evidences.splice(deletedItemIndex, 1);

    this.createEvidenceList(evidence!);
    this.confirmDialog.hide();  
    this.evidenceAddComponent.closeEvidence();
    this.toastObj.show(this.toasts[3]);
    
  }

  clickEvidenceHandler(args: ClickEventArgs): void {
    if (args.item.id === 'Add') {
        this.evidenceAddComponent.addEvidence();
    }
  }

  public hideEvidenceDialog: EmitType<object> = () => {
    this.confirmDialog.hide();
  }
  
  public buttons: Object = [
    {
        'click': this.deleteEvidence.bind(this),
          buttonModel:{
          content:'Yes',
          cssClass:'e-danger',
        }
    },
    {
        'click': this.hideEvidenceDialog.bind(this),
          buttonModel:{
          content:'No',
          cssClass:'e-info',
        }
    }
  ];


  public browseClick1() {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  // On Dialog close, show the buttons
  public dialogClose = (): void => {
    (document.querySelectorAll('.dlgbtn')[0] as HTMLElement).classList.remove('e-btn-hide');
    (document.querySelectorAll('.dlgbtn')[1] as HTMLElement).classList.remove('e-btn-hide');
    (document.querySelectorAll('.dlgbtn')[2] as HTMLElement).classList.remove('e-btn-hide');
  }

  // On Dialog open, hide the buttons
  public dialogOpen = (): void => {
      (document.querySelectorAll('.dlgbtn')[0] as HTMLElement).classList.add('e-btn-hide');
      (document.querySelectorAll('.dlgbtn')[1] as HTMLElement).classList.add('e-btn-hide');
      (document.querySelectorAll('.dlgbtn')[2] as HTMLElement).classList.add('e-btn-hide');
  }

  continueNavigation(){
    this.onSelection(true);
  }

  saveAndContinue(){
    this.saveRelease();
    this.continueNavigation();
  }

  public hideSaveConfirmationDialog: EmitType<object> = () => {
    this.saveReleaseConfirmDialog.hide();
    this.isExit=true;
  }

  public saveChecklistButtons: Object = [
    {
      'click': this.saveAndContinue.bind(this),
        buttonModel:{
        content:'Save & Continue',
        cssClass:'e-success',
      }
    },
    {
      'click': this.continueNavigation.bind(this),
        buttonModel:{
        content:"Don't Save & Leave",
        cssClass:'e-danger',
      }
    },
    {
      'click': this.hideSaveConfirmationDialog.bind(this),
        buttonModel:{
        content:'Cancel',
        cssClass:'e-info',
      }
    }
    
  ];

  /**
   * Check whether any data has been changed before routing to other page
   * @returns boolean value true if data change, false when nothing changed
   */
  checkData(){
    var storedReleaseChecklist:Checklist[]=JSON.parse(localStorage.getItem("checkList")!);
    if(JSON.stringify(storedReleaseChecklist) === JSON.stringify(this.releaseChecklist)){
      return false;
    }else{
      return true;
    }
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
    this.saveReleaseConfirmDialog.show();
  }

  /**
   * Set Toast timeout
   */
  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  closeCommentDialog(){
    this.commentDialog.hide();
  }
  closeEvidenceDialog(){
    this.evidenceDialog.hide();
  }

  public onFileSelected() {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  addOwner(id:string,args:string){
    var owner:string|undefined = args;
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.viewReleaseChecklist![objIndex].owner=owner;
    this.viewReleaseChecklist = [...this.viewReleaseChecklist];
    
    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.releaseChecklist![objIndex1].owner=owner;

    this.toastObj.show(this.toasts[6]);
  }


  getCheckMarxScan() {
    this.highCount=0;
    this.lowCount=0;
    this.mediumCount=0;
    this.infoCount=0;
    let res1 = this.service.checkmarxScan(this.data_collection);
    let res2 = this.service.kwScan(this.data_collection);
    let res3 = this.service.protexScan(this.data_collection);
    forkJoin([res1, res2, res3]).subscribe(([data1, data2, data3]) => {
      this.checkMarxIssue = data1;
      this.tempText = data2;
      this.protexProj = data3;
      if(this.checkMarxIssue)
        this.runCheckMarxScan();
      if(this.tempText)
        this.getKwScan();
      if(this.protexProj)
        this.geProtexFile();
      
      this.getDetails();
    });
  }
  

  runCheckMarxScan(){  
    this.checkmarxData=[];
    for(var issue of this.checkMarxIssue!.issues){
      switch (issue.severity)
      {
        case 'High':
          this.highCount++;
          break;
        case 'Medium':
          this.mediumCount++;
          break;
        case 'Information':
          this.infoCount++;
          break;
        case 'Low':
          this.lowCount++;
          break;
        default:
      }
    }
    this.checkmarxData.push("Checkmarx Scan Data".bold());
    this.checkmarxData.push("ScanDate: "+this.scanDate);
    this.checkmarxData.push("High: "+this.highCount);
    this.checkmarxData.push("Medium: "+this.mediumCount);
    this.checkmarxData.push("Low: "+this.lowCount);
    this.checkmarxData.push("Information: "+this.infoCount);
    this.checkmarxData.push("<br>");
    // this.checkmarxData = " Checkmarx Scan Data "+newLine+"ScanDate: "+this.scanDate+newLine+"High: "+this.highCount+newLine+"Medium: "+this.mediumCount+newLine+"Low: "+this.lowCount+newLine+"Information: "+this.infoCount+newLine;
  }


  getKwScan() {
    this.errorCount=0;
    this.criticalCount=0;
    this.kwIssue=[];
    let re = /\}{/gi;
    this.responseText =  "[" + this.tempText.replace(re, "},{") + "]";         
    this.kwIssue = JSON.parse(this.responseText);
    console.log(JSON.parse(this.responseText));
    this.runKwScan();
  }
 

  runKwScan(){ 
    this.kwData = [];
    this.kwAnalyzeIssue = this.kwIssue.filter(data => data.status === 'Analyze');
    for(var issue of this.kwAnalyzeIssue){
      switch (issue.severity)
      {
        case 'Error':
          this.errorCount++;
          break;
        case 'Critical':
          this.criticalCount++;
          break;
        default:
      }
    }
    this.kwData.push("KW Scan Data".bold());
    this.kwData.push("Error Count: "+this.errorCount);
    this.kwData.push("Critical Count: "+this.criticalCount);
    this.kwData.push("<br>");
  }


  async geProtexFile() {
    this.protexData =[]; 
    this.protexData.push("Protex Scan Data".bold());
    this.protexData.push("Scan Date: "+this.protexProj.LastAnalyzed);
    this.protexData.push("Code Matches :"+this.protexProj.ScanFileInfo.Analyzed);
    this.protexData.push("License Conflicts :"+this.protexProj.BOM.LicenseViolations);
    this.protexData.push("<br>");
  }


  isLoaded!:boolean;
  onLoad(args: any) {
    let proxy: ChecklistComponent = this;
    setTimeout(() => {
      proxy.isLoaded = true;
    }, 1000);
  }


}

