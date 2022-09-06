import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';
import { BackendComments, Files, Project, ReleaseChecklist } from '../home.models';

import { CommentAddService } from './commentadd.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DATE_FORMAT } from 'src/app/release/release.constants';


@Component({
  selector: 'app-commentadd',
  templateUrl: './commentadd.component.html',
  styleUrls: ['./commentadd.component.scss'],
  providers: [],
})
export class CommentAddComponent implements OnInit {

  public addCommentHeader!: string;
  commentForm!: FormGroup;
  files: Files[] = [];
  file!: Files;


  height: number = 350;
  value = '';

  public target1: string = '#modalTarget';
  public target2: string = '#addCommentDialog';
  // public toastPosition: ToastPositionModel = { X: 'Right' };
  public uploadCommentInput: string = '';
  public visible: boolean = false;
  public multiple: boolean = false;
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  public position: object = { X: 'center', Y: 'center' };
  // public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public width: string = '37%';

  public isModal: Boolean = true;
  public hidden: Boolean = false;

  selectedFiles?: FileList;
  currentFile?: File;
  public selectedCommentFile!: any;


  newComment!: BackendComments;
  selectedRelease!: ReleaseChecklist;
  @Output() childEvent1 = new EventEmitter<any>();


  selectedProject!: Project;
  fileName!: string;

  constructor(private formBuilder: FormBuilder, private service: CommentAddService, public dialogRef: MatDialogRef<CommentAddComponent>, @Inject(MAT_DIALOG_DATA) public data: BackendComments) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addCommentHeader = "Add Comment";
    this.commentForm = this.formBuilder.group({
      comment: [null, Validators.required],
      upload: [null, []],
    });
  }

  commentDialogClose() {
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

  closeComment() {
    // this.addCommentDialog.hide();
  }

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

    this.dialogRef.close({ data: this.newComment });
  }

 

  createNewComment() {
    const newComments: BackendComments = {
      id: Math.floor(Math.random() * 90000) + 10000,
      comments: this.commentForm.controls['comment'].value,
      date: moment(new Date().getTime()).format(),
      content: this.selectedCommentFile.name,
      task_id:0
    };
    this.newComment = newComments;
  }


  openCommentInput() {
    document!.getElementById("commentFileInput")!.click();
  }

  commentInputChange(fileInputEvent: any) {
    this.selectedFiles = fileInputEvent.target.files;
    this.selectedCommentFile = fileInputEvent.target.files[0];
    this.fileName = this.selectedCommentFile.name;
  }

}
