import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/home/home.models';
import { Kw_Config } from '../../datacollection.models';

@Component({
  selector: 'app-kw.add',
  templateUrl: './kw.add.component.html',
  styleUrls: ['./kw.add.component.scss']
})
export class KwAddComponent implements OnInit {

  addKwConfigForm!: FormGroup;
  selectedKwConfig!: Kw_Config;
  updatedKwCofig!: Kw_Config;
  selectedProject!: Project;
  newKwConfig!: Kw_Config;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<KwAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addKwConfigForm = this.formBuilder.group({
      kw_server: [null, []],
      kw_project_name: [null, []],
    });
    if (this.data) {
      this.selectedKwConfig = this.data.data;
      this.addKwConfigForm.patchValue({
        kw_server: this.selectedKwConfig.kw_server,
        kw_project_name: this.selectedKwConfig.kw_project_name,
      });
    }
  }

  Close() {
    this.dialogRef.close();
  }

  Submit() {
    this.createNewKw();
    this.dialogRef.close({ data: this.updatedKwCofig });
  }

  createNewKw() {
    if (this.selectedKwConfig) {
      this.selectedKwConfig.kw_server = this.addKwConfigForm.controls['kw_server'].value;
      this.selectedKwConfig.kw_project_name = this.addKwConfigForm.controls['kw_project_name'].value;
      this.updatedKwCofig = this.selectedKwConfig;
    } else {
      this.newKwConfig = <Kw_Config>{};
      this.newKwConfig.kw_server = this.addKwConfigForm.controls['kw_server'].value;
      this.newKwConfig.kw_project_name = this.addKwConfigForm.controls['kw_project_name'].value;
      this.newKwConfig.project_id = this.selectedProject.project_id;
      this.updatedKwCofig = this.newKwConfig;
    }

  }

}
