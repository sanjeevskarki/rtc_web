import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-confirm.delete.protex.dialog',
  templateUrl: './confirm.delete.protex.dialog.component.html',
  styleUrls: ['./confirm.delete.protex.dialog.component.scss']
})
export class ConfirmDeleteProtexDialogComponent implements OnInit {

  protexServer!:string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteProtexDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.protexServer = this.data.name;
    // alert(this.data.name);
  }

  delete() {
    this.dialogRef.close({ data: "delete" });
  }

}
