import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FACELESS_USER } from 'src/app/home/home.constants';
import { Project } from 'src/app/home/home.models';
import { KW_LOWERCASE } from 'src/app/release/release.constants';
import { ReleaseService } from 'src/app/release/release.service';
import { Kw_Config, Scan_Server, ServerPort } from '../../datacollection.models';


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
  facelessUser = FACELESS_USER;
  constructor(private formBuilder: UntypedFormBuilder, public dialogRef: MatDialogRef<KwAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service:ReleaseService) { }

  ngOnInit(): void {
    this.getKwServer();
    // this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.addKwConfigForm = this.formBuilder.group({
      kw_server: [null, [Validators.required]],
      kw_project_name: [null, [Validators.required]],
      port: [null, [Validators.required]],
      user_added: [null, []],
    });
    if (this.data) {
      this.selectedKwConfig = this.data.data;
      this.addKwConfigForm.patchValue({
        kw_server: this.selectedKwConfig.kw_server,
        kw_project_name: this.selectedKwConfig.kw_project_name,
        port: this.selectedKwConfig.port,
        user_added: this.selectedKwConfig.user_added,
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
        this.selectedKwConfig.port = this.addKwConfigForm.controls['port'].value;
        this.selectedKwConfig.user_added = this.user_added;
        this.updatedKwCofig = this.selectedKwConfig;
      } else {
        this.newKwConfig = <Kw_Config>{};
        this.newKwConfig.kw_server = this.addKwConfigForm.controls['kw_server'].value;
        this.newKwConfig.kw_project_name = this.addKwConfigForm.controls['kw_project_name'].value;
        this.newKwConfig.port = this.addKwConfigForm.controls['port'].value;
        this.newKwConfig.user_added = this.user_added;
        // this.newKwConfig.project_id = this.selectedProject.project_id;
        this.updatedKwCofig = this.newKwConfig;
      }
  }

  
  /**
   * Get all the availbale KW Server from DB
   */
   getKwServer() {
    this.service.getServer(KW_LOWERCASE).subscribe(
      (response) => {
        this.scanServerList = response;
        this.createKwServerDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  serverPort!:ServerPort;
  serverPortList!:ServerPort[];
  /**
   * Create dropdowm for KW Server
   */
  createKwServerDropdown() {
    this.scanServers=[];
    this.serverPortList =[];
    if (this.scanServerList != null) {
      for (var i = 0; i < this.scanServerList.length; i++) {
        this.serverPort=<ServerPort>{};
        var str_array = this.scanServerList[i].server_name.split(':');
        this.serverPort.name=str_array[0];
        this.serverPort.port=str_array[1];
        if (this.serverPort.name.indexOf(".devtools.intel.com") > -1 ){
          this.serverPort.name = this.serverPort.name.replace(".devtools.intel.com", "");
        }
        if (this.serverPort.name.indexOf(".intel.com") > -1 ){
          this.serverPort.name = this.serverPort.name.replace(".intel.com", "");
        }
        if(!this.serverPortList.find(x => x.name === this.serverPort.name)){
          this.scanServers.push({ value: str_array[0], viewValue: this.scanServerList[i].region+" - "+this.serverPort.name });
        }
        this.serverPortList.push(this.serverPort);
      }
    }
  }

  user_added: boolean = false;
  checkUserAdded(event: MatCheckboxChange) {
    this.user_added = event.checked;
  }

  portList!:string[];
  selectedServerPort!:ServerPort[];
  selectPort(serverName: string) {
    if (serverName.indexOf(".devtools.intel.com") > -1 ){
      serverName = serverName.replace(".devtools.intel.com", "");
    }
    if (serverName.indexOf(".intel.com") > -1 ){
      serverName = serverName.replace(".intel.com", "");
    }
    alert(serverName);
    this.portList=[];
    this.selectedServerPort=this.serverPortList.filter(x => x.name === serverName);
    for (var i = 0; i < this.selectedServerPort.length; i++) {
      this.portList.push(this.selectedServerPort[i].port);
    }

    // alert(serverName);
  }
  

}
