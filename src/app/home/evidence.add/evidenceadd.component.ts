import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators} from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { Evidences } from '../home.models';
import { v4 as uuidv4 } from 'uuid';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { EvidenceAddService } from './evidenceadd.service';


@Component({
  selector: 'app-evidenceadd',
  templateUrl: './evidenceadd.component.html',
  styleUrls: ['./evidenceadd.component.scss']
})
export class EvidenceAddComponent implements OnInit {

  @ViewChild('addEvidenceDialog')
  public addEvidenceDialog!: DialogComponent;

  public header: string = 'About SYNCFUSION Succinctly Series';
  
  public width: string = '30%';
  public height: string = '50%';
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public target: string = '.control-section';
  public target1: string = '#modalTarget';
  public target2: string = '#addEvidenceDialog';
  public isModal: Boolean = true;
  public hidden: Boolean = false;
  public position: object={ X: 'center', Y: 'center' };
  public toastPosition: ToastPositionModel = { X: 'Right' };
  public evidenceHeader: string='Add Evidence';
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  public evidenceType!:string;

  @ViewChild('toasttype')
  private toastObj!: ToastComponent;
  @Output() childEvent = new EventEmitter<any>();

  public toasts: { [key: string]: Object }[] = [
    { title: 'Error!', content: 'You have already added a link. Please remove it for upoading a file', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Error!', content: 'You have already uploaded a file. Please remove it for adding a link', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Success!', content: 'Evidence Added Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  ];

  isFileUploadSelected:boolean=false;
  isLinkSelected:boolean=false;
 
  // On Dialog close, 'Open' Button will be shown
  public dialogClose = (): void => {
      document.getElementById('dlgbtn')!.style.display = '';
  }
  // On Dialog open, 'Open' Button will be hidden
  public dialogOpen = (): void => {
      document.getElementById('dlgbtn')!.style.display = 'none';
  }

  public BtnClick = (): void => {
      this.addEvidenceDialog.show();
  }

  addEvidence(){
    this.isLinkSelected=false;
    this.isFileUploadSelected=false;
    this.addEvidenceDialog.show();
  }

  closeEvidence(){
    this.addEvidenceDialog.hide();
  }
  evidenceForm!: FormGroup;

  @ViewChild('defaultupload')
  public evidenceUploadObj!: UploaderComponent;
  @ViewChild('Dialog')
  public dialogObj!: DialogComponent;
  
  //  public width: string = '335px';
  public visible: boolean = false;
  public multiple: boolean = false;
  public showCloseIcon: Boolean = true;
  public formHeader: string = 'Success';
  public content: string = 'Your details have been updated successfully, Thank you.';
  public reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  newEvidence!:Evidences;
  selectedFile!:File;
  public dlgBtnClick: EmitType<object> = () => {
  this.dialogObj.hide();
  }

  public uploadTypes: Object[] = [
    { Id: 'file', Upload: 'File' },
    { Id: 'link', Upload: 'Link' }
  ];

  public fields: Object = { text: 'Upload', value: 'Id' };
  public type: string = 'Select a Upload Type';

  @ViewChild('uploadType')
  public uploadTypeObj!: DropDownListComponent;

  // public dlgButtons: Object[] = [{ click: this.dlgBtnClick.bind(this), buttonModel: { content: 'Ok', isPrimary: true } }];
  public uploadInput: string = '';

  constructor(private formBuilder: FormBuilder,private service:EvidenceAddService) {}

  isValueExist(value:string): boolean {
    if (typeof value != 'undefined' && value) {
      return false;
    }
    return true;
  }

  public browseClick() {
    let linkCheck = this.evidenceForm.controls['link'].value;
    if(!this.isValueExist(linkCheck)){
      this.evidenceForm.controls['upload'].reset();
      this.toastObj.show(this.toasts[0]);
      return;
    }
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  // public onFileSelected() {
  //   let linkCheck = this.evidenceForm.controls['link'].value;
  //   if(!this.isValueExist(linkCheck)){
  //     this.evidenceForm.controls['upload'].reset();
  //     this.toastObj.show(this.toasts[0]);
  //     return;
  //   }
  //   document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  // }

  onLinkSelected(){
    let uploadCheck = this.evidenceForm.controls['upload'].value;
    if(!this.isValueExist(uploadCheck)){
      this.evidenceForm.controls['link'].reset();
      this.toastObj.show(this.toasts[1]);
      return;
    }
  }

  public Submit(): void {
    this.createNewEvidence();
    if(this.evidenceType === 'file'){
      alert("saved file name = "+this.selectedFile);
      this.service.updateEvidenceFile(this.selectedFile).subscribe((status) => {
        alert("status = "+status.type);
        this.toastObj.show(this.toasts[0]);
      });
    }
    this.childEvent.emit(this.newEvidence);
    this.toastObj.show(this.toasts[2]);
    this.addEvidenceDialog.hide();
  }

  
  public onEvidenceFileSelect: EmitType<Object> = (args: any) => {
    
    this.uploadInput = args.filesData[0].name;
    this.selectedFile = args.filesData[0];
  }

  ngOnInit() {
    this.isLinkSelected=false;
    this.isFileUploadSelected=false;
    this.evidenceForm = this.formBuilder.group({
      title: [null, Validators.required],
      type:[null, Validators.required],
      link: [null, [Validators.pattern(this.reg)]],
      upload:  [null, []],
      comment: [null, Validators.required],
    });
  }

  evidenceDialogClose(){
    this.evidenceForm.reset();
  }

  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  createNewEvidence() {
    const newEvidence: Evidences = {
      id:uuidv4(),
      title: this.evidenceForm.controls['title'].value,
      comments: this.evidenceForm.controls['comment'].value,
      evidence: this.getEvidence(),
      type: this.evidenceType,
      date: new Date().getTime() 
    };
    this.newEvidence = newEvidence;
  }
  
  getEvidence(){
    let evidence:string;
    if((this.evidenceForm.controls['link'].value)){
      evidence="<p><a class=\"e-rte-anchor\" href=\"'"+this.evidenceForm.controls['link'].value+"\" title=\"'"+this.evidenceForm.controls['title'].value+"\" target=\"_blank\">"+this.evidenceForm.controls['title'].value+"</a></p>";
      return evidence;
    }else if (this.evidenceForm.controls['upload'].value){
      evidence = this.evidenceForm.controls['upload'].value;
      alert(evidence);
      return evidence;
    }
    return '';
  }

  public isFieldValid(field: string) {
    return !this.evidenceForm.get(field)!.valid && (this.evidenceForm.get(field)!.dirty || this.evidenceForm.get(field)!.touched);
  }

  onTypeSelect(args:any): void {
    this.evidenceType = args.value;
    this.isFileUploadSelected=false;
      this.isLinkSelected=false;
    if(this.evidenceType === 'file'){
      this.isFileUploadSelected=true;
      this.isLinkSelected=false;
    }else{
      this.isLinkSelected=true;
      this.isFileUploadSelected=false;
    }
  }

}
