import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendComments, BackendEvidences, BackendTask, Checklist, NotificationSetting, OwnerEmail, Project, ReleaseChecklist, ReleaseDetails, ReleaseTask } from '../home.models';
import { ChecklistService } from './checklist.service';
import * as moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EvidenceAddComponent } from '../evidence.add/evidenceadd.component';
import { forkJoin, Subject } from 'rxjs';
import { BdbaResult, Checkmarx, DataCollection, Kw, KwResults, Project as ProtexProject, ProtexResult, TaskStatus } from './checklist.models';
import { COMPOSITION_ANALYSIS_ISSUES, MIMETypes, openStatusArray, PROTEX_MATCHES_LICENSE_CONFLICTS, RELEASED_LOWERCASE, STATIC_ANALYSIS_ISSUE } from '../home.constants';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ATTACHMENTS_LOWERCASE, CHECKLIST_LOWERCASE, COMMENT_LOWERCASE, EMAIL_LOWERCASE, NAME_LOWERCASE } from 'src/app/release/release.constants';
import { DownloadingstatusComponent } from 'src/app/downloadingstatus/downloadingstatus.component';
import { ConfirmUploadFileComponent } from './confirm.upload.file/confirm.upload.file.component';
import { Editor, Toolbar } from 'ngx-editor';

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

export class ChecklistComponent implements OnInit, OnDestroy {

  checkList: Checklist[] = [];
  releaseChecklist: ReleaseChecklist[] | undefined = [];

  public commentsHeader!: string;
  public evidenceHeader!: string;

  selectedProject!: Project;
  selectedReleaseId!: number;
  releaseName!: string;
  milestone!: string;
  workWeek!: string;
  viewComments: BackendComments[] = [];
  displayComments: BackendComments[] = [];
  viewComment!: BackendComments;
  viewEvidence!: BackendEvidences;
  viewEvidences: BackendEvidences[] = [];
  displayEvidences: BackendEvidences[] = [];

  selectedRelease!: ReleaseChecklist;

  @Output() childEvent = new EventEmitter();
  @Output() childEvent2 = new EventEmitter();

  public confirmHeader: string = 'Delete Evidence';

  @ViewChild(EvidenceAddComponent, { static: false }) evidenceAddComponent!: EvidenceAddComponent;

  selectedEvidence!: BackendEvidences;
  viewReleaseChecklist: ReleaseChecklist[] = [];
  details: ReleaseDetails[] = [];

  scanDate!: string;
  checkMarxIssue!: Checkmarx;
  highCount: number = 0;
  lowCount: number = 0;
  mediumCount: number = 0;
  infoCount: number = 0;
  // protexProj1!: ProtexProject;
  // protexProj2!: ProtexProject;
  // bdba!: Bdba;
  bdbaResults: BdbaResult[] = [];
  newLine = "\r\n";
  backendTasks: BackendTask[] = [];

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
  // tempText!: string;
  kwResults: KwResults[] = [];
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
  existingNotificationSetting!: NotificationSetting;
  taskStatusList: TaskStatus[] = [];
  testData!: string[];
  commentDialogRef: any;
  commentTemplateRef: any;
  addCommentDialogRef!: any;
  addCommentForm!: UntypedFormGroup;
  addOwnerForm!: UntypedFormGroup;
  isBdba!: boolean;
  isLoaded!: boolean;
  ownerEmails: OwnerEmail[] = [];
  // selectedFiles?: FileList;
  currentFile?: File;
  public selectedCommentFile!: any;
  // newComment!: BackendComments;
  ownerDialogRef: any;
  addOwnerTemplateRef: any;
  ownerTaskId!: number;
  isSaved = false;
  tempOwnerName!: string;
  tempOwnerEmail!: string;
  public taskStatus: any[] = [];
  protexResults: ProtexResult[] = [];
  commentFormHeader!:string;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  vieweditor!: Editor;

  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private service: ChecklistService, public dialog: MatDialog,
    public domSanitizer: DomSanitizer) {
    this.groupByColumns = ['vector'];
  }

  displayedColumns = ['vector', 'details', 'owner', 'detailedStatus', 'status', 'releaseCriteria', 'evidence', 'comments'];
  evidenceDisplayedColumns = ['seq', 'evidenceActions', 'actions', 'title', 'evidenceChild', 'evidenceDate', 'comments'];
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';


  ngOnInit(): void {
    this.editor = new Editor();
    // this.evidenceLoaded=false;
    this.getTaskStatus();

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
    this.checkList = JSON.parse(localStorage.getItem(CHECKLIST_LOWERCASE)!);
    this.getNotificationSettings();
    this.getSelectedTask();

  }

  /**
   * Get notification from DB based on email notification will be send
   */
  getNotificationSettings() {
    this.service.getNotifications(this.selectedProject.project_owner_email).subscribe((response) => {
      this.existingNotificationSetting = response;
      localStorage.setItem('notificationSettings', JSON.stringify(this.existingNotificationSetting));
    });
  }

  ngOnDestroy() {
    // this.saveAndContinue();
    this.saveRelease(true);
  }

  /**
   * Get all the availbale task status from DB
   */
  getTaskStatus() {
    this.service.getTaskStatus().subscribe(
      (response) => {
        this.taskStatusList = response;
        this.createTaskStatusDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  /**
   * Create dropdowm for Task Status
   */
  createTaskStatusDropdown() {
    if (this.taskStatusList != null) {
      for (var i = 0; i < this.taskStatusList.length; i++) {
        this.taskStatus.push({ value: this.taskStatusList[i].status, viewValue: this.taskStatusList[i].status });
      }
    }
  }

  /**
   * Get the selected project task
   */
  getSelectedTask() {
    // alert("get selected task");
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
   * Retrieve the data collection file from SMB server
   */
  getDataCollections() {
    this.highCount = 0;
    this.lowCount = 0;
    this.mediumCount = 0;
    this.infoCount = 0;
    this.protexData = [];
    // let res1 = this.service.checkmarxScan(this.data_collection);
    // let res2 = this.service.kwScan(this.data_collection);
    let res2 = this.service.getKwResults(this.selectedProject.project_id!);
    let res3 = this.service.getProtexResults(this.selectedProject.project_id!);
    // let res3 = this.service.protexScanFile1(this.data_collection);
    // let res6 = this.service.protexScanFile2(this.data_collection);
    let res4 = this.service.getBdbaResults(this.selectedProject.project_id!);
    // let res4 = this.service.bdbaScan(this.data_collection);
    // Get the static data for associated with each task, currently we are geting this data from local stored files
    let res5 = this.service.getStaticData(this.milestone?.toLocaleLowerCase()!);
    // forkJoin([res1, res2, res3, res4, res5, res6]).subscribe(([data1, data2, data3, data4, data5, data6]) => {
    forkJoin([res2, res3, res4, res5]).subscribe(([data2, data3, data4, data5]) => {
      // this.checkMarxIssue = data1;
      this.kwResults = data2;
      this.protexResults = data3;
      // this.protexProj2 = data6;
      this.bdbaResults = data4;
      this.details = data5;
      // if (this.checkMarxIssue)
      //   this.runCheckMarxScan();
      if (this.kwResults.length > 0)
        this.getKwScan(this.kwResults);
      if (this.protexResults.length > 0)
        this.geProtexFile(this.protexResults);
      // if (this.protexProj2)
      //   this.geProtexFile(this.protexProj2);
      if (this.bdbaResults.length > 0)
        this.geBdbaFile(this.bdbaResults);

      this.createTasks();
    });

  }

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

    localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));

    this.isLoading = false;
  }

  /**
   * Open BDBA report
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

  downloadStatusDialogRef!: any;
  /**
   * Open selected Comment or Evidence file
   * @param fileName Name of the file
   * @param type type (Evidence or Comments)
   */
  openFile(fileName: string, type: string) {
    this.downloadStatusDialogRef = this.dialog.open(DownloadingstatusComponent, {
      height: '10%',
      width: '30%',
      disableClose: true
    });

    // console.log("Downloading starts at ===== " + moment().format('MMMM Do YYYY, h:mm:ss a'));
    this.data_collection.file_type = type;

    var fileext = fileName.split(".").pop();
    let fileMIMEType = this.getMIMEtype(fileext!);
    this.service.getFile(this.data_collection, fileName).subscribe((data) => {

      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([data], { type: fileMIMEType }));
      // a.target = '_blank';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      // URL.revokeObjectURL(fileURL);

      this.downloadStatusDialogRef.close();
      // console.log("Downloading ends at ===== " + moment().format('MMMM Do YYYY, h:mm:ss a'));
    },
      (error) => {
        console.log('getPDF error: ', error);
      }
    );
  }

  /**
   * Get MIME type for provided file extension
   * @param extn file extension
   * @returns MIME Type
   */
  getMIMEtype(extn: string) {
    let ext = extn.toLowerCase();
    return MIMETypes[ext as keyof typeof MIMETypes];
  }


  // public onUploadSuccess(args: any): void {
  //   if (args.operation === 'upload') {
  //     // console.log('File uploaded successfully'+ JSON.stringify(args));
  //   }
  // }


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

  /**
   * Get list of comments
   */
  // getComments() {
  //   var selectedTask: BackendTask = this.backendTasks.find(x => x.guidelines_ptr_id == this.selectedRelease.guidelineId)!;
  //   this.viewComments = [];
  //   this.displayComments = [];

  //   for (var comment of selectedTask.backend_comments!) {
  //     this.viewComment = <ViewComment>{};
  //     this.viewComment.comments = comment.comments;
  //     this.viewComment.date = moment(comment.date).format('LLL');
  //     this.viewComment.content = comment.content;
  //     this.viewComments.push(this.viewComment);
  //   }
  //   this.displayComments = this.viewComments;
  // }

  /**
   * Call when user click on View/Add Comment
   * @param _templateRef Dialog Reference
   * @param taskId Selected Task Id
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
    // form = new FormGroup({
    //   editorContent: new FormControl(
    //     { value: jsonDoc, disabled: false },
    //     Validators.required()
    //   ),
    // });

    // if(_selectedRelease.comments.length > 0){
    for (var comment of selectedTask.backend_comments!) {
      this.viewComment = <BackendComments>{};
      this.viewComment.id = comment.id!;
      this.viewComment.comments = comment.comments;
      this.viewComment.date = moment(comment.date).format('LLL');
      this.viewComment.content = comment.content;
      this.viewComment.task_id = comment.task_id;
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

  // extractContent(htmlCode: string) {
  //   let span = document.getElementById('cmt');
  //   span.innerHTML = htmlCode;
  //   return span.textContent || span.innerText;
  // };

  selectedReleaseGuideline!: number;

  /**
   * Open Evidence List for Selected Task Id
   * @param _templateRef Dialog Reference
   * @param taskId Selected Task Id
   */
  onEvidenceClicked(_templateRef: any, taskId: number) {
    this.evidenceLoaded = false;
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
    if(selectedTask.backend_evidences != null){
    for (var evidence of selectedTask.backend_evidences) {
      num++;
      this.viewEvidence = <BackendEvidences>{};
      this.viewEvidence.seq = num;
      this.viewEvidence.evidence = evidence.evidence;
      this.viewEvidence.date = moment(evidence.date).format('LLL');
      this.viewEvidence.id = evidence.id;
      this.viewEvidence.title = evidence.title;
      this.viewEvidence.comments = evidence.comments;
      this.viewEvidence.task_id = evidence.task_id;
      this.viewEvidence.type = evidence.type;
      // this.viewComment.date = this.service.getNiceTime(duration);
      this.viewEvidences.push(this.viewEvidence);
    }
    this.displayEvidences = this.viewEvidences;
    if (state)
      this.openEvidenceListDialog();
    // this.evidenceDialog.show();
    }
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
      width: '75%',
      disableClose: true
    });

    this.evidenceDialogRef.afterClosed().subscribe(() => {
      localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));
    });
  }

  /**
   * Open Add New Comment Dialog
   */
  openAddCommentDialog() {
    this.commentDialogRef = this.dialog.open(this.commentTemplateRef, {
      height: '60%',
      width: '75%',
      disableClose: true
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
      width: '70%',
      disableClose: true
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

  // /**
  //  * Create a new Comment
  //  * @param newComment New Comment
  //  */
  // addComment(newComment: BackendComments) {
  //   this.selectedRelease.comments.unshift(newComment);
  //   this.createCommentList(this.selectedRelease, false);
  // }



  /**
   * Update Existing release checklist
   * @param _selectedRelease ReleaseCheckList
   */
  updateReleaseCheckList(_selectedRelease: ReleaseChecklist) {
    let itemIndex = this.releaseChecklist!.findIndex(item => item.id == _selectedRelease.id);
    this.releaseChecklist![itemIndex] = _selectedRelease;
  }

  isReleaseStatusCheck: boolean = false;
  /**
   * Create Updated Task List and Save 
   */
  saveRelease(navigate: boolean) {
    this.isSaved = true;
    var newBackendTask: ReleaseTask;

    var newBackendTaskArray: ReleaseTask[] = [];
    for (var release of this.releaseChecklist!) {
      newBackendTask = <ReleaseTask>{};
      newBackendTask.guidelines_ptr_id = release.id;
      newBackendTask.owner = release.owner;
      newBackendTask.owner_email = release.owner_email;
      newBackendTask.status_id = release.status!;
      newBackendTask.project_id_id = this.selectedProject.project_id!;

      newBackendTaskArray.push(newBackendTask);
      if (!this.isReleaseStatusCheck && this.selectedProject.project_release_status === RELEASED_LOWERCASE && openStatusArray.find((str) => str === release.status)) {
        this.isReleaseStatusCheck = true;
        this.checkReleaseStatus(newBackendTask.project_id_id, false);
      }

    }
    if (!this.isReleaseStatusCheck && this.selectedProject.project_release_status === RELEASED_LOWERCASE) {
      this.checkReleaseStatus(this.selectedProject.project_id!, true);
    }

    this.sendEmails();

    this.service.updateTasks(newBackendTaskArray).subscribe((status) => {
      localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));
      this.isSaved = false;

      if (navigate) {
        this.onSelection(true);
      }

    });

  }

  /**
   * 
   * @param projectId 
   */
  checkReleaseStatus(projectId: number, status: boolean) {
    this.service.changeTaskStatus(projectId, status).subscribe((status) => {
    });
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
  openCommentDialog(_templateRef: any) {
    this.selectedFilename='';
    this.commentFormHeader = 'Add Comment';
    this.selectedComment = <BackendComments>{};
    this.addCommentTemplateRef = _templateRef;
    this.selectedCommentFile = <any>{};
    this.addCommentDialogRef = this.dialog.open(this.addCommentTemplateRef, {
      height: '50%',
      width: '40%',
      disableClose: true
    });

    this.addCommentDialogRef.afterClosed().subscribe(( ) => {
      if (this.updatedComment) {
        this.selectedRelease.comments.unshift(this.updatedComment);
        this.createCommentList(this.selectedRelease, false);
      }
    });
  }

  /**
   * Call when evidence delete
   * @param _selectedEvidence Selected Evidence to delete
   */
   editSelectedEvidence(_selectedEvidence: BackendEvidences): void {
    this.selectedEvidence = _selectedEvidence;
    const editEvidenceDialogRef = this.dialog.open(EvidenceAddComponent, {
      height: '57%',
      width: '40%',
      disableClose: true,
      data: this.selectedEvidence
    });

    editEvidenceDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.evidenceLoaded = false;
        let index = this.selectedRelease.evidences.findIndex( x => x.id === result.data.id);
        this.selectedRelease.evidences.splice(index, 1);
        this.selectedRelease.evidences.unshift(result.data);
        this.createEvidenceList(this.selectedRelease, false);
      }
    });
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

  /**
   * Open Add Evidence Dialog
   */
  addEvidence() {
    const addEvidenceDialogRef = this.dialog.open(EvidenceAddComponent, {
      height: '57%',
      width: '40%',
      disableClose: true,
      data: { task_id: this.selectedReleaseGuideline }
    });

    addEvidenceDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.evidenceLoaded = false;
        this.selectedRelease.evidences.unshift(result.data);
        this.createEvidenceList(this.selectedRelease, false);
      }
    });
  }

  continueNavigation() {
    this.onSelection(true);
  }

  // saveAndContinue() {
  //   this.saveRelease(true);
  //   // this.continueNavigation();
  // }

  /**
   * Check whether any data has been changed before routing to other page
   * @returns boolean value true if data change, false when nothing changed
   */
  checkData() {
    var storedReleaseChecklist: Checklist[] = JSON.parse(localStorage.getItem(CHECKLIST_LOWERCASE)!);
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

  /**
   * Set Toast timeout
   */
  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  /**
   * Close Comments List Dialog
   */
  closeCommentDialog() {
    this.commentDialogRef.close();
    // this.commentDialog.hide();
  }

  /**
   * Close Add Comments Dialog
   */
  closeAddCommentDialog() {
    this.addCommentForm.reset();
    this.addCommentDialogRef.close();
    
  }
  public onFileSelected() {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  /**
   * Prepare BDBA Scan data
   */
  geBdbaFile(bdbaResults: BdbaResult[]) {
    this.bdbaData = [];
    // const summary = this.bdba.results.summary;
    // const totalVun = summary["vuln-count"].total;
    if (bdbaResults) {
      for (var bdbaResult of bdbaResults) {
        this.bdbaData.push(bdbaResult.file_name.bold());
        this.bdbaData.push("ScanDate: " + moment(bdbaResult.results.ScanDate).format('MMMM Do YYYY, h:mm:ss a'));
        this.bdbaData.push("Total Vulnerability: " + bdbaResult.results.VulnerabilityCount);
        this.bdbaData.push("<br>");
      }
    }
  }


  /**
   * Prepare CheckMarx Scan Data
   */
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


  /**
   * Prepare KW scan data
   */
  getKwScan(kwResults: KwResults[]) {

    if (kwResults) {
      for (var kwResult of kwResults) {
        this.kwData.push("KW Scan Data".bold());
        this.kwData.push("Critical Count: " + kwResult.results.CriticalCount);
        this.kwData.push("Error Count: " + kwResult.results.ErrorCount);
        this.kwData.push("<br>");
      }
    }

    // this.errorCount = 0;
    // this.criticalCount = 0;
    // this.kwIssue = [];
    // let re = /\}{/gi;
    // this.responseText = "[" + this.tempText.replace(re, "},{") + "]";
    // this.kwIssue = JSON.parse(this.responseText);
    // console.log(JSON.parse(this.responseText));
    // this.runKwScan();
  }


  // runKwScan() {
  //   this.kwData = [];
  //   this.kwAnalyzeIssue = this.kwIssue.filter(data => data.status === 'Analyze');
  //   for (var issue of this.kwAnalyzeIssue) {
  //     switch (issue.severity) {
  //       case 'Error':
  //         this.errorCount++;
  //         break;
  //       case 'Critical':
  //         this.criticalCount++;
  //         break;
  //       default:
  //     }
  //   }
  //   this.kwData.push("KW Scan Data".bold());
  //   this.kwData.push("Critical Count: " + this.criticalCount);
  //   this.kwData.push("Error Count: " + this.errorCount);
  //   this.kwData.push("<br>");
  // }


  async geProtexFile(protexResults: ProtexResult[]) {
    // this.protexData = [];
    var count = 1;
    if (protexResults) {
      for (var protexResult of protexResults) {
        this.protexData.push(("Protex File:" + count).bold());
        this.protexData.push("Scan Date: " + moment(protexResult.results.lastAnalyzed).format('MMMM Do YYYY, h:mm:ss a'));
        this.protexData.push("Code Matches:" + protexResult.results.pendingID);
        this.protexData.push("License Conflicts:" + protexResult.results.BOMComponentLicenseConflicts);
        this.protexData.push("<br>");
        count++;
      }

    }
  }



  onLoad(args: any) {
    let proxy: ChecklistComponent = this;
    setTimeout(() => {
      proxy.isLoaded = true;
    }, 1000);
  }

  getClass(proj: ReleaseChecklist) {

    switch (proj.status) {
      case 'Done': {
        return '#E3FCEF';
      }
      case 'WIP': {
        return '#d6dbf0';
      }
      case 'Open': {
        return '#FFEBE6';
      }
      case 'N/A': {
        return '#F4F5F7';
      }
      case 'Pending Exception': {
        return '#FFEBE6';
      }
      case 'Formal Exception Approved': {
        return '#E3FCEF';
      }
      case 'Deviation Approved': {
        return '#E3FCEF';
      }
      default: {
        //statements; 
        break;
      }
    }

  }


  openCommentInput() {
    document!.getElementById("commentFileInput")!.click();
  }

  selectedFilename!:string;
  // validFileSize: boolean = true;
  selectCommentFile(fileInputEvent: any) {
    let sizeInBytes: number = fileInputEvent.target.files[0].size;
    if (sizeInBytes / 1024 / 1024 < 10) {
      // this.validFileSize = true;
      var file = fileInputEvent.target.files[0].name;
      var fileName = file.substr(0, file.lastIndexOf('.'));
      var fileExtension = '.' + fileInputEvent.target.files[0].name.split('.').pop();

      var name = fileName + "_" + new Date().getTime() + fileExtension;
      var blob = fileInputEvent.target.files[0].slice(0, fileInputEvent.target.files[0].size, fileInputEvent.target.files[0].type);
      this.selectedCommentFile = new File([blob], name, { type: fileInputEvent.target.files[0].type });
      this.selectedFilename = this.selectedCommentFile.name;
    } else {
      // this.validFileSize = false;
      this.openFileErrorUploadDialog();
    }


  }

  fileErrorRef: any;
  /**
   * open FIle Size Error Dialog 
   */
  openFileErrorUploadDialog() {
    this.fileErrorRef = this.dialog.open(ConfirmUploadFileComponent, {
      height: '15%',
      width: '20%',
      disableClose: true
    });
  }
  existingFileName!:string;
  uploading: boolean = false;
  public saveComment(): void {
    this.createNewComment();
    if(this.selectedComment.id){
      if(this.updatedComment.content){
        this.deleteEvidenceFile(this.existingFileName);
        this.uploadCommentFile();
      }else{
        this.updatedComment.content = this.existingFileName; 
      }
      this.service.updateComment(this.updatedComment).subscribe((status) => {    
          this.addCommentForm.reset();
          this.addCommentDialogRef.close();
      });
    }else{
      this.service.saveComment(this.updatedComment).subscribe((status) => {
        if (this.selectedCommentFile?.name) {
          this.uploadCommentFile();
        }else{
          this.addCommentForm.reset();
          this.addCommentDialogRef.close();
        }
      });
    }

    // this.addComment(this.newComment);

  }

  updatedComment!:BackendComments;
  createNewComment() {
    console.log("**********"+JSON.stringify(this.addCommentForm.controls[COMMENT_LOWERCASE].value));
    if(this.selectedComment.id){
      this.selectedComment.task_id = this.selectedComment.task_id!;
      this.selectedComment.date = moment(new Date().getTime()).format();
      this.selectedComment.content = this.selectedCommentFile.name ? this.selectedCommentFile.name : '';
      this.selectedComment.comments = this.addCommentForm.controls[COMMENT_LOWERCASE].value;
      this.updatedComment=this.selectedComment;
    }else{
      const newComments: BackendComments = {
        // id: Math.floor(Math.random() * 90000) + 10000,
        comments: this.addCommentForm.controls[COMMENT_LOWERCASE].value,//this.addCommentForm.controls[COMMENT_LOWERCASE].value,
        date: moment(new Date().getTime()).format(),
        content: this.selectedCommentFile.name ? this.selectedCommentFile.name : '',
        task_id: this.selectedReleaseGuideline
      };
      this.updatedComment = newComments;
    }
    
  }

  /**
   * Upload comment file to server
   */
  uploadCommentFile() {
    const file: File | null = this.selectedCommentFile;
    if (file) {
      this.uploading = true;
      this.currentFile = file;
      this.service.uploadFile(this.currentFile, this.selectedProject.project_business_unit_id, this.selectedProject.project_name, this.selectedProject.project_milestone_id).subscribe((status) => {
        this.uploading = false;
        this.addCommentForm.reset();
        this.addCommentDialogRef.close();
        localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));
       
      });
    }
  }

  selectedComment!:BackendComments;
  editSelectedComment(_templateRef:any,selectedComment:BackendComments){
    this.commentFormHeader = 'Update Comment';
    this.selectedComment=selectedComment;
    this.existingFileName = selectedComment.content;
    this.selectedFilename = selectedComment.content;
    this.addCommentForm.patchValue({
      comment: selectedComment.comments,
      upload: selectedComment.content,
    });
    this.addCommentTemplateRef = _templateRef;
    this.selectedCommentFile = <any>{};
    this.addCommentDialogRef = this.dialog.open(this.addCommentTemplateRef, {
      height: '50%',
      width: '40%',
      disableClose: true
    });

    this.addCommentDialogRef.afterClosed().subscribe(( ) => {
      if(this.updatedComment){
        let index = this.selectedRelease.comments.findIndex( x => x.id === this.updatedComment.id);
        this.selectedRelease.comments.splice(index, 1);
        this.selectedRelease.comments.unshift(this.updatedComment);
        this.createCommentList(this.selectedRelease, false);
        }
    });
  }

  /**
   * 
   * @param _templateRef Dialog Reference
   * @param taskId Selected Task Id
   * @param ownerName Owner Name
   * @param ownerEmail Owner Email
   */
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
      width: '25%',
      disableClose: true
    });

    this.ownerDialogRef.afterClosed().subscribe(() => {
      localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));
    });
  }


  /**
   * Save Owner
   */
  saveOwner() {
    const objIndex = this.viewReleaseChecklist!.findIndex((obj => obj.id.toString() == this.ownerTaskId.toString()));
    this.viewReleaseChecklist![objIndex].owner = this.addOwnerForm.controls[NAME_LOWERCASE].value;
    this.viewReleaseChecklist![objIndex].owner_email = this.addOwnerForm.controls[EMAIL_LOWERCASE].value;
    this.viewReleaseChecklist = [...this.viewReleaseChecklist];

    const objIndex1 = this.releaseChecklist!.findIndex((obj => obj.id.toString() == this.ownerTaskId.toString()));
    this.releaseChecklist![objIndex1].owner = this.addOwnerForm.controls[NAME_LOWERCASE].value;
    this.releaseChecklist![objIndex1].owner_email = this.addOwnerForm.controls[EMAIL_LOWERCASE].value;
    if (this.tempOwnerEmail !== this.addOwnerForm.controls[EMAIL_LOWERCASE].value) {
      let ownerEmail: OwnerEmail = <OwnerEmail>{};
      ownerEmail.email = this.addOwnerForm.controls[EMAIL_LOWERCASE].value;
      ownerEmail.name = this.addOwnerForm.controls[NAME_LOWERCASE].value;
      ownerEmail.task_name = this.viewReleaseChecklist![objIndex].details;
      ownerEmail.milestone = this.selectedProject.project_milestone_id;
      ownerEmail.project_name = this.selectedProject.project_name
      this.ownerEmails.push(ownerEmail);
    }
    this.addOwnerForm.reset();
    this.ownerDialogRef.close();
  }

  /**
   * Send Email
   */
  sendEmails() {
    if (this.ownerEmails.length > 0) {
      this.service.sendEmail(this.ownerEmails).subscribe(() => {
        this.ownerEmails = [];
      });
    }
  }

  /**
   * Close Owner Dialog
   */
  closeAddOwnerDialog() {
    this.ownerDialogRef.close();
  }

  
  deleteEvidenceFile(fileName:string){
    this.data_collection.file_type = ATTACHMENTS_LOWERCASE;
    this.service.deleteFile(this.data_collection, fileName).subscribe((data) => {
      
    },
    (error) => {
      console.log('getPDF error: ', error);
    }
    );

  }

}
