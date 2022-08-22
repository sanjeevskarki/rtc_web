import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';
import { Comments, Files, Project, ReleaseChecklist } from '../home.models';

import { CommentAddService } from './commentadd.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-commentadd',
  templateUrl: './commentadd.component.html',
  styleUrls: ['./commentadd.component.scss'],
  providers: [],
})
export class CommentAddComponent implements OnInit {

  public addCommentHeader!: string;
  commentForm!: FormGroup;
  files:Files[]=[];
  file!:Files;
  // @ViewChild('addCommentDialog')
  // public addCommentDialog!: DialogComponent;

  height: number = 350;
  value = '';
  
  public target1: string = '#modalTarget';
  public target2: string = '#addCommentDialog';
  // public toastPosition: ToastPositionModel = { X: 'Right' };
  public uploadCommentInput: string = '';
  public visible: boolean = false;
  public multiple: boolean = false;
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  public position: object={ X: 'center', Y: 'center' };
  // public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public width: string = '37%';

  public isModal: Boolean = true;
  public hidden: Boolean = false;

  selectedFiles?: FileList;
  currentFile?: File;
  public selectedCommentFile!:any;

  // @ViewChild('upload')
  // public uploadObj!: UploaderComponent;

  // public tools: ToolbarModule = {
  //   items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
  //       'FontName', 'FontSize','|',
  //       'Formats', 'NumberFormatList', 'BulletFormatList','|',
  //       'CreateLink']
  // };

  newComment!:Comments;
  selectedRelease!:ReleaseChecklist;
  @Output() childEvent1 = new EventEmitter<any>();

  // @ViewChild('toasttype')
  // private toastObj!: ToastComponent;
 

  // public toasts: { [key: string]: Object }[] = [
  //   { title: 'Success!', content: 'Comment Added Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  // ];
  // public path: Object = {
  //   saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
  //   removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
  // };
  // public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;

  // @ViewChild('commentUpload')
  // public uploadObj!: UploaderComponent;

  // @ViewChild('default', { static: false })
  // private rteObj!: RichTextEditorComponent;

  selectedProject!: Project;
  fileName!:string;
  
  constructor(private formBuilder: FormBuilder,private service:CommentAddService,public dialogRef: MatDialogRef<CommentAddComponent>,@Inject(MAT_DIALOG_DATA) public data: Comments) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addCommentHeader = "Add Comment";
    this.commentForm = this.formBuilder.group({
      comment: [null, Validators.required],
      upload:  [null, []],
    });
  }

  commentDialogClose(){
    this.commentForm.reset();
    // this.uploadObj.clearAll();
  }

  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  public onFileSelected() {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  // public onCommentFileSelect: EmitType<Object> = (args: any) => {
  //   this.uploadCommentInput = args.filesData[0].name;
  //   this.file=<Files>{};
  //   this.file.id = args.filesData[0].id;
  //   this.file.name = args.filesData[0].name;
  //   this.files.push(this.file);
    
  // }

  // addComment(){
  //   this.addCommentDialog.show();
  //   this.rteObj.refreshUI();
  // }

  closeComment(){
    // this.addCommentDialog.hide();
  }

  public Submit(): void {
    this.createNewComment();
    if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
          this.currentFile = file;
          this.service.uploadFile(this.currentFile,this.selectedProject.project_business_unit_id,this.selectedProject.project_name,this.selectedProject.project_milestone_id).subscribe((status) => {
          });
        }
    }
    // this.childEvent1.emit(this.newComment);
    // this.toastObj.show(this.toasts[0]);
    // this.addCommentDialog.hide();
    // alert("new message"+this.newComment.message);
    this.dialogRef.close({data:this.newComment});
  }
 
  createNewComment() {
    const newComments: Comments = {
      id:uuidv4(),
      message: this.commentForm.controls['comment'].value,
      date: new Date().getTime(),
      file: this.selectedCommentFile.name 
    };
    this.newComment = newComments;
  }

  // onFileRemove(args: RemovingEventArgs): void {
  //   this.files = this.files.filter(item => item.id !== args.filesData[0].id);
  //   args.postRawFile = false;
  // }

  openCommentInput(){ 
    document!.getElementById("commentFileInput")!.click();
  }

  

  commentInputChange(fileInputEvent: any) {
    this.selectedFiles = fileInputEvent.target.files;
    this.selectedCommentFile = fileInputEvent.target.files[0];
    this.fileName = this.selectedCommentFile.name;
    // alert(this.selectedCommentFile.name);
  }

}
