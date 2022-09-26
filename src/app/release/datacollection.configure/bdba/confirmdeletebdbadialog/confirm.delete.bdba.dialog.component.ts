import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-confirm.delete.bdba.dialog',
  templateUrl: './confirm.delete.bdba.dialog.component.html',
  styleUrls: ['./confirm.delete.bdba.dialog.component.scss']
})
export class ConfirmDeleteBdbaDialogComponent implements OnInit {

  productName!: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteBdbaDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Stakeholder) { }

  ngOnInit(): void {
    this.productName = this.data.name;
  }

  delete() {
    this.dialogRef.close({ data: "delete" });
  }

}
