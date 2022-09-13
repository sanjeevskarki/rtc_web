import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendComments, BackendTask, Checklist, OwnerEmail, Project, ReleaseChecklist, ReleaseDetails, ReleaseTask, ViewComment, ViewEvidence } from '../home.models';
import { ChecklistService } from './checklist.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvidenceAddComponent } from '../evidence.add/evidenceadd.component';
import { forkJoin, Subject } from 'rxjs';
import { Bdba, Checkmarx, DataCollection, Kw, Project as ProtexProject } from './checklist.models';
import { COMPOSITION_ANALYSIS_ISSUES, MIMETypes, PROTEX_MATCHES_LICENSE_CONFLICTS, STATIC_ANALYSIS_ISSUE } from '../home.constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ChecklistConfirmDialogComponent } from '../checklistconfirmdialog/checklist.confirm.dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { COMMENT_LOWER, EMAIL_LOWER, NAME_LOWER } from 'src/app/release/release.constants';

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

export class ChecklistComponent implements OnInit,OnDestroy {

  checkList: Checklist[] = [];
  releaseChecklist: ReleaseChecklist[] | undefined = [];
  // release!: Checklist;
  /**
   * For storing selected Release Checklist
   */
  // oldChecklist: ReleaseChecklist[] = [];
  public commentsHeader!: string;
  public evidenceHeader!: string;

  // public filter!: Object;
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

  selectedRelease!: ReleaseChecklist;

  @Output() childEvent = new EventEmitter();
  @Output() childEvent2 = new EventEmitter();

  public confirmHeader: string = 'Delete Evidence';

  @ViewChild(EvidenceAddComponent, { static: false }) evidenceAddComponent!: EvidenceAddComponent;
  // @ViewChild(CommentAddComponent, { static: false }) commentAddComponent!: CommentAddComponent;

  selectedEvidence!: ViewEvidence;
  viewReleaseChecklist: ReleaseChecklist[] = [];
  details: ReleaseDetails[] = [];

  scanDate!: string;
  checkMarxIssue!: Checkmarx;
  highCount: number = 0;
  lowCount: number = 0;
  mediumCount: number = 0;
  infoCount: number = 0;
  protexProj!: ProtexProject;
  bdba!: Bdba;
  newLine = "\r\n";
  backendTasks: BackendTask[] = [];

  // isExit: boolean = true;

  isAddCommentOpen: boolean = false;
  showSpinner: boolean = false;
  data_collection!: DataCollection;
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
  evidenceDialogRef: any;
  templateRef: any
  addCommentTemplateRef: any;
  evidenceLoaded: boolean = false;
  commentLoaded: boolean = false;
  // public dataSource = new MatTableDataSource<any | Group>([]);

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: ChecklistService, public dialog: MatDialog,
    public domSanitizer: DomSanitizer) {
    this.groupByColumns = ['vector'];
  }

  statusList: any[] = [
    { value: 'Done', viewValue: 'Done' },
    { value: 'N/A', viewValue: 'N/A' },
    { value: 'Open', viewValue: 'Open' },
    { value: 'WIP', viewValue: 'WIP' },
  ];

  displayedColumns = ['vector', 'details', 'owner', 'detailedStatus', 'status', 'releaseCriteria', 'evidence', 'comments'];
  evidenceDisplayedColumns = ['seq', 'actions', 'title', 'evidenceChild', 'evidenceDate', 'comments'];
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';

  
  ngOnInit(): void {
    // this.evidenceLoaded=false;
    this.data_collection = <DataCollection>{};
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.data_collection.business_unit = this.selectedProject.project_business_unit_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.milestone_id = this.selectedProject.project_milestone_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.project_id = this.selectedProject.project_name.toLowerCase().replace(/\s/g, "");

    this.selectedReleaseId = this.selectedProject.project_id!;
    this.releaseName = this.selectedProject.project_name;
    this.milestone = this.selectedProject.project_milestone_id;
    this.workWeek = this.selectedProject.project_release_date;

    this.showSpinner = true;
    this.isAddCommentOpen = false;

    this.addCommentForm = this.formBuilder.group({
      comment: [null, Validators.required],
      upload: [null, []],
    });

    this.addOwnerForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
    });

    // this.filter = { type: "CheckBox" };
    this.checkList = JSON.parse(localStorage.getItem("checkList")!);

    this.getSelectedTask();

  }

  ngOnDestroy(){
    // alert("data save");
    this.saveAndContinue();
  }

  /**
   * Get the selected project task
   */
  getSelectedTask() {
    this.service.getSelectedProjectTask(this.selectedReleaseId!).subscribe(
      (response) => {
        this.getDataCollections(); // temparory commented due to time taken
        // this.getDetails(); // Remove it before deployment
        this.backendTasks = response;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  /**
   * Get the selected Project data and set the value for 
   */
  // setTitle() {
  //   // this.release = this.checkList.find(x => x.id === this.selectedReleaseId)!;
  //   // this.releaseChecklist = this.release.releaseChecklist;
  //   this.selectedReleaseId = this.selectedProject.project_id!;
  //   this.releaseName = this.selectedProject.project_name;
  //   this.milestone = this.selectedProject.project_milestone_id;
  //   this.workWeek = this.selectedProject.project_release_date;
  //   // this.oldChecklist = this.releaseChecklist!;

  // }

  /**
   * Retrieve the data collection file from SMB server
   */
  getDataCollections() {
    this.highCount = 0;
    this.lowCount = 0;
    this.mediumCount = 0;
    this.infoCount = 0;
    let res1 = this.service.checkmarxScan(this.data_collection);
    let res2 = this.service.kwScan(this.data_collection);
    let res3 = this.service.protexScan(this.data_collection);
    let res4 = this.service.bdbaScan(this.data_collection);
    // Get the static data for associated with each task, currently we are geting this data from local stored files
    let res5 = this.service.getStaticData(this.milestone?.toLocaleLowerCase()!);
    forkJoin([res1, res2, res3, res4, res5]).subscribe(([data1, data2, data3, data4, data5]) => {
      this.checkMarxIssue = data1;
      this.tempText = data2;
      this.protexProj = data3;
      this.bdba = data4;
      this.details = data5;
      if (this.checkMarxIssue)
        this.runCheckMarxScan();
      if (this.tempText)
        this.getKwScan();
      if (this.protexProj)
        this.geProtexFile();
      if (this.bdba)
        this.geBdbaFile();

      this.createTasks();
    });

  }

  /**
   * Get the static data for assiciated with each task, currently we are geting this data from local stored files
   */
  // getStaticData() {
  //   this.service.details(this.milestone?.toLocaleLowerCase()!).subscribe(
  //     (response) => {
  //       this.details = response;
  //       this.createTasks();
  //     },
  //     (err) => {
  //       console.log(err.name);
  //     }
  //   );
  // }

  // getEvidence() {
  //   this.service.details(this.milestone?.toLocaleLowerCase()!).subscribe(
  //     (response) => {
  //       this.details = response;
  //     },
  //     (err) => {
  //       console.log(err.name);
  //     }
  //   );
  // }

  testData!: string[];

  /**
   * Create task list which displays on Release Compliance UI
   */
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
      checkList.owner_email = task.owner_email;
      checkList.status = task.status_id;
      checkList.guidelineId = task.backend_guideline?.id;
      checkList.detailedStatus = [];
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

      checkList.releaseCriteria = selectedDetail?.details.find(x => x.detail === task.backend_guideline?.task_name)?.releaseCriteria!;
      checkList.comments = task.backend_comments!.sort((a, b) => {
        if (b.date > a.date) {
          return 1;
        } else if (b.date < a.date) {
          return -1;
        } else {
          return 0;
        }
      });
      checkList.evidences = task.backend_evidences!.sort((a, b) => {
        if (b.date > a.date) {
          return 1;
        } else if (b.date < a.date) {
          return -1;
        } else {
          return 0;
        }
      });
      taskList.push(checkList);
    }
    this.showSpinner = false;
    this.viewReleaseChecklist = taskList;

    this.releaseChecklist = this.viewReleaseChecklist;

    localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));

    this.isLoading = false;
  }

  /**
   * View BDBA report
   */
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

    },
      (error) => {
        console.log('getPDF error: ', error);
      }
    );
  }

  /**
   * Open
   * @param fileName Name of the file
   * @param type type (Evidence or Comments)
   */
  openFile(fileName: string, type: string) {
    this.data_collection.file_type = type;
    var fileext = fileName.split(".").pop();
    let fileMIMEType = this.getMIMEtype(fileext!);
    this.service.getFile(this.data_collection, fileName).subscribe((data) => {

      var file = new Blob([data], { type: fileMIMEType })
      var fileURL = URL.createObjectURL(file);

      window.open(fileURL);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(fileURL);

    },
      (error) => {
        console.log('getPDF error: ', error);
      }
    );
  }

  getMIMEtype(extn: string) {
    let ext = extn.toLowerCase();
    return MIMETypes[ext as keyof typeof MIMETypes];
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

  getComments() {
    var selectedTask: BackendTask = this.backendTasks.find(x => x.guidelines_ptr_id == this.selectedRelease.guidelineId)!;
    this.viewComments = [];
    this.displayComments = [];

    for (var comment of selectedTask.backend_comments!) {
      this.viewComment = <ViewComment>{};
      this.viewComment.comments = comment.comments;
      this.viewComment.date = moment(comment.date).format('LLL');
      this.viewComment.content = comment.content;
      this.viewComments.push(this.viewComment);
    }
    this.displayComments = this.viewComments;
  }

  commentDialogRef: any;
  commentTemplateRef: any
  /**
   * Call when user click on View/Add Comment
   * @param id Unique Release Id
   */
  onCommentClicked(_templateRef: any, taskId: number) {
    this.commentLoaded = true;
    this.commentTemplateRef = _templateRef;
    this.selectedRelease = <ReleaseChecklist>{}
    this.selectedRelease = this.getCurrentRelease(taskId)!;
    this.commentsHeader = this.selectedRelease.vector + " Comments";
    this.selectedReleaseGuideline = taskId;
    this.createCommentList(this.selectedRelease, true);

  }

  /**
   * Create a New Comment List with updated comments
   * @param _selectedRelease Update Release Checklist
   */
  createCommentList(_selectedRelease: ReleaseChecklist, state: boolean) {

    var selectedTask: BackendTask = this.backendTasks.find(x => x.guidelines_ptr_id == _selectedRelease.guidelineId)!;
    this.viewComments = [];
    this.displayComments = [];

    // if(_selectedRelease.comments.length > 0){
    for (var comment of selectedTask.backend_comments!) {
      this.viewComment = <ViewComment>{};
      this.viewComment.comments = comment.comments;
      this.viewComment.date = moment(comment.date).format('LLL');
      this.viewComment.content = comment.content;
      this.viewComments.push(this.viewComment);
    }
    this.displayComments = this.viewComments;
    // this.commentDialog.show(); 
    // }else{
    //   this.commentDialog.show(); 
    //   this.openCommentDialog();
    // } 
    if (state)
      this.openCommentListDialog();

    this.updateReleaseCheckList(this.selectedRelease);
  }
  selectedReleaseGuideline!: number;

  /**
   * 
   * @param _templateRef 
   * @param id 
   * @param guidelineId 
   */
  onEvidenceClicked(_templateRef: any, taskId: number) {
    this.evidenceLoaded = true;
    this.templateRef = _templateRef;
    this.selectedRelease = <ReleaseChecklist>{};
    this.selectedRelease = this.getCurrentRelease(taskId)!;
    this.evidenceHeader = this.selectedRelease.vector + " Evidences";
    this.selectedReleaseGuideline = taskId;
    this.createEvidenceList(this.selectedRelease, true);

  }

  /**
   * Create Evidence List to show on View Evidence link
   * @param _selectedRelease Release Checklist
   */
  createEvidenceList(_selectedRelease: ReleaseChecklist, state: boolean) {
    let num: number = 0;
    this.displayEvidences = [];
    this.viewEvidences = [];
    var selectedTask: BackendTask = this.backendTasks.find(x => x.guidelines_ptr_id == _selectedRelease.guidelineId)!;
    // if(_selectedRelease.evidences.length > 0){
    for (var evidence of selectedTask.backend_evidences!) {
      num++;
      this.viewEvidence = <ViewEvidence>{};
      this.viewEvidence.seq = num;
      this.viewEvidence.evidence = evidence.evidence;
      this.viewEvidence.date = moment(evidence.date).format('LLL');
      this.viewEvidence.id = evidence.id;
      this.viewEvidence.title = evidence.title;
      this.viewEvidence.comments = evidence.comments;
      this.viewEvidence.type = evidence.type;
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
  * Get Current Release
  * @param releaseId Selected Release Id
  * @returns Current Release
  */
  getCurrentRelease(releaseId: number) {
    var selectedRelease = this.releaseChecklist!.find(t => t.id.toString() === releaseId.toString())!;
    return selectedRelease;
  }

  /**
   * Open Evidence List Dialog
   */
  openEvidenceListDialog() {
    this.evidenceDialogRef = this.dialog.open(this.templateRef, {
      height: '60%',
      width: '70%'
    });

    this.evidenceDialogRef.afterClosed().subscribe(() => {
      localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
    });
  }

  /**
   * Open Add New Comment Dialog
   */
  openAddCommentDialog() {
    this.commentDialogRef = this.dialog.open(this.commentTemplateRef, {
      height: '60%',
      width: '70%'
    });

    this.commentDialogRef.afterClosed().subscribe(() => {

    });
  }

  /**
   * Open Comment List Dialog
   */
  openCommentListDialog() {
    this.commentDialogRef = this.dialog.open(this.commentTemplateRef, {
      height: '60%',
      width: '70%'
    });

    this.commentDialogRef.afterClosed().subscribe(() => {

    });
  }

  /**
   * Close Evience List Dialog
   */
  closeEvidenceListDialog() {
    this.evidenceLoaded = false;
    this.evidenceDialogRef.close();
    // this.evidenceDialog.hide();
  }



  /**
   * Create a new Comment
   * @param newComment New Comment
   */
  addComment(newComment: BackendComments) {
    this.selectedRelease.comments.unshift(newComment);
    this.createCommentList(this.selectedRelease, false);
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
  saveRelease(navigate:boolean) {
    this.isSaved = true;
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
      newBackendTask.owner_email = release.owner_email;
      newBackendTask.status_id = release.status!;
      newBackendTask.project_id_id = this.selectedProject.project_id!;

      newBackendTaskArray.push(newBackendTask);

    }

    this.sendEmails();
    // console.log(JSON.stringify(newBackendTaskArray));
    // this.service.updateGuidelines(newBackendGuidelineArray).subscribe(data => {
    this.service.updateTasks(newBackendTaskArray).subscribe((status) => {
      localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
      this.isSaved = false;

      if(navigate){
        this.onSelection(true);
      }
      // this.toastObj.show(this.toasts[0]);
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
  addOwnerForm!: FormGroup;
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

  addEvidence() {
    const addEvidenceDialogRef = this.dialog.open(EvidenceAddComponent, {
      height: '50%',
      width: '40%',
      data: { task_id: this.selectedReleaseGuideline }
    });

    addEvidenceDialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.evidenceLoaded = false;
        this.selectedRelease.evidences.unshift(result.data);
        this.createEvidenceList(this.selectedRelease, false);
      }
    });
  }

  continueNavigation() {
    this.onSelection(true);
  }

  saveAndContinue() {
    this.saveRelease(true);
    // this.continueNavigation();
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
    this.saveAndContinue();
    // const dialogRef = this.dialog.open(ChecklistConfirmDialogComponent, {
    //   height: '20%',
    //   width: '30%'

    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result.data == "save") {
    //     this.saveAndContinue();
    //   } else if (result.data == "continue") {
    //     this.continueNavigation();
    //   }

    // });

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
    this.kwData.push("Critical Count: " + this.criticalCount);
    this.kwData.push("Error Count: " + this.errorCount);
    this.kwData.push("<br>");
  }


  async geProtexFile() {
    this.protexData = [];
    this.protexData.push("Protex Scan Data".bold());
    this.protexData.push("Scan Date: " + moment(this.protexProj.LastAnalyzed).format('ll'));
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

  selectCommentFile(fileInputEvent: any) {
    this.selectedFiles = fileInputEvent.target.files;
    this.selectedCommentFile = fileInputEvent.target.files[0];
  }

  newComment!: BackendComments;
  public Submit(): void {
    this.createNewComment();
    this.service.saveComment(this.newComment).subscribe((status) => {
      this.uploadCommentFile();
    });

    this.addComment(this.newComment);
    this.addCommentForm.reset();
    this.addCommentDialogRef.close();
  }

  uploadCommentFile() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedCommentFile;
      if (file) {
        this.currentFile = file;
        this.service.uploadFile(this.currentFile, this.selectedProject.project_business_unit_id, this.selectedProject.project_name, this.selectedProject.project_milestone_id).subscribe((status) => {
          localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
        });
      }
    }
  }

  createNewComment() {
    const newComments: BackendComments = {
      id: Math.floor(Math.random() * 90000) + 10000,
      comments: this.addCommentForm.controls[COMMENT_LOWER].value,
      date: moment(new Date().getTime()).format(),
      content: this.selectedCommentFile.name ? this.selectedCommentFile.name : '',
      task_id: this.selectedReleaseGuideline
    };
    this.newComment = newComments;
  }

  ownerDialogRef: any;
  addOwnerTemplateRef: any;
  ownerTaskId!: number;
  isSaved = false;
  tempOwnerName!: string;
  tempOwnerEmail!: string;
  addOwner(_templateRef: any, taskId: number, ownerName: string, ownerEmail: string) {
    this.tempOwnerName = ownerName;
    this.tempOwnerEmail = ownerEmail;
    this.addOwnerForm.patchValue({
      name: ownerName,
      email: ownerEmail
    });
    this.addOwnerTemplateRef = _templateRef;
    this.ownerTaskId = taskId;
    // this.selectedRelease = this.getCurrentRelease(taskId)!;
    this.ownerDialogRef = this.dialog.open(this.addOwnerTemplateRef, {
      height: '35%',
      width: '25%'
    });

    this.ownerDialogRef.afterClosed().subscribe(() => {
      localStorage.setItem("checkList", JSON.stringify(this.releaseChecklist));
    });
  }

  ownerEmails: OwnerEmail[] = [];
  saveOwner() {
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id.toString() == this.ownerTaskId.toString()));
    this.viewReleaseChecklist![objIndex].owner = this.addOwnerForm.controls[NAME_LOWER].value;
    this.viewReleaseChecklist![objIndex].owner_email = this.addOwnerForm.controls[EMAIL_LOWER].value;
    this.viewReleaseChecklist = [...this.viewReleaseChecklist];

    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id.toString() == this.ownerTaskId.toString()));
    this.releaseChecklist![objIndex1].owner = this.addOwnerForm.controls[NAME_LOWER].value;
    this.releaseChecklist![objIndex1].owner_email = this.addOwnerForm.controls[EMAIL_LOWER].value;
    if (this.tempOwnerEmail !== this.addOwnerForm.controls[EMAIL_LOWER].value) {
      let ownerEmail: OwnerEmail = <OwnerEmail>{};
      ownerEmail.email = this.addOwnerForm.controls[EMAIL_LOWER].value;
      ownerEmail.name = this.addOwnerForm.controls[NAME_LOWER].value;
      ownerEmail.task_name = this.viewReleaseChecklist![objIndex].details;
      ownerEmail.milestone = this.selectedProject.project_milestone_id;
      ownerEmail.project_name = this.selectedProject.project_name
      this.ownerEmails.push(ownerEmail);
    }
    this.addOwnerForm.reset();
    this.ownerDialogRef.close();
  }

  sendEmails() {
    if (this.ownerEmails) {
      this.service.sendEmail(this.ownerEmails).subscribe(() => {
        this.ownerEmails = [];
      });
    }
  }

  closeAddOwnerDialog() {
    this.ownerDialogRef.close();
  }

}
