import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-confirm.delete.bkc.dialog',
  templateUrl: './confirm.delete.bkc.dialog.component.html',
  styleUrls: ['./confirm.delete.bkc.dialog.component.scss']
})
export class ConfirmDeleteBkcDialogComponent implements OnInit {

  bkcTitle!:string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteBkcDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.bkcTitle = this.data.name;
    // alert(this.data.name);
  }

  delete() {
    this.dialogRef.close({ data: "delete" });
  }

}
