import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/home/home.models';
import { Protex_Config } from '../../datacollection.models';

@Component({
  selector: 'app-protex.add',
  templateUrl: './protex.add.component.html',
  styleUrls: ['./protex.add.component.scss']
})
export class ProtexAddComponent implements OnInit {

  addProtexConfigForm!: FormGroup;
  newProtexConfig!: Protex_Config;
  selectedProject!: Project;
  selectedProtexConfig!: Protex_Config;
  updateProtexCofig!: Protex_Config;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<ProtexAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addProtexConfigForm = this.formBuilder.group({
      protex_server: [null, [Validators.required]],
      protex_project_id: [null, []],
    });
    if (this.data) {
      this.selectedProtexConfig = this.data.data;
      this.addProtexConfigForm.patchValue({
        protex_server: this.selectedProtexConfig.protex_server,
        protex_project_id: this.selectedProtexConfig.protex_project_id,
      });
    }
  }

  /**
   * Close Add Protex Dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Save Protec Config Object
   */
  saveProtexConfig() {
    this.createNewProtex();
    this.dialogRef.close({ data: this.updateProtexCofig });
  }

  /**
   * Create Protex Config Object
   */
  createNewProtex() {
    if (this.selectedProtexConfig) {
      this.selectedProtexConfig.protex_server = this.addProtexConfigForm.controls['protex_server'].value;
      this.selectedProtexConfig.protex_project_id = this.addProtexConfigForm.controls['protex_project_id'].value;
      this.updateProtexCofig = this.selectedProtexConfig;
    } else {
      this.newProtexConfig = <Protex_Config>{};
      this.newProtexConfig.protex_server = this.addProtexConfigForm.controls['protex_server'].value;
      this.newProtexConfig.protex_project_id = this.addProtexConfigForm.controls['protex_project_id'].value;
      this.newProtexConfig.project_id = this.selectedProject.project_id;
      this.updateProtexCofig = this.newProtexConfig;
    }

  }
}
