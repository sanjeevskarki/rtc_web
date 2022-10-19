import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FACELESS_USER } from 'src/app/home/home.constants';
import { Project } from 'src/app/home/home.models';
import { Bdba_Config } from '../../datacollection.models';

@Component({
  selector: 'app-bdba.add',
  templateUrl: './bdba.add.component.html',
  styleUrls: ['./bdba.add.component.scss']
})
export class BdbaAddComponent implements OnInit {

  addBdbaConfigForm!: UntypedFormGroup;
  selectedProject!: Project;
  selectedBdbaConfig!: Bdba_Config;
  updateBdbaConfig!: Bdba_Config;
  newBdbaConfig!: Bdba_Config;
  user_added:boolean=false;
  facelessUser = FACELESS_USER;
  constructor(private formBuilder: UntypedFormBuilder, public dialogRef: MatDialogRef<BdbaAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addBdbaConfigForm = this.formBuilder.group({
      product_id: [null, [Validators.required,Validators.pattern('^[0-9]{7}$')]],
      product_name: [null, []],
      user_added: [null, []],
    });
    if (this.data) {
      this.selectedBdbaConfig = this.data.data;
      this.addBdbaConfigForm.patchValue({
        product_id: this.selectedBdbaConfig.product_id,
        product_name: this.selectedBdbaConfig.product_name,
        user_added: this.selectedBdbaConfig.user_added,
      });
    }
  }

  /**
   * Close BDBA config dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Save BDBA config object
   */
  saveBdbaConfig() {
    this.createNewBdba();
    this.dialogRef.close({ data: this.updateBdbaConfig });
  }

  /**
   * Create BDBA Config object
   */
  createNewBdba() {
    if (this.selectedBdbaConfig) {
      this.selectedBdbaConfig.product_id = this.addBdbaConfigForm.controls['product_id'].value;
      this.selectedBdbaConfig.product_name = this.addBdbaConfigForm.controls['product_name'].value;
      this.selectedBdbaConfig.user_added = this.user_added;
      this.updateBdbaConfig = this.selectedBdbaConfig;
    } else {
      this.newBdbaConfig = <Bdba_Config>{};
      this.newBdbaConfig.product_id = this.addBdbaConfigForm.controls['product_id'].value;
      this.newBdbaConfig.product_name = this.addBdbaConfigForm.controls['product_name'].value;
      // this.newBdbaConfig.project_id = this.selectedProject.project_id;
      this.newBdbaConfig.user_added = this.user_added;
      this.updateBdbaConfig = this.newBdbaConfig;
    }
  }

  /**
   * Check if User added marked or not
   * @param event Checkbox Event True or False
   */
  checkUserAdded(event: MatCheckboxChange){
    this.user_added = event.checked;
  }

}
