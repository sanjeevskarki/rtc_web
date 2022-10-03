import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validator, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/home/home.models';
import { ReleaseService } from 'src/app/release/release.service';
import { Protex_Config, Scan_Server } from '../../datacollection.models';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-protex.add',
  templateUrl: './protex.add.component.html',
  styleUrls: ['./protex.add.component.scss']
})
export class ProtexAddComponent implements OnInit {

  addProtexConfigForm!: UntypedFormGroup;
  newProtexConfig!: Protex_Config;
  // selectedProject!: Project;
  selectedProtexConfig!: Protex_Config;
  updateProtexCofig!: Protex_Config;
  user_added: boolean = false;
  prefix = 'c_';
  scanServerList!: Scan_Server[];
  scanServers!: any[];
  constructor(private formBuilder: UntypedFormBuilder, public dialogRef: MatDialogRef<ProtexAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: ReleaseService) { }

  ngOnInit(): void {
    this.getServer();
    // this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addProtexConfigForm = this.formBuilder.group({
      protex_server: [null, [Validators.required]],
      protex_project_id: [null, []],
      user_added: [null, []],
    });
    if (this.data) {
      this.selectedProtexConfig = this.data.data;
      this.addProtexConfigForm.patchValue({
        protex_server: this.selectedProtexConfig.protex_server,
        protex_project_id: this.selectedProtexConfig.protex_project_id,
        user_added: this.selectedProtexConfig.user_added,
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
    // if (this.selectedProject) {
      if (this.selectedProtexConfig) {
        this.selectedProtexConfig.protex_server = this.addProtexConfigForm.controls['protex_server'].value;
        this.selectedProtexConfig.protex_project_id = this.addProtexConfigForm.controls['protex_project_id'].value;
        this.selectedProtexConfig.user_added = this.user_added;
        this.updateProtexCofig = this.selectedProtexConfig;
      } else {
        this.newProtexConfig = <Protex_Config>{};
        this.newProtexConfig.protex_server = this.addProtexConfigForm.controls['protex_server'].value;
        this.newProtexConfig.protex_project_id = this.addProtexConfigForm.controls['protex_project_id'].value;
        this.newProtexConfig.user_added = this.user_added;
        // this.newProtexConfig.project_id = this.selectedProject.project_id;
        this.updateProtexCofig = this.newProtexConfig;
      }
    // }else{
    //   this.newProtexConfig = <Protex_Config>{};
    //   this.newProtexConfig.protex_server = this.addProtexConfigForm.controls['protex_server'].value;
    //   this.newProtexConfig.protex_project_id = this.addProtexConfigForm.controls['protex_project_id'].value;
    //   this.newProtexConfig.user_added = this.user_added;
    //   this.updateProtexCofig = this.newProtexConfig;
    // }
  }

  /**
   * Check if User added marked or not
   * @param event Checkbox Event True or False
   */
  checkUserAdded(event: MatCheckboxChange) {
    this.user_added = event.checked;
  }

  endsWithNumber( str:any ){
    return isNaN(str.slice(-5)) ? false : true;
  }

  // ('^[0-9]{7}$')
  isValidId() {
    if (this.addProtexConfigForm.controls['protex_project_id'].value?.startsWith(this.prefix) &&
    this.endsWithNumber(this.addProtexConfigForm.controls['protex_project_id'].value!)) {
      return false;
    } else {
      return true;
    }
  }

  /**
 * Get all the availbale Protex Server from DB
 */
  getServer() {
    this.service.getServer("protex").subscribe(
      (response) => {
        this.scanServerList = response;
        this.createProtexServerDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  /**
   * Create dropdowm for Protex Server
   */
  createProtexServerDropdown() {
    this.scanServers = [];
    if (this.scanServerList != null) {
      for (var i = 0; i < this.scanServerList.length; i++) {
        this.scanServers.push({ value: this.scanServerList[i].server_name, viewValue: this.scanServerList[i].server_name });
      }
    }
  }

}
