import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-checklist.confirm.dialog',
  templateUrl: './checklist.confirm.dialog.component.html',
  styleUrls: ['./checklist.confirm.dialog.component.scss']
})
export class ChecklistConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChecklistConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  saveAndContinue(){
    this.dialogRef.close({data:"save"});
  }

  continueNavigation(){
    this.dialogRef.close({data:"continue"});
  }

}
