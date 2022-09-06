import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-release.stakeholder',
  templateUrl: './release.stakeholder.component.html',
  styleUrls: ['./release.stakeholder.component.scss']
})
export class ReleaseStakeholderComponent implements OnInit {

  addStakeholderForm!: FormGroup;
  newStakeholder!:Stakeholder;
  roles: any[] = [
    { value: 'Project Manager', viewValue: 'Project Manager' },
    { value: 'Program Manager', viewValue: 'Program Manager' },
    { value: 'Product Architect', viewValue: 'Product Architect' },
    { value: 'System Architect', viewValue: 'System Architect' },
    { value: 'Security Lead', viewValue: 'Security Lead' },
    { value: 'Development Lead', viewValue: 'Development Lead' },
    { value: 'Validation Lead', viewValue: 'Validation Lead' },
    { value: 'Marketing', viewValue: 'Marketing' },
    { value: 'Other', viewValue: 'Other' },
  ];
  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<ReleaseStakeholderComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.addStakeholderForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      wwid: [null, []],
      role: [null, Validators.required],
    });
  }

  /**
   * Close the Add Stakeholder Dialog
   */
  Close(){
    this.dialogRef.close();
  }
  

  Submit() {
    this.createNewStakeholder();
    this.dialogRef.close({ data: this.newStakeholder });
  }

  createNewStakeholder(){
    const newStakeholder: Stakeholder = {
      id: Math.floor(Math.random() * 90000) + 10000,
      name: this.addStakeholderForm.controls['name'].value,
      email: this.addStakeholderForm.controls['email'].value,
      wwid: this.addStakeholderForm.controls['wwid'].value,
      role: this.addStakeholderForm.controls['role'].value,
    };
    this.newStakeholder = newStakeholder;
  }

}
