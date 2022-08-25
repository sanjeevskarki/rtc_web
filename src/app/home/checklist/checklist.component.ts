import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendTask, Checklist, Comments, Project, ReleaseChecklist, ReleaseDetails, ReleaseTask, ViewComment, ViewEvidence } from '../home.models';
import { ChecklistService } from './checklist.service';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvidenceAddComponent } from '../evidence.add/evidenceadd.component';
import { forkJoin, Subject } from 'rxjs';
import { CommentAddComponent } from '../comment.add/commentadd.component';
import { Bdba, Checkmarx, DATA_COLLECTION, Kw, Project as ProtexProject } from './checklist.models';
import { COMPOSITION_ANALYSIS_ISSUES, PROTEX_MATCHES_LICENSE_CONFLICTS, STATIC_ANALYSIS_ISSUE } from '../home.constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ChecklistConfirmDialogComponent } from '../checklistconfirmdialog/checklist.confirm.dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

export class Group {
  level = 0;
  expanded = true;
  totalCounts = 0;
}


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers: [],
  encapsulation: ViewEncapsulation.None
})

export class ChecklistComponent implements OnInit {

  checkList: Checklist[] = [];
  releaseChecklist: ReleaseChecklist[] | undefined = [];
  release!: Checklist;
  /**
   * For storing selected Release Checklist
   */
  oldChecklist: ReleaseChecklist[] = [];

  // public target: string = '#modalTarget';
  // public target1: string = '#commentDialog';
  // public evidenceDialogWidth: string = '850px';
  // public width: string = '750px';
  // public width1: string = '630px';
  // public height: string = '250px';
  public commentsHeader!: string;
  public evidenceHeader!: string;

  //public addEvidenceHeader!: string;
  // public isModal: Boolean = true;
  // public showCloseIcon: Boolean = true;
  // public hidden: Boolean = false;

  // initialPage!:Object;
  // evidencePage: Object = {pageSize:5};
  public filter!: Object;
  selectedProject!: Project;
  selectedReleaseId!: number;
  releaseName!: string | null;
  milestone!: string | null;
  workWeek!: string | null;
  // comments:Comments[]=[];
  viewComments: ViewComment[] = [];
  displayComments: ViewComment[] = [];
  viewComment!: ViewComment;
  viewEvidence!: ViewEvidence;
  viewEvidences: ViewEvidence[] = [];
  displayEvidences: ViewEvidence[] = [];
  // public cssClass: string = 'e-list-template';

  selectedRelease!: ReleaseChecklist;

  @Output() childEvent = new EventEmitter();
  @Output() childEvent2 = new EventEmitter();

  // public textArea!: HTMLElement;
  // public confirmCloseIcon: Boolean = true;
  public confirmHeader: string = 'Delete Evidence';
  // public confirmWidth: string = '400px';
  // releaseShortChecklist!:ReleaseShortChecklist;
  // public groupOptions!: Object;

  // @ViewChild('dropdownbutton') element:any;

  @ViewChild(EvidenceAddComponent, { static: false }) evidenceAddComponent!: EvidenceAddComponent;
  @ViewChild(CommentAddComponent, { static: false }) commentAddComponent!: CommentAddComponent;

  // public evidenceToolbar: Object[] =[];
  // public evidenceEditSettings!: Object;
  // selectOptions!:Object;
  selectedEvidence!: ViewEvidence;
  // public uploadInput1: string = '';
  // public multiple: boolean = false;
  viewReleaseChecklist: ReleaseChecklist[] = [];
  // public refresh!: Boolean;
  // @ViewChild('grid')
  // public grid!: GridComponent;
  details: ReleaseDetails[] = [];
  // public toolbar!: string[];
  // newComment!:Comments;
  scanDate!: string;
  checkMarxIssue!: Checkmarx;
  // severity!:Severity;
  highCount: number = 0;
  lowCount: number = 0;
  mediumCount: number = 0;
  infoCount: number = 0;
  protexProj!: ProtexProject;
  bdba!: Bdba;
  newLine = "\r\n";
  backendTasks: BackendTask[] = [];

  isExit: boolean = true;
  // public editSettings!: EditSettingsModel;
  isAddCommentOpen: boolean = false;
  showSpinner: boolean = false;
  data_collection!: DATA_COLLECTION;
  protexData!: string[];
  checkmarxData!: string[];
  bdbaData!: string[];
  kwIssue: Kw[] = [];
  kwAnalyzeIssue: Kw[] = [];
  errorCount: number = 0;
  criticalCount: number = 0;
  responseText!: string;
  tempText!: string;
  kwData: string[] = [];
  groupByColumns: string[] = [];
  color = '#f1f3f4';
  expanded = true;
  level = 0;
  selected!: string;
  isLoading = true;
  public dataSource = new MatTableDataSource<any | Group>([]);

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: ChecklistService, public dialog: MatDialog,
    public domSanitizer: DomSanitizer) {
    this.groupByColumns = ['vector'];
  }

  // public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;

  statusList: any[] = [
    { value: 'Done', viewValue: 'Done' },
    { value: 'N/A', viewValue: 'N/A' },
    { value: 'Open', viewValue: 'Open' },
    { value: 'WIP', viewValue: 'WIP' },
  ];

  displayedColumns = ['vector', 'details', 'owner', 'detailedStatus', 'status', 'releaseCriteria', 'evidence', 'comments'];
  evidenceDisplayedColumns = ['seq', 'title', 'evidenceChild', 'evidenceDate', 'comments'];
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';

  ngOnInit(): void {
    // this.evidenceLoaded=false;
    this.data_collection = <DATA_COLLECTION>{};
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.data_collection.business_unit = this.selectedProject.project_business_unit_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.milestone_id = this.selectedProject.project_milestone_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.project_id = this.selectedProject.project_name.toLowerCase().replace(/\s/g, "");

    this.showSpinner = true;
    this.isAddCommentOpen = false;
    // this.editSettings = { allowEditing: true, mode: 'Normal' };

    // this.groupOptions = { showDropArea: false, showGroupedColumn: false, columns: ['vector'] };
    // this.selectOptions = {persistSelection: true, type: "Multiple" };
    // this.evidenceToolbar = [{ text: 'Add Evidence', tooltipText: 'Add Evidence', prefixIcon: 'e-plus1', id: 'Add' }];
    // this.evidenceEditSettings = { allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.addCommentForm = this.formBuilder.group({
      comment: [null, Validators.required],
      upload: [null, []],
    });
    // this.lines='Both';
    // this.initialPage = {pageSize:5};
    this.filter = { type: "CheckBox" };
    this.checkList = JSON.parse(localStorage.getItem("checkList")!);
    // this.commands = [
    //     { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } }
    // ];
    this.getSelectedTask();

  }

  getSelectedTask() {
    this.setTitle();
    this.service.getSelectedProject(this.selectedReleaseId!).subscribe(
      (response) => {
        this.getDataCollections();
        this.backendTasks = response;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  setTitle() {
    // this.release = this.checkList.find(x => x.id === this.selectedReleaseId)!;
    // this.releaseChecklist = this.release.releaseChecklist;
    this.selectedReleaseId = this.selectedProject.project_id!;
    this.releaseName = this.selectedProject.project_name;
    this.milestone = this.selectedProject.project_milestone_id;
    this.workWeek = this.selectedProject.project_release_date;
    // this.oldChecklist = this.releaseChecklist!;

  }

  getDetails() {
    // alert("get other detail");
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

  testData!: string[];
  createTasks() {
    this.testData = [];
    var taskList: ReleaseChecklist[] = [];
    for (var task of this.backendTasks!) {

      var checkList: ReleaseChecklist = <ReleaseChecklist>{};
      checkList.bdbaStatus = false;
      checkList.id = task.guidelines_ptr_id;
      checkList.vector = task.backend_guideline?.vector_id!;
      checkList.details = task.backend_guideline?.task_name!;
      checkList.owner = task.owner;
      checkList.status = task.status_id;
      checkList.detailedStatus = [];
      // alert(checkList.details.toLowerCase().replace(/\s/g, ""));
      if (checkList.details.toLowerCase().replace(/\s/g, "") === STATIC_ANALYSIS_ISSUE) {
        checkList.detailedStatus = this.kwData.concat(this.checkmarxData);
        // checkList.detailedStatus = this.kwData;
        this.testData = checkList.detailedStatus;
      }
      if (checkList.details.toLowerCase().replace(/\s/g, "") === PROTEX_MATCHES_LICENSE_CONFLICTS) {
        checkList.detailedStatus = this.protexData;
        this.testData = checkList.detailedStatus;
      }
      if (checkList.details.toLowerCase().replace(/\s/g, "") === COMPOSITION_ANALYSIS_ISSUES) {
        checkList.detailedStatus = this.bdbaData;
        checkList.bdbaStatus = true;
      }



      checkList.evidences = [];
      checkList.comments = [];
      // checkList.comments=release.comments.sort(function(a:any,b:any): any{
      //   return new Date(b.date).getTime() - new Date(a.date).getTime();
      // });
      var selectedDetail = this.details.find(x => x.vector === task.backend_guideline?.vector_id);
      // alert(selectedDetail?.vector);

      checkList.releaseCriteria = selectedDetail?.details.find(x => x.detail === task.backend_guideline?.task_name)?.releaseCriteria!;
      taskList.push(checkList);
    }
    this.showSpinner = false;
    this.viewReleaseChecklist = taskList;
    // this.dataSource.data = this.getGroups(this.viewReleaseChecklist, this.groupByColumns);
    this.releaseChecklist = this.viewReleaseChecklist;
    localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
    this.isLoading = false;
  }

  openBdbaReport() {
    this.service.bdbaPdf(this.data_collection).subscribe((data) => {

      var file = new Blob([data], { type: 'application/pdf' })
      var fileURL = URL.createObjectURL(file);

      window.open(fileURL);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'BDBAScanData.pdf';
      document.body.appendChild(a);
      a.click();

      // alert('Hi = '+ this.dataLocalUrl);
    },
      (error) => {
        console.log('getPDF error: ', error);
      }
    );

  }


  public onUploadSuccess(args: any): void {
    if (args.operation === 'upload') {
      // console.log('File uploaded successfully'+ JSON.stringify(args));
    }
  }

  /**
   * Change Status of Checklist
   * @param id Unique Release Checklist ID
   * @param args New Changed Status
   */
  changeStatus(id: string, value: string) {
    this.showSpinner = true;
    var newStatus: string | undefined = value;
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.viewReleaseChecklist![objIndex].status = newStatus;
    this.viewReleaseChecklist = [...this.viewReleaseChecklist];

    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.releaseChecklist![objIndex1].status = newStatus;
    this.showSpinner = false;
    // this.toastObj.show(this.toasts[1]);
  }


  commentDialogRef: any;
  commentTemplateRef: any
  /**
   * Call when user click on View/Add Comment
   * @param id Unique Release Id
   */
  onCommentClicked(_templateRef: any, id: string) {
    this.commentLoaded = true;
    this.commentTemplateRef = _templateRef;
    this.selectedRelease = <ReleaseChecklist>{}
    this.selectedRelease = this.getCurrentRelease(id)!;

    this.commentsHeader = this.selectedRelease.vector + " Comments";

    this.createCommentList(this.selectedRelease, true);

  }

  /**
   * Create a New Comment List with updated comments
   * @param _selectedRelease Update Release Checklist
   */
  createCommentList(_selectedRelease: ReleaseChecklist, state: boolean) {
    this.viewComments = [];
    this.displayComments = [];
    // if(_selectedRelease.comments.length > 0){
    for (var comment of _selectedRelease.comments) {
      this.viewComment = <ViewComment>{};
      this.viewComment.message = comment.message;
      this.viewComment.date = moment(comment.date).format('LLL');
      this.viewComment.file = comment.file;
      this.viewComments.push(this.viewComment);
    }
    this.displayComments = this.viewComments;
    // alert(this.displayComments[0].message);
    // this.commentDialog.show(); 
    // }else{
    //   this.commentDialog.show(); 
    //   this.openCommentDialog();
    // } 
    if (state)
      this.openCommentListDialog();


    this.updateReleaseCheckList(this.selectedRelease);
  }
  evidenceDialogRef: any;
  templateRef: any
  /**
   * Call when user click on View/Add Evidence
   * @param selectedReleaseChecklist Existing Release ChecklIst
   */
  onEvidenceClicked(_templateRef: any, id: string) {
    this.evidenceLoaded = true;
    this.templateRef = _templateRef;
    this.selectedRelease = <ReleaseChecklist>{};
    this.selectedRelease = this.getCurrentRelease(id)!;
    this.evidenceHeader = this.selectedRelease.vector + " Evidences";

    this.createEvidenceList(this.selectedRelease, true);

  }

  openEvidenceListDialog() {
    this.evidenceDialogRef = this.dialog.open(this.templateRef, {
      height: '60%',
      width: '70%'
    });

    this.evidenceDialogRef.afterClosed().subscribe(() => {

      // this.animal = result;
    });
  }

  addCommentTemplateRef: any
  openAddCommentDialog() {
    this.commentDialogRef = this.dialog.open(this.commentTemplateRef, {
      height: '60%',
      width: '70%'
    });

    this.commentDialogRef.afterClosed().subscribe(() => {

      // this.animal = result;
    });
  }

  openCommentListDialog() {
    this.commentDialogRef = this.dialog.open(this.commentTemplateRef, {
      height: '60%',
      width: '70%'
    });

    this.commentDialogRef.afterClosed().subscribe(() => {

      // this.animal = result;
    });
  }

  closeEvidenceListDialog() {
    this.evidenceLoaded = false;
    this.evidenceDialogRef.close();
    // this.evidenceDialog.hide();
  }

  getCurrentRelease(releaseId: string) {
    var selectedRelease = this.releaseChecklist!.find(t => t.id.toString() === releaseId)!;
    return selectedRelease;
  }

  /**
   * Create a new Comment
   * @param newComment New Comment
   */
  addComment(newComment: Comments) {
    this.selectedRelease.comments.unshift(newComment);
    this.createCommentList(this.selectedRelease, false);
  }

  /**
   * Create Evidence List to show on View Evidence link
   * @param _selectedRelease Release Checklist
   */
  createEvidenceList(_selectedRelease: ReleaseChecklist, state: boolean) {
    let num: number = 0;
    this.displayEvidences = [];
    this.viewEvidences = [];

    // if(_selectedRelease.evidences.length > 0){
    for (var evidence of _selectedRelease.evidences) {
      num++;
      this.viewEvidence = <ViewEvidence>{};
      this.viewEvidence.seq = num;
      this.viewEvidence.evidence = evidence.evidence;
      this.viewEvidence.date = moment(evidence.date).format('LLL');
      this.viewEvidence.id = evidence.id;
      this.viewEvidence.title = evidence.title;
      this.viewEvidence.comments = evidence.comments;
      // this.viewComment.date = this.service.getNiceTime(duration);
      this.viewEvidences.push(this.viewEvidence);
    }
    this.displayEvidences = this.viewEvidences;
    if (state)
      this.openEvidenceListDialog();
    // this.evidenceDialog.show();
    // }
    // else{
    //   // this.evidenceDialog.show(); 
    //   this.openEvidenceListDialog();
    //   this.openEvidenceDialog();
    // }

    this.updateReleaseCheckList(_selectedRelease);
  }

  /**
   * Update Existing release checklist
   * @param _selectedRelease ReleaseCheckList
   */
  updateReleaseCheckList(_selectedRelease: ReleaseChecklist) {
    let itemIndex = this.releaseChecklist!.findIndex(item => item.id == _selectedRelease.id);
    this.releaseChecklist![itemIndex] = _selectedRelease;
  }

  /**
   * Create Updated Task List and Save 
   */
  saveRelease() {
    console.log(JSON.stringify(this.releaseChecklist));
    // var newBackendGuideline:BackendGuideline;
    // var newBackendGuidelineArray:BackendGuideline[]=[];
    var newBackendTask: ReleaseTask;

    var newBackendTaskArray: ReleaseTask[] = [];
    for (var release of this.releaseChecklist!) {
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
      // this.toastObj.show(this.toasts[0]);
    });
    // });

  }
  evidenceLoaded: boolean = false;
  commentLoaded: boolean = false;
  /**
   * Open Add Evidence Dialog
   */
  openEvidenceDialog() {

    //this.addEvidenceHeader = "Add Evidence";
    this.evidenceAddComponent.addEvidence();
  }
  addCommentDialogRef!: any;
  /**
   * Open Add Evidence Dialog
   */
  openCommentDialog(_templateRef: any) {
    this.addCommentTemplateRef = _templateRef;
    this.selectedCommentFile = <any>{};
    // this.addCommentHeader = "Add Comment";
    this.addCommentDialogRef = this.dialog.open(this.addCommentTemplateRef, {
      height: '50%',
      width: '40%'
    });

    // addCommentDialogRef.afterClosed().subscribe((result ) => {
    //   this.commentLoaded = false;
    //   this.selectedRelease.comments.unshift(result);
    //   this.createCommentList(this.selectedRelease,false);
    //   // this.animal = result;
    // });
  }
  addCommentForm!: FormGroup;
  /**
   * Call when evidence delete
   * @param _selectedEvidence Selected Evidence to delete
   */
  selectDeletedEvidence(_selectedEvidence: ViewEvidence): void {
    this.selectedEvidence = _selectedEvidence;
    // this.confirmDialog.show();
  }

  /**
   * Delete the selected Evidence
   */

  deleteEvidence() {
    let evidence = this.releaseChecklist!.find(item => item.evidences.find(x => x.id === this.selectedEvidence.id));
    let deletedItemIndex = evidence!.evidences.findIndex(x => x.id === this.selectedEvidence.id);
    evidence?.evidences.splice(deletedItemIndex, 1);

    this.createEvidenceList(evidence!, false);
    // this.confirmDialog.hide();  
    // this.evidenceAddComponent.closeEvidence();
    // this.toastObj.show(this.toasts[3]);

  }

  createEvidence() {
    const addEvidenceDialogRef = this.dialog.open(EvidenceAddComponent, {
      height: '50%',
      width: '40%'
    });

    addEvidenceDialogRef.afterClosed().subscribe((result) => {
      this.evidenceLoaded = false;
      this.selectedRelease.evidences.unshift(result.data);
      this.createEvidenceList(this.selectedRelease, false);
    });
  }

  continueNavigation() {
    this.onSelection(true);
  }

  saveAndContinue() {
    this.saveRelease();
    this.continueNavigation();
  }

  /**
   * Check whether any data has been changed before routing to other page
   * @returns boolean value true if data change, false when nothing changed
   */
  checkData() {
    var storedReleaseChecklist: Checklist[] = JSON.parse(localStorage.getItem("checkList")!);
    if (JSON.stringify(storedReleaseChecklist) === JSON.stringify(this.releaseChecklist)) {
      return false;
    } else {
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

  openConfirmation() {
    // this.saveReleaseConfirmDialog.show();

    const dialogRef = this.dialog.open(ChecklistConfirmDialogComponent, {
      height: '20%',
      width: '30%'

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "save") {
        this.saveAndContinue();
      } else if (result.data == "continue") {
        this.continueNavigation();
      }

    });

  }

  /**
   * Set Toast timeout
   */
  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  closeCommentDialog() {
    this.commentDialogRef.close();
    // this.commentDialog.hide();
  }

  closeAddCommentDialog() {
    this.addCommentDialogRef.close();
    this.addCommentForm.reset();
  }
  public onFileSelected() {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  addOwner(id: string, args: string) {
    var owner: string | undefined = args;
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.viewReleaseChecklist![objIndex].owner = owner;
    this.viewReleaseChecklist = [...this.viewReleaseChecklist];

    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id.toString() == id));
    this.releaseChecklist![objIndex1].owner = owner;

    // this.toastObj.show(this.toasts[6]);
  }

  /**
   * Retrieve the data collection file from SMB server
   */
  getDataCollections() {
    // alert('get data collection');
    this.highCount = 0;
    this.lowCount = 0;
    this.mediumCount = 0;
    this.infoCount = 0;
    let res1 = this.service.checkmarxScan(this.data_collection);
    let res2 = this.service.kwScan(this.data_collection);
    let res3 = this.service.protexScan(this.data_collection);
    let res4 = this.service.bdbaScan(this.data_collection);
    forkJoin([res1, res2, res3, res4]).subscribe(([data1, data2, data3, data4]) => {
      // forkJoin([res1, res2, res3]).subscribe(([data1, data2, data3]) => {
      this.checkMarxIssue = data1;
      // alert("this.checkMarxIssue = "+this.checkMarxIssue);
      this.tempText = data2;
      // alert("this.tempText = "+this.tempText);
      this.protexProj = data3;
      // alert("this.protexProj = "+this.protexProj);
      this.bdba = data4;
      // alert("this.bdba = "+this.bdba);
      if (this.checkMarxIssue)
        this.runCheckMarxScan();
      if (this.tempText)
        this.getKwScan();
      if (this.protexProj)
        this.geProtexFile();
      if (this.bdba)
        this.geBdbaFile();

      this.getDetails();
    });

  }

  geBdbaFile() {
    this.bdbaData = [];
    const summary = this.bdba.results.summary;
    const totalVun = summary["vuln-count"].total;

    this.bdbaData.push("BDBA Scan Data".bold());
    this.bdbaData.push("ScanDate: " + moment(this.bdba.results.last_updated).format('ll'));
    this.bdbaData.push("Total Vulnerability: " + totalVun);
  }

  isBdba!: boolean;
  runCheckMarxScan() {
    this.checkmarxData = [];
    for (var issue of this.checkMarxIssue!.issues) {
      switch (issue.severity) {
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
    this.checkmarxData.push("ScanDate: " + this.scanDate);
    this.checkmarxData.push("High: " + this.highCount);
    this.checkmarxData.push("Medium: " + this.mediumCount);
    this.checkmarxData.push("Low: " + this.lowCount);
    this.checkmarxData.push("Information: " + this.infoCount);
    this.checkmarxData.push("<br>");
    // this.checkmarxData = " Checkmarx Scan Data "+newLine+"ScanDate: "+this.scanDate+newLine+"High: "+this.highCount+newLine+"Medium: "+this.mediumCount+newLine+"Low: "+this.lowCount+newLine+"Information: "+this.infoCount+newLine;
  }


  getKwScan() {
    this.errorCount = 0;
    this.criticalCount = 0;
    this.kwIssue = [];
    let re = /\}{/gi;
    this.responseText = "[" + this.tempText.replace(re, "},{") + "]";
    this.kwIssue = JSON.parse(this.responseText);
    console.log(JSON.parse(this.responseText));
    this.runKwScan();
  }


  runKwScan() {
    this.kwData = [];
    this.kwAnalyzeIssue = this.kwIssue.filter(data => data.status === 'Analyze');
    for (var issue of this.kwAnalyzeIssue) {
      switch (issue.severity) {
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
    this.kwData.push("Error Count: " + this.errorCount);
    this.kwData.push("Critical Count: " + this.criticalCount);
    this.kwData.push("<br>");
  }


  async geProtexFile() {
    this.protexData = [];
    this.protexData.push("Protex Scan Data".bold());
    this.protexData.push("Scan Date: " +moment(this.protexProj.LastAnalyzed).format('ll'));
    this.protexData.push("Code Matches :" + this.protexProj.ScanFileInfo.Analyzed);
    this.protexData.push("License Conflicts :" + this.protexProj.BOM.LicenseViolations);
    this.protexData.push("<br>");
  }


  isLoaded!: boolean;
  onLoad(args: any) {
    let proxy: ChecklistComponent = this;
    setTimeout(() => {
      proxy.isLoaded = true;
    }, 1000);
  }

  getClass(proj: ReleaseChecklist) {
    if (proj.status === 'Done') {
      return '#E3FCEF';
    }
    if (proj.status === 'WIP') {
      return '#d6dbf0';
    }
    if (proj.status === 'Open') {
      return '#FFEBE6';
    }
    if (proj.status === 'N/A') {
      return '#F4F5F7';
    }
    // else{
    //   return 'green';
    // }
  }

  openCommentInput() {
    document!.getElementById("commentFileInput")!.click();
  }

  selectedFiles?: FileList;
  currentFile?: File;
  public selectedCommentFile!: any;

  commentInputChange(fileInputEvent: any) {
    this.selectedFiles = fileInputEvent.target.files;
    this.selectedCommentFile = fileInputEvent.target.files[0];
  }

  newComment!: Comments;
  public Submit(): void {
    this.createNewComment();
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.service.uploadFile(this.currentFile, this.selectedProject.project_business_unit_id, this.selectedProject.project_name, this.selectedProject.project_milestone_id).subscribe((status) => {
        });
      }
    }
    this.addComment(this.newComment);
    this.addCommentForm.reset();
    this.addCommentDialogRef.close();
  }

  createNewComment() {
    const newComments: Comments = {
      id: uuidv4(),
      message: this.addCommentForm.controls['comment'].value,
      date: new Date().getTime(),
      file: this.selectedCommentFile?.name
    };
    this.newComment = newComments;
  }

}
