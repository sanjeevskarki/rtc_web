import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { BackendEvidences, Project } from '../home.models';
import { v4 as uuidv4 } from 'uuid';
import { EvidenceAddService } from './evidenceadd.service';
import { environment } from 'src/environments/environment';
import { DATE_FORMAT, UPLOAD_LOWER } from 'src/app/release/release.constants';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-evidenceadd',
  templateUrl: './evidenceadd.component.html',
  styleUrls: ['./evidenceadd.component.scss']
})
export class EvidenceAddComponent implements OnInit {

  baseUrl: string = environment.ENDPOINT;
  upload: string = UPLOAD_LOWER;


  public width: string = '30%';
  public height: string = '50%';
  public evidenceHeader: string = 'Add Evidence';
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  public evidenceType!: string;

  @Output() childEvent = new EventEmitter<BackendEvidences>();

  isFileUploadSelected: boolean = false;
  isLinkSelected: boolean = false;

  addEvidence() {
    this.isLinkSelected = false;
    this.isFileUploadSelected = false;
  }

  evidenceForm!: FormGroup;

  public visible: boolean = false;
  public multiple: boolean = false;
  public showCloseIcon: Boolean = true;
  public formHeader: string = 'Success';
  public content: string = 'Your details have been updated successfully, Thank you.';
  public reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  newEvidence!: BackendEvidences;
  selectedFile!: any;
  selectedProject!: Project;

  uploadTypes: any[] = [
    { value: 'file', viewValue: 'File' },
    { value: 'link', viewValue: 'Link' },
  ];

  public fields: Object = { text: 'Upload', value: 'Id' };
  public type: string = 'Select a Upload Type';

  public uploadInput: string = '';

  title = new FormControl('', [Validators.required]);
  comment = new FormControl('', [Validators.required]);

  constructor(private formBuilder: FormBuilder, private service: EvidenceAddService, public dialogRef: MatDialogRef<EvidenceAddComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: BackendEvidences) {
      
     }

  isValueExist(value: string): boolean {
    if (typeof value != 'undefined' && value) {
      return false;
    }
    return true;
  }

  public browseClick() {
    let linkCheck = this.evidenceForm.controls['link'].value;
    if (!this.isValueExist(linkCheck)) {
      this.evidenceForm.controls['upload'].reset();
      // this.toastObj.show(this.toasts[0]);
      return;
    }
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  onLinkSelected() {
    let uploadCheck = this.evidenceForm.controls['upload'].value;
    if (!this.isValueExist(uploadCheck)) {
      this.evidenceForm.controls['link'].reset();
      // this.toastObj.show(this.toasts[1]);
      return;
    }
  }

  selectedFiles?: FileList;
  currentFile?: File;

  selectEvidenceFile(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
    this.selectedFiles = fileInputEvent.target.files;
    this.selectedFile = fileInputEvent.target.files[0];
  }

  public Submit(): void {
    this.createNewEvidence();
    this.service.saveEvidence(this.newEvidence).subscribe((status) => {
      this.saveEvidenceFile();
    });

    this.dialogRef.close({ data: this.newEvidence });
  }

  saveEvidenceFile(){
    if (this.evidenceType === 'file') {
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
          this.currentFile = file;
          this.service.uploadFile(this.currentFile, this.selectedProject.project_business_unit_id, this.selectedProject.project_name, this.selectedProject.project_milestone_id).subscribe((status) => {
            
          });
        }
      }
    }
  
  }

  openInput() {
    document!.getElementById("fileInput")!.click();
  }

  ngOnInit() {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.isLinkSelected = false;
    this.isFileUploadSelected = false;

    this.evidenceForm = this.formBuilder.group({
      title: [null, Validators.required],
      type: [null, Validators.required],
      link: [null, [Validators.pattern(this.reg)]],
      upload: [null, []],
      comment: [null, Validators.required],
    });
  }

  /**
   * Close the Add Evidence Dialog
   */
  Close(){
    this.dialogRef.close();
  }

  evidenceDialogClose() {
    this.evidenceForm.reset();
  }

  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  createNewEvidence() {
    const newEvidence: BackendEvidences = {
      id: Math.floor(Math.random() * 90000) + 10000,
      task_id:this.data.task_id!,
      title: this.evidenceForm.controls['title'].value,
      comments: this.evidenceForm.controls['comment'].value,
      evidence: this.getEvidence(),
      type: this.evidenceType,
      date: moment(new Date().getTime()).format()
    };
    this.newEvidence = newEvidence;
  }

  getEvidence() {
    let evidence: string;
    if ((this.evidenceForm.controls['link'].value)) {
      // evidence="<p><a class=\"e-rte-anchor\" href=\"'"+this.evidenceForm.controls['link'].value+"\" title=\"'"+this.evidenceForm.controls['title'].value+"\" target=\"_blank\">"+this.evidenceForm.controls['title'].value+"</a></p>";
      evidence = this.evidenceForm.controls['link'].value;
      return evidence;
    } else if (this.evidenceForm.controls['upload'].value) {
      evidence = this.selectedFile.name?this.selectedFile.name:'';
      return evidence;
    }
    return '';
  }

  public isFieldValid(field: string) {
    return !this.evidenceForm.get(field)!.valid && (this.evidenceForm.get(field)!.dirty || this.evidenceForm.get(field)!.touched);
  }

  /**
   * Select the evidence type (File or Link)
   * @param args type of evidnece
   */
  onEvidenceTypeSelect(args: any): void {
    this.evidenceType = args.value;
    this.isFileUploadSelected = false;
    this.isLinkSelected = false;
    if (this.evidenceType === 'file') {
      this.isFileUploadSelected = true;
      this.isLinkSelected = false;
    } else {
      this.isLinkSelected = true;
      this.isFileUploadSelected = false;
    }
  }

}
