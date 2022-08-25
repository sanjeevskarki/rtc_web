import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from '../release.models';

@Component({
  selector: 'app-release.stakeholder',
  templateUrl: './release.stakeholder.component.html',
  styleUrls: ['./release.stakeholder.component.scss']
})
export class ReleaseStakeholderComponent implements OnInit {

  addStakeholderForm!: FormGroup;
  newStakeholder!:Stakeholder;
  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<ReleaseStakeholderComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.addStakeholderForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      wwid: [null, Validators.required],
      role: [null, Validators.required],
    });
  }

  closeContactDialog() {

  }

  Submit() {
    this.createNewStakeholder();
    this.dialogRef.close({ data: this.newStakeholder });
  }

  createNewStakeholder(){
    const newStakeholder: Stakeholder = {
      name: this.addStakeholderForm.controls['name'].value,

      email: this.addStakeholderForm.controls['email'].value,
      wwid: this.addStakeholderForm.controls['wwid'].value,
      role: this.addStakeholderForm.controls['role'].value,
    };
    this.newStakeholder = newStakeholder;
  }

}
