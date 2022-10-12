import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm.upload.file',
  templateUrl: './confirm.upload.file.component.html',
  styleUrls: ['./confirm.upload.file.component.scss']
})
export class ConfirmUploadFileComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmUploadFileComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  changeStatus(){
    this.dialogRef.close({ data: "change" });
  }

  close(){
    this.dialogRef.close({ data: "close" });
  }

}
