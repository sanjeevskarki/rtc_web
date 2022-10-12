import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/home/home.models';
import { ReleaseService } from 'src/app/release/release.service';
import { Kw_Config, Scan_Server } from '../../datacollection.models';


@Component({
  selector: 'app-kw.add',
  templateUrl: './kw.add.component.html',
  styleUrls: ['./kw.add.component.scss']
})
export class KwAddComponent implements OnInit {

  addKwConfigForm!: UntypedFormGroup;
  selectedKwConfig!: Kw_Config;
  updatedKwCofig!: Kw_Config;
  selectedProject!: Project;
  newKwConfig!: Kw_Config;
  scanServerList!:Scan_Server[];
  scanServers!:any[];
  constructor(private formBuilder: UntypedFormBuilder, public dialogRef: MatDialogRef<KwAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service:ReleaseService) { }

  ngOnInit(): void {
    this.getKwServer();
    // this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
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

  /***
   * Close Add KE config Dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Save new KW Config 
   */
   saveKwConfig() {
    this.createNewKw();
    this.dialogRef.close({ data: this.updatedKwCofig });
  }


  /**
   * Create New KW Config object
   */
  createNewKw() {
    if (this.selectedKwConfig) {
        this.selectedKwConfig.kw_server = this.addKwConfigForm.controls['kw_server'].value;
        this.selectedKwConfig.kw_project_name = this.addKwConfigForm.controls['kw_project_name'].value;
        this.updatedKwCofig = this.selectedKwConfig;
      } else {
        this.newKwConfig = <Kw_Config>{};
        this.newKwConfig.kw_server = this.addKwConfigForm.controls['kw_server'].value;
        this.newKwConfig.kw_project_name = this.addKwConfigForm.controls['kw_project_name'].value;
        // this.newKwConfig.project_id = this.selectedProject.project_id;
        this.updatedKwCofig = this.newKwConfig;
      }
  }

  
  /**
   * Get all the availbale KW Server from DB
   */
   getKwServer() {
    this.service.getServer("kw").subscribe(
      (response) => {
        this.scanServerList = response;
        this.createKwServerDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  /**
   * Create dropdowm for KW Server
   */
  createKwServerDropdown() {
    this.scanServers=[];
    if (this.scanServerList != null) {
      for (var i = 0; i < this.scanServerList.length; i++) {
        this.scanServers.push({ value: this.scanServerList[i].server_name, viewValue: this.scanServerList[i].server_name });
      }
    }
  }
  

}
