import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-confirm.delete.stakeholder.dialog',
  templateUrl: './confirm.delete.stakeholder.dialog.component.html',
  styleUrls: ['./confirm.delete.stakeholder.dialog.component.scss']
})
export class ConfirmDeleteStakeholderDialogComponent implements OnInit {

  stakeholderName!: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteStakeholderDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.stakeholderName = this.data.name;
    // alert(this.data.name);
  }

  delete() {
    this.dialogRef.close({ data: "delete" });
  }

}
