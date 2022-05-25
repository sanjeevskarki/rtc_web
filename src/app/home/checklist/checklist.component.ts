import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridComponent, GridLine, QueryCellInfoEventArgs,GroupService, SortService } from '@syncfusion/ej2-angular-grids';
import { Checklist, Comments, Evidences, ReleaseChecklist, ReleaseShortChecklist, ViewComment, ViewEvidence } from '../home.models';
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

export type Status = 'Done' | 'WIP'| 'N/A' | 'Open';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers:[ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, FileManagerService,EditService, ToolbarService, PageService,GroupService, SortService]
})
export class ChecklistComponent implements OnInit,OnDestroy {

  checkList:Checklist[]=[];
  releaseChecklist : ReleaseChecklist[]| undefined =[];
  /**
   * For storing selected Release Checklist
   */
  selectedReleaseChecklist : ReleaseChecklist[]| undefined =[];

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

  public target: string = '#modalTarget';
  public target1: string = '#commentDialog';
  public evidenceDialogWidth: string = '850px';
  public width: string = '750px';
  public width1: string = '660px';
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
  id!: string| null;
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

  public tools: ToolbarModule = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize','|',
        'Formats', 'NumberFormatList', 'BulletFormatList','|',
        'CreateLink', 'image']
  };

  public evidenceTools: ToolbarModule = {
    items: [
        'CreateLink', 'image']
  };
  
  constructor(private route: ActivatedRoute,private service:ChecklistService) { 
    
  } 


  public confirmDlgBtnClick = (): void => {
    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }, { click: this.confirmDlgBtnClick.bind(this), buttonModel: { content: 'No' } }];
  

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
  hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  fileManagerSettings: FileManagerSettingsModel = {
    enable: true,
    path: '/Pictures/Food',
    ajaxSettings: {
      url: this.hostUrl + 'api/FileManager/FileOperations',
      getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
      uploadUrl: this.hostUrl + 'api/FileManager/Upload',
      downloadUrl: this.hostUrl + 'api/FileManager/Download'
    }
  };

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
    
    this.releaseShortChecklist = JSON.parse(localStorage.getItem('relaesechecklist')!);
    
    this.id = this.releaseShortChecklist.id;
    this.releaseName = this.releaseShortChecklist.releaseName;
    this.milestone = this.releaseShortChecklist.milestone;
    this.workWeek = this.releaseShortChecklist.workWeek;
    this.lines='Both';
    this.initialPage = {pageSize:5};
    
    this.filter = { type: "CheckBox" }; 
    this.getCheckList();
  }

  ngAfterViewInit(): void {
    
    this.uploadObj.element.value = '';
  }

  rteCreated(): void {
    this.rteEle.element.focus();
  }

  eveidenceRteCreated(): void {
    this.evidenceEle.element.focus();
  }

  commentDialogClose(){
    this.commentForm.reset();
    this.uploadObj.clearAll();
  }

  onCommentSubmit(): void {
    alert(new Date().getTime());
    alert('Form submitted successfully' + this.commentForm.controls['comment'].value);
    var data = { html: this.commentForm.controls['comment'].value };
    var json = JSON.stringify(data);
    alert('json = ' + json);
  }

  public onFileSelect(args : SelectedEventArgs) : void {
    alert("select");
    let filesData : FileInfo[] = this.uploadObj.getFilesData();
    this.uploadInput = args.filesData[0].name;
    args.filesData[0].name = 'modified-'+args.filesData[0].name;
    alert(this.uploadInput +"--NAME--"+args.filesData[0].name);
  }

  public onUploadSuccess(args: any): void  {
    if (args.operation === 'upload') {
        // console.log('File uploaded successfully'+ JSON.stringify(args));
    }
  }

  public onUploadFailure(args: any): void  {
  alert('File failed to upload');
  }

  getCheckList() {
    this.service.checkList().subscribe(
      (response) => {
        this.checkList = response;
        this.releaseChecklist = this.checkList.find(x => x.id == this.id)?.releaseChecklist;
        this.selectedReleaseChecklist = this.releaseChecklist;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  changeStatus (id:string,args: MenuEventArgs) {
    var newStatus:string|undefined = args.item.text;

    const objIndex = this.releaseChecklist!.findIndex((obj => obj.id == id));
    var newCheckList: ReleaseChecklist | undefined = this.releaseChecklist![objIndex];
    this.releaseChecklist = this.releaseChecklist!.filter(val=>val.id!==id);
    
    newCheckList.status = newStatus;
    this.releaseChecklist?.push(newCheckList);
    localStorage.setItem('isStatusChanged', 'true');

  }

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

  onCommentClicked(selectedReleaseChecklist: ReleaseChecklist) {
    this.selectedRelease=<ReleaseChecklist>{}
    this.displayComments=[];
    this.comments =[];
    this.viewComments=[];
    this.commentsHeader = selectedReleaseChecklist.vector + " Comments";
    this.comments = selectedReleaseChecklist.comments;
    this.selectedRelease = selectedReleaseChecklist;
    if(this.comments.length > 0){
      for(var comment of this.comments){
        this.viewComment = <ViewComment>{};
        // const duration = Math.min(comment.date - new Date().getTime(), 0);
        this.viewComment.message=comment.message;
        this.viewComment.date = moment(comment.date).format('LLL');
        // this.viewComment.date = this.service.getNiceTime(duration);
        this.viewComments.push(this.viewComment);
      }
      this.displayComments = this.viewComments;
      this.commentDialog.show(); 
    }else{
      this.commentDialog.show(); 
      this.openCommentDialog();
    }    
  } 

  onEvidenceClicked(selectedReleaseChecklist: ReleaseChecklist) {
    this.selectedRelease=<ReleaseChecklist>{};
    this.evidenceHeader = selectedReleaseChecklist.vector + " Evidences";
    this.selectedRelease = selectedReleaseChecklist;
    this.createEvidenceList(this.selectedRelease);
  }

  createEvidenceList(_selectedRelease:ReleaseChecklist){
    let num : number =0;
    this.displayEvidences=[];
    this.viewEvidences=[];
    if(_selectedRelease.evidences.length > 0){
      for(var evidence of _selectedRelease.evidences){
        num++;
        this.viewEvidence = <ViewEvidence>{};
        // const duration = Math.min(comment.date - new Date().getTime(), 0);
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
    this.updateEvidenceList(_selectedRelease);
  }

  updateEvidenceList(_selectedRelease:ReleaseChecklist){
    let itemIndex = this.releaseChecklist!.findIndex(item => item.id == _selectedRelease.id);
    this.releaseChecklist![itemIndex] = _selectedRelease;
    // console.log("new list" + JSON.stringify(this.releaseChecklist));
    localStorage.setItem('isEvidenceAdded', 'true');
  }

  openCommentDialog() {
    this.addCommentHeader = "Add Comment";
    this.addCommentDialog.show();   
  }

  saveRelease() {
    alert('Save Changes');
  }

  openEvidenceDialog() {
    this.addEvidenceHeader = "Add Evidence";
    this.evidenceAddComponent.addEvidence();  
  }
  
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

    localStorage.setItem('isEvidenceDeleted', 'true');
    console.log(JSON.stringify(this.releaseChecklist));

  }

  clearLocalStorage(){
    localStorage.removeItem('isEvidenceDeleted');
    localStorage.removeItem('isEvidenceAdded');
    localStorage.removeItem('currentGame');
  }

  getEvidence() {
    alert('get form parent');
  }

  addEvidence(newEvidence:Evidences) {
    this.selectedRelease.evidences.push(newEvidence);
    this.createEvidenceList(this.selectedRelease);
    
  }

  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === 'Add') {
        this.evidenceAddComponent.addEvidence();
    }
    // else{
    //     switch (args.item.text) {
    //         case 'PDF Export':
    //             this.grid.pdfExport();
    //             break;
    //         case 'Excel Export':
    //             this.grid.excelExport();
    //             break;
    //         case 'CSV Export':
    //             this.grid.csvExport();
    //             break;
    //     }
    // }
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

  ngOnDestroy(): void {
    if(this.selectedReleaseChecklist === this.releaseChecklist){
      alert('nothing change');
    }else{
      alert('something changed');
    }
  }
  public refresh!: Boolean;
  @ViewChild('grid')
  public grid!: GridComponent;
  dataBound() {
    if(this.refresh){
        this.grid.groupColumn('vector');
        this.refresh =false;
    }
  }
  load() {
      this.refresh = (<any>this.grid).refreshing;
  }

}

