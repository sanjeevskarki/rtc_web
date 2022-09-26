import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-confirm.delete.kw.dialog',
  templateUrl: './confirm.delete.kw.dialog.component.html',
  styleUrls: ['./confirm.delete.kw.dialog.component.scss']
})
export class ConfirmDeleteKwDialogComponent implements OnInit {

  projectName!:string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteKwDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.projectName = this.data.name;
  }

  delete() {
    this.dialogRef.close({ data: "delete" });
  }

}
