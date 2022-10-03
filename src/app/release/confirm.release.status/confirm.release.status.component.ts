import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm.release.status',
  templateUrl: './confirm.release.status.component.html',
  styleUrls: ['./confirm.release.status.component.scss']
})
export class ConfirmReleaseStatusComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmReleaseStatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  changeStatus(){
    this.dialogRef.close({ data: "change" });
  }

  close(){
    this.dialogRef.close({ data: "close" });
  }

}
