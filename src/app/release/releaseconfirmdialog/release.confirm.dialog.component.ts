import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-release.confirm.dialog',
  templateUrl: './release.confirm.dialog.component.html',
  styleUrls: ['./release.confirm.dialog.component.scss']
})
export class ReleaseConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReleaseConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  continueNavigation(){
    this.dialogRef.close({data:"continue"});
  }

}
