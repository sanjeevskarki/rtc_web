import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-release.stakeholder',
  templateUrl: './release.stakeholder.component.html',
  styleUrls: ['./release.stakeholder.component.scss']
})
export class ReleaseStakeholderComponent implements OnInit {

  addStakeholderForm!: UntypedFormGroup;
  newStakeholder!:Stakeholder;
  selectedStakeholder!:Stakeholder;
  roles: any[] = [
    { value: 'Project Manager', viewValue: 'Project Manager' },
    { value: 'Program Manager', viewValue: 'Program Manager' },
    { value: 'Product Architect', viewValue: 'Product Architect' },
    { value: 'System Architect', viewValue: 'System Architect' },
    { value: 'Security Lead', viewValue: 'Security Lead' },
    { value: 'Development Lead', viewValue: 'Development Lead' },
    { value: 'Validation Lead', viewValue: 'Validation Lead' },
    { value: 'Marketing', viewValue: 'Marketing' },
    { value: 'Security Champion', viewValue: 'Security Champion' },
    { value: 'Product Security Expert', viewValue: 'Product Security Expert (PSE)' },
    { value: 'Security & Privacy Lead', viewValue: 'Security & Privacy Lead (SPL)' },
    { value: 'Attorney', viewValue: 'Attorney' },
    { value: 'Other', viewValue: 'Other' },
  ];
  constructor(private formBuilder: UntypedFormBuilder,public dialogRef: MatDialogRef<ReleaseStakeholderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
    this.addStakeholderForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      wwid: [null, []],
      role: [null, Validators.required]
    });
    if (this.data) {
      this.selectedStakeholder = this.data.data;
      this.addStakeholderForm.patchValue({
        name: this.selectedStakeholder.name,
        email: this.selectedStakeholder.email,
        wwid: this.selectedStakeholder.wwid,
        role: this.selectedStakeholder.role,
        email_notification: this.selectedStakeholder.email_notification,
      });
    }
  }

  /**
   * Close the Add Stakeholder Dialog
   */
  close(){
    this.dialogRef.close();
  }
  
  /**
   * Save Stakeholder
   */
  saveStakeholder() {
    this.createNewStakeholder();
    this.dialogRef.close({ data: this.newStakeholder });
  }

  /**
   * Create New Stakeholder object
   */
  createNewStakeholder(){
    let emailNotification:boolean=true;
    // alert(this.addStakeholderForm.controls['email_notification'].value);
    let tempid;
    if(this.selectedStakeholder) {
      tempid= this.selectedStakeholder.id;
    }else{
      tempid= Math.floor(Math.random() * 90000) + 10000;
    }
    if(this.addStakeholderForm.controls['role'].value === 'Attorney'){
      emailNotification = false;
    }
    const newStakeholder: Stakeholder = {
      id: tempid,
      name: this.addStakeholderForm.controls['name'].value,
      email: this.addStakeholderForm.controls['email'].value,
      wwid: this.addStakeholderForm.controls['wwid'].value,
      role: this.addStakeholderForm.controls['role'].value,
      email_notification: emailNotification,
    };
    this.newStakeholder = newStakeholder;
  }

}
