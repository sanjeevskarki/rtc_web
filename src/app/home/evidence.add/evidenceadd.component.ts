import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl
} from '@angular/forms';

import { BackendEvidences, Project } from '../home.models';
import { EvidenceAddService } from './evidenceadd.service';
import { environment } from 'src/environments/environment';
import { EVIDENCES_LOWERCASE, UPLOAD_LOWERCASE } from 'src/app/release/release.constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ConfirmUploadFileComponent } from '../checklist/confirm.upload.file/confirm.upload.file.component';
import { DataCollection } from '../checklist/checklist.models';

@Component({
  selector: 'app-evidenceadd',
  templateUrl: './evidenceadd.component.html',
  styleUrls: ['./evidenceadd.component.scss']
})
export class EvidenceAddComponent implements OnInit {

  baseUrl: string = environment.ENDPOINT;
  upload: string = UPLOAD_LOWERCASE;


  public width: string = '30%';
  public height: string = '50%';
  public evidenceHeader!: string ;
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  public evidenceType!: string;

  @Output() childEvent = new EventEmitter<BackendEvidences>();

  isFileUploadSelected: boolean = false;
  isLinkSelected: boolean = false;

  addEvidence() {
    this.isLinkSelected = false;
    this.isFileUploadSelected = false;
  }

  evidenceForm!: UntypedFormGroup;

  public visible: boolean = false;
  public multiple: boolean = false;
  public showCloseIcon: Boolean = true;
  public formHeader: string = 'Success';
  public content: string = 'Your details have been updated successfully, Thank you.';
  public reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  newEvidence!: BackendEvidences;
  selectedFile!: any;
  selectedProject!: Project;
  existingFileName!:string;

  uploadTypes: any[] = [
    { value: 'file', viewValue: 'File' },
    { value: 'link', viewValue: 'Link' },
  ];

  public fields: Object = { text: 'Upload', value: 'Id' };
  public type: string = 'Select a Upload Type';

  public uploadInput: string = '';

  title = new UntypedFormControl('', [Validators.required]);
  comment = new UntypedFormControl('', [Validators.required]);

  constructor(private formBuilder: UntypedFormBuilder, private service: EvidenceAddService, public dialogRef: MatDialogRef<EvidenceAddComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: BackendEvidences) {

  }

  selectedEvidence!:BackendEvidences;
  ngOnInit() {
    this.selectedEvidence = this.data;
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.isLinkSelected = false;
    this.isFileUploadSelected = false;
    this.evidenceForm = this.formBuilder.group({
      title: [null, Validators.required],
      type: [null, []],
      link: [null, [Validators.pattern(this.reg)]],
      upload: [null, []],
      comment: [null, Validators.required],
    });

    if(this.selectedEvidence.id){
      this.evidenceHeader='Update Evidence';
      this.evidenceForm.patchValue({
        title: this.selectedEvidence.title,
        type: this.selectedEvidence.type,
        // link: this.selectedEvidence.evidence,
        // upload: this.selectedEvidence.,
        comment: this.selectedEvidence.comments,
      });
      if (this.selectedEvidence.type === 'file') {
        this.isFileUploadSelected = true;
        this.isLinkSelected = false;
       
        // this.evidenceForm.patchValue({
        //   upload: this.selectedEvidence.evidence,
        // });
        this.existingFileName = this.selectedEvidence.evidence;
        this.selectedFilename = this.selectedEvidence.evidence;
        this.selectedFile = this.selectedEvidence.evidence;
      } else {
        this.evidenceForm.patchValue({
          link: this.selectedEvidence.evidence,
        });
        
        this.isLinkSelected = true;
        this.isFileUploadSelected = false;
      }
      this.evidenceType = this.selectedEvidence.type;
    }else{
      this.evidenceHeader='Add Evidence';
    }
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

  // selectedFiles?: FileList;
  currentFile?: File;
  // validFileSize:boolean=true;
  selectedFilename!:string;
  selectEvidenceFile(fileInputEvent: any) {
    
    let sizeInBytes: number = fileInputEvent.target.files[0].size;
    if(sizeInBytes/1024/1024 < 10){
      // this.validFileSize = true;
      var file = fileInputEvent.target.files[0].name;
      var fileName = file.substr(0, file.lastIndexOf('.'));
      var fileExtension = '.' + fileInputEvent.target.files[0].name.split('.').pop();

      var name = fileName+"_"+ new Date().getTime() + fileExtension;
      var blob = fileInputEvent.target.files[0].slice(0, fileInputEvent.target.files[0].size, fileInputEvent.target.files[0].type); 
      this.selectedFile = new File([blob], name, {type: fileInputEvent.target.files[0].type});
      this.selectedFilename = this.selectedFile.name;
    }else{
      // this.validFileSize = false;
      this.openFileErrorUploadDialog();
    }
    

  }

  fileErrorRef:any;
  /**
  * Open Evidence List Dialog
 */
 openFileErrorUploadDialog() {
  this.fileErrorRef = this.dialog.open(ConfirmUploadFileComponent, {
    height: '15%',
    width: '20%',
    disableClose: true
  });

  // this.evidenceDialogRef.afterClosed().subscribe(() => {
  //   localStorage.setItem(CHECKLIST_LOWERCASE, JSON.stringify(this.releaseChecklist));
  // });
}

  uploading:boolean=false;
  addedEvidence!:BackendEvidences;
  /**
   * Save Evidence
   */
  public saveEvidence(): void {
    this.createNewEvidence();
    console.log(JSON.stringify(this.updateEvidence));
    if (this.selectedEvidence.id) {
      if (this.evidenceType === 'file') {
        if(this.updateEvidence.evidence){
          this.deleteEvidenceFile(this.existingFileName);
          this.uploadEvidenceFile();
        }else{
          this.updateEvidence.evidence = this.selectedFilename; 
        }
      }
      this.service.updateEvidence(this.updateEvidence).subscribe((status) => {
        this.dialogRef.close({ data: this.updateEvidence });
      });
    }else{
      if (this.evidenceType === 'file') {
        this.uploadEvidenceFile();
      }
      this.service.saveEvidence(this.updateEvidence).subscribe((status) => {
        this.addedEvidence=status;
        this.dialogRef.close({ data: this.addedEvidence });
      });
    }
    
  }
  progress = 0;
  /**
   * Upload Evidence File to server
   */
  uploadEvidenceFile() {
    this.progress = 0;
      if (this.selectedFile) {
        const file: File | null = this.selectedFile;
        if (file) {
          this.uploading=true;
          this.currentFile = file;
          this.service.uploadFile(this.currentFile, this.selectedProject.project_business_unit_id, this.selectedProject.project_name, 
            this.selectedProject.project_milestone_id).subscribe((status) => {
              // alert(status.message)
              // alert(event.type)
              // if (event.type === HttpEventType.UploadProgress) {
              //   this.progress = Math.round(100 * event.loaded / event.total);
              //   console.log('Progress-------- ' + this.progress + '%');
              // }
              this.uploading=false;
              // this.dialogRef.close({ data: this.updateEvidence });
          });
        }
      }else{
        // this.dialogRef.close({ data: this.newEvidence });
      }
  }

  openInput() {
    document!.getElementById("fileInput")!.click();
  }

  data_collection!: DataCollection;
  deleteEvidenceFile(fileName:string){
    this.data_collection = <DataCollection>{};
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.data_collection.business_unit = this.selectedProject.project_business_unit_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.milestone_id = this.selectedProject.project_milestone_id.toLowerCase().replace(/\s/g, "");
    this.data_collection.project_id = this.selectedProject.project_name.toLowerCase().replace(/\s/g, "");
    this.data_collection.file_type = EVIDENCES_LOWERCASE;
   
    this.service.deleteFile(this.data_collection, fileName).subscribe((data) => {
      
    },
    (error) => {
      console.log('getPDF error: ', error);
    }
    );

  }

  requiredFileType(type: string) {
    return function (control: UntypedFormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

      return null;
    };
  }

  /**
   * Close the Add Evidence Dialog
   */
  close() {
    this.dialogRef.close();
  }

  evidenceDialogClose() {
    this.evidenceForm.reset();
  }

  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  updateEvidence!:BackendEvidences;
  /**
   * Create Evidence object
   */
  createNewEvidence() {
    if (this.selectedEvidence.id) {
      this.selectedEvidence.task_id = this.selectedEvidence.task_id!;
      this.selectedEvidence.title = this.evidenceForm.controls['title'].value;
      this.selectedEvidence.comments = this.evidenceForm.controls['comment'].value;
      // alert("this.getEvidence() = "+this.getEvidence());
      this.selectedEvidence.evidence= this.getEvidence();
      this.selectedEvidence.type= this.evidenceType;
      this.selectedEvidence.date = moment(new Date().getTime()).format();
      this.updateEvidence = this.selectedEvidence;
    } else {
      this.newEvidence = <BackendEvidences>{};
      this.newEvidence.task_id = this.data.task_id!,
      this.newEvidence.title = this.evidenceForm.controls['title'].value,
      this.newEvidence.comments = this.evidenceForm.controls['comment'].value,
      this.newEvidence.evidence= this.getEvidence(),
      this.newEvidence.type= this.evidenceType,
      this.newEvidence.date = moment(new Date().getTime()).format();
      this.updateEvidence = this.newEvidence;
    }

    // const newEvidence: BackendEvidences = {
    //   task_id: this.data.task_id!,
    //   title: this.evidenceForm.controls['title'].value,
    //   comments: this.evidenceForm.controls['comment'].value,
    //   evidence: this.getEvidence(),
    //   type: this.evidenceType,
    //   date: moment(new Date().getTime()).format()
    // };
    // this.newEvidence = newEvidence;
  }

  /**
   * Get Evidence based on selected type
   * @returns Evidence Value
   */
  getEvidence() {
    let evidence: string;
    if ((this.evidenceForm.controls['link'].value)) {
      // evidence="<p><a class=\"e-rte-anchor\" href=\"'"+this.evidenceForm.controls['link'].value+"\" title=\"'"+this.evidenceForm.controls['title'].value+"\" target=\"_blank\">"+this.evidenceForm.controls['title'].value+"</a></p>";
      evidence = this.evidenceForm.controls['link'].value;
      return evidence;
    } else if (this.evidenceForm.controls['upload'].value) {
      evidence = this.selectedFile?.name ? this.selectedFile.name : '';
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
