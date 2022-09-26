import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Bkc } from '../../home.models';


@Component({
  selector: 'app-bkc.add',
  templateUrl: './bkc.add.component.html',
  styleUrls: ['./bkc.add.component.scss']
})
export class BkcAddComponent implements OnInit {

  addBkcForm!: FormGroup;
  selectedBkc!: Bkc;
  newBkc!: Bkc;
  formHeader!: string;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<BkcAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.formHeader = 'Add BKC';
    this.addBkcForm = this.formBuilder.group({
      title: [null, Validators.required],
      version: [null, []],
      comment: [null, []],

    });
    if (this.data) {
      this.formHeader = 'Update BKC';
      this.selectedBkc = this.data.data;
      this.addBkcForm.patchValue({
        title: this.selectedBkc.title,
        version: this.selectedBkc.version,
        comment: this.selectedBkc.comment,
      });
    }

  }

  /**
   * Close the Add/Update BKC Dialog
   */
  closeBkc() {
    this.dialogRef.close();
  }

  /**
   * Save BKC form
   */
  saveBkc() {
    this.createNewBkc();
    this.dialogRef.close({ data: this.newBkc });
  }

  /**
   * Create BKC object for saving,it can be a new object or an existing one based on the selected opeartion
   */
  createNewBkc() {
    let tempid;
    if (this.selectedBkc) {
      tempid = this.selectedBkc.id;
    } else {
      tempid = Math.floor(Math.random() * 90000) + 10000;
    }
    const newBkc: Bkc = {
      id: tempid,
      title: this.addBkcForm.controls['title'].value,
      version: this.addBkcForm.controls['version'].value,
      comment: this.addBkcForm.controls['comment'].value,
      last_updated: moment(new Date().getTime()).format(),
    };
    this.newBkc = newBkc;
  }
}
