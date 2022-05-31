import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridComponent, GridLine, QueryCellInfoEventArgs,GroupService, SortService } from '@syncfusion/ej2-angular-grids';
import { Checklist, Comments, Details, Evidences, ReleaseChecklist, ReleaseDetails, ReleaseShortChecklist, ViewComment, ViewEvidence, ViewReleaseChecklist } from '../home.models';
import { ChecklistService } from './checklist.service';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { DialogComponent, AnimationSettingsModel, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import * as moment from 'moment';
import { LinkService, ImageService, HtmlEditorService, TableService, FileManagerService, FileManagerSettingsModel, ToolbarSettingsModel, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { ClickEventArgs, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
import { FileInfo, RemovingEventArgs, SelectedEventArgs, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { EditService, ToolbarService, PageService } from '@syncfusion/ej2-angular-grids';
import { EvidenceAddComponent } from '../evidence.add/evidenceadd.component';
import { v4 as uuidv4 } from 'uuid';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers:[ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, FileManagerService,EditService, ToolbarService, PageService,GroupService, SortService]
})
export class ChecklistComponent implements OnInit,OnDestroy {

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

  @ViewChild('addCommentDialog')
  public addCommentDialog!: DialogComponent;

  @ViewChild('addEvidenceDialog')
  public addEvidenceDialog!: DialogComponent;

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
  public addCommentHeader!: string;
  public addEvidenceHeader!: string;
  public isModal: Boolean = true;
  public showCloseIcon: Boolean = true;
  public hidden: Boolean = false;
  public position: object={ X: 'center', Y: 'center' };
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
 
  public lines!:GridLine;
  initialPage!:Object;
  evidencePage: Object = {pageSize:5};
  public filter!: Object;
  selectedReleaseId!: string| null;
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
  evidenceForm!: FormGroup;

  @ViewChild('fromRTE')
  private rteEle!: RichTextEditorComponent;
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

  public evidenceToolbar: Object[] =[];
  public evidenceEditSettings!: Object;
  selectOptions!:Object;
  selectedEvidence!:ViewEvidence;
  public uploadInput: string = '';
  public multiple: boolean = false;
  viewReleaseChecklist:ViewReleaseChecklist[]=[];
  public refresh!: Boolean;
  @ViewChild('grid')
  public grid!: GridComponent;
  details:ReleaseDetails[]=[];
  newComment!:Comments;
  @ViewChild('toasttype')
  private toastObj!: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Success!', content: 'Release Saved Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Status Changed Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'Some error occured during file upload.Please try after some time', cssClass: 'e-toast-error', icon: 'e-error toast-icons' },
    { title: 'Success!', content: 'Evidence Deleted Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'Comment Added Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Success!', content: 'File Uploaded Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  ];
  public toastPosition: ToastPositionModel = { X: 'Right' };


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
  
  constructor(private route: ActivatedRoute,private service:ChecklistService) { 
    
  } 

  public confirmDlgBtnClick = (): void => {
    this.confirmDialog.hide();
  }
  public confirmSaveBtnClick = (): void => {
    this.saveReleaseConfirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }, { click: this.confirmDlgBtnClick.bind(this), buttonModel: { content: 'No' } }];
  public confirmSaveButtons: ButtonPropsModel[] = [{ click: this.confirmSaveBtnClick.bind(this), buttonModel: { content: 'Continue', isPrimary: true } }, { click: this.confirmSaveBtnClick.bind(this), buttonModel: { content: 'Discard' } }];
  

  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;
  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
  };
  @ViewChild('defaultupload')
  public uploadObj!: UploaderComponent;
  
  public onFileRemove(args: RemovingEventArgs): void {
    args.postRawFile = false;
  }

  // hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  // fileManagerSettings: FileManagerSettingsModel = {
  //   enable: true,
  //   path: '/Pictures/Food',
  //   ajaxSettings: {
  //     url: this.hostUrl + 'api/FileManager/FileOperations',
  //     getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
  //     uploadUrl: this.hostUrl + 'api/FileManager/Upload',
  //     downloadUrl: this.hostUrl + 'api/FileManager/Download'
  //   }
  // };

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
    this.groupOptions = { showGroupedColumn: false, columns: ['vector'] };
    this.selectOptions = {persistSelection: true, type: "Multiple" };
    this.evidenceToolbar = [{ text: 'Add Evidence', tooltipText: 'Add Evidence', prefixIcon: 'e-add', id: 'Add' }];
    this.evidenceEditSettings = { allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, Validators.required)
    });
    this.evidenceForm = new FormGroup({
      'evidence': new FormControl(null, Validators.required)
    });
    
    // this.releaseShortChecklist = JSON.parse(localStorage.getItem('relaeseId')!);
    this.selectedReleaseId = localStorage.getItem('releaseId');
    // this.releaseName = this.releaseShortChecklist.releaseName;
    // this.milestone = this.releaseShortChecklist.milestone;
    // this.workWeek = this.releaseShortChecklist.workWeek;
    this.lines='Both';
    this.initialPage = {pageSize:5};
    this.filter = { type: "CheckBox" };
    this.checkList = JSON.parse(localStorage.getItem("checkList")!);
    if(this.checkList === null || this.checkList.length === 0){
      this.getCheckList();
    }else{
      this.setDetails();
    }
  }

  ngAfterViewInit(): void {
    this.uploadObj.element.value = '';
  }

  // rteCreated(): void {
  //   this.rteEle.element.focus();
  // }

  eveidenceRteCreated(): void {
    this.evidenceEle.element.focus();
  }

  commentDialogClose(){
    this.commentForm.reset();
    this.uploadObj.clearAll();
  }

  public onFileSelect(args : SelectedEventArgs) : void {
    let filesData : FileInfo[] = this.uploadObj.getFilesData();
    this.uploadInput = args.filesData[0].name;
    args.filesData[0].name = 'modified-'+args.filesData[0].name;
    this.createNewComment(this.uploadInput);
    this.toastObj.show(this.toasts[5]);
  }

  public onUploadSuccess(args: any): void  {
    if (args.operation === 'upload') {
        // console.log('File uploaded successfully'+ JSON.stringify(args));
    }
  }

  public onUploadFailure(args: any): void  {
    this.toastObj.show(this.toasts[2]);
  }

  getCheckList() {
    this.service.checkList().subscribe(
      (response) => {
        this.checkList = response;
        localStorage.setItem("checkList", JSON.stringify(this.checkList));
        this.setDetails();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  setDetails(){
    this.release = this.checkList.find(x => x.id === this.selectedReleaseId)!;
    this.releaseChecklist = this.release.releaseChecklist;
    this.selectedReleaseId = this.release.id;
    this.releaseName = this.release.releaseName;
    this.milestone = this.release.milestone;
    this.workWeek = this.release.workWeek;
    this.oldChecklist = this.releaseChecklist!;
    this.getDetails();
  }

  getDetails() {
    this.service.details(this.milestone?.toLocaleLowerCase()!).subscribe(
      (response) => {
        this.details = response;
        this.createViewCheckList();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  createViewCheckList(){
    this.viewReleaseChecklist=[];
    selectedDetail?.details.find(x => x.id === release.details)?.detail;
    for(var release of this.releaseChecklist!){
      var checkList:ViewReleaseChecklist=<ViewReleaseChecklist>{};
      checkList.id=release.id;
      checkList.vector=release.vector;
      checkList.owner=release.owner;
      checkList.status=release.status;
      checkList.detailedStatus=release.detailedStatus;
      checkList.evidences=release.evidences;
      checkList.comments=release.comments;
      var selectedDetail = this.details.find( x => x.vector === release.vector);
      checkList.detail = selectedDetail?.details.find(x => x.id === release.details)?.detail!;
      checkList.releaseCriteria = selectedDetail?.details.find(x => x.id === release.details)?.releaseCriteria!;
      this.viewReleaseChecklist.push(checkList);
    }
  }

  /**
   * Change Status of Checklist
   * @param id Unique Release Checklist ID
   * @param args New Changed Status
   */
  changeStatus (id:string,args: MenuEventArgs) {
    var newStatus:string|undefined = args.item.text;
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id == id));
    var newCheckList: ViewReleaseChecklist | undefined = this.viewReleaseChecklist![objIndex];
    this.viewReleaseChecklist = this.viewReleaseChecklist!.filter(val=>val.id!==id);
    newCheckList.status = newStatus;
    this.viewReleaseChecklist?.push(newCheckList);

    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id == id));
    var newReleaseCheckList: ReleaseChecklist | undefined = this.releaseChecklist![objIndex1];
    this.releaseChecklist = this.releaseChecklist!.filter(val=>val.id!==id);
    
    newReleaseCheckList.status = newStatus;
    this.releaseChecklist?.push(newReleaseCheckList);

    this.toastObj.show(this.toasts[1]);
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
   * Save the new Comment
   */
  onCommentSubmit(): void {
    var data = this.commentForm.controls['comment'].value;
    this.createNewComment(data);
    this.toastObj.show(this.toasts[5]);
  }

  /**
   * Create A new Comment object
   * @param msg Comment Message
   */
  createNewComment(msg:any) {
    const newComments: Comments = {
      id:uuidv4(),
      message: msg,
      date: new Date().getTime() 
    };
    this.newComment = newComments;
    this.selectedRelease.comments.push(this.newComment);
    this.createCommentList(this.selectedRelease);
    this.addCommentDialog.hide(); 
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
    var selectedRelease =  this.releaseChecklist!.find(t => t.id === releaseId)!;
    return selectedRelease;
  }

  /**
   * Create a new Evidence
   * @param newEvidence New Evidence
   */
  addEvidence(newEvidence:Evidences) {
    this.selectedRelease.evidences.push(newEvidence);
    this.createEvidenceList(this.selectedRelease);
    
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
  openCommentDialog() {
    this.addCommentHeader = "Add Comment";
    this.addCommentDialog.show();   
  }
  
  /**
   * Save the new release CheckList
   */
  saveRelease() {
    this.checkList.find(x => x.id === this.selectedReleaseId)?.releaseChecklist == this.releaseChecklist;
    localStorage.setItem("checkList", JSON.stringify(this.checkList));
    this.releaseChecklist = this.checkList.find(x => x.id == this.selectedReleaseId)?.releaseChecklist!;
    this.toastObj.show(this.toasts[0]);
  }

  /**
   * Open Add Evidence Dialog
   */
  openEvidenceDialog() {
    this.addEvidenceHeader = "Add Evidence";
    this.evidenceAddComponent.addEvidence();  
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

  clickHandler(args: ClickEventArgs): void {
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
          iconCss: 'e-icons e-ok-icon',
          isPrimary: true
        }
    },
    {
        'click': this.hideEvidenceDialog.bind(this),
          buttonModel:{
          content:'No',
          iconCss: 'e-icons e-close-icon'
        }
    }
    
  ];


  public browseClick() {
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

  public hideSaveConfirmationDialog: EmitType<object> = () => {
    this.saveReleaseConfirmDialog.hide();
    this.isExit=true;
  }

  public saveButtons: Object = [
    {
        'click': this.continueNavigation.bind(this),
          buttonModel:{
          content:'Continue',
          iconCss: 'e-icons e-ok-icon',
          isPrimary: true
        }
    },
    {
        'click': this.hideSaveConfirmationDialog.bind(this),
          buttonModel:{
          content:'Discard',
          iconCss: 'e-icons e-close-icon'
        }
    }
    
  ];

  /**
   * Check whether any data has been changed before routing to other page
   * @returns boolean value true if data change, false when nothing changed
   */
  checkData(){
    var storedRelaeseChecklist:Checklist[]=JSON.parse(localStorage.getItem("checkList")!);
    var oldRelease:ReleaseChecklist[] = storedRelaeseChecklist.find(x => x.id == this.selectedReleaseId)?.releaseChecklist!;
    if(JSON.stringify(oldRelease) === JSON.stringify(this.releaseChecklist)){
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
   * Calls when Page get destroyed
   */
  ngOnDestroy(): void {
   
  }


  /**
   * Set Toast timeout
   */
  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

}

