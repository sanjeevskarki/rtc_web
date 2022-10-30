import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Project, Stakeholder } from 'src/app/home/home.models';
import { DELETE_LOWERCASE, SUCCESS_LOWERCASE, TABLE_HEADER_COLOR } from '../../release.constants';
import { Protex_Config } from '../datacollection.models';
import { ConfirmDeleteProtexDialogComponent } from './confirmdeleteprotexdialog/confirm.delete.protex.dialog.component';
import { ProtexAddComponent } from './protex.add/protex.add.component';
import { ProtexService } from './protex.service';

@Component({
  selector: 'app-protex',
  templateUrl: './protex.component.html',
  styleUrls: ['./protex.component.scss']
})
export class ProtexComponent implements OnInit {

  protexConfigList: Protex_Config[] = [];
  tempProtexConfigList: Protex_Config[] = [];
  protexDisplayedColumns = ['protex_server', 'protex_project_id', 'user_added','actions'];
  color = TABLE_HEADER_COLOR;
  protexConfig!: Protex_Config;
  selectedProject!: Project;
  newProtexConfig!: Protex_Config;
  existingProtexConfig!: Protex_Config;
  loading = false;
  constructor(public dialog: MatDialog, private service: ProtexService) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.getProtexConfig();
  }

  /**
   * Call Get API for getting Protex Config for provided ProjectId
   */
  getProtexConfig() {
    if(this.selectedProject){
      this.service.getProtexConfig(this.selectedProject.project_id!).subscribe(
        (response) => {
          this.protexConfigList = response;
          this.tempProtexConfigList = response;
        },
        (err) => {
          console.log(err.name);
        }
      );
    }else{
      this.protexConfigList = JSON.parse (localStorage.getItem('newProtexConfigList')!);
      this.tempProtexConfigList = this.protexConfigList ;
    }
  }

  /**
   * Open Add new Protex Config Dialog
   */
  openProtexConfig() {
    const dialogRef = this.dialog.open(ProtexAddComponent, {
      height: '40%',
      width: '30%',
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newProtexConfig = <Protex_Config>{};
        this.newProtexConfig = result.data;
        if (this.selectedProject) {
          this.newProtexConfig.project_id = this.selectedProject.project_id;
          this.service.addProtexConfig(this.newProtexConfig).subscribe(data => {
            this.tempProtexConfigList.unshift(data);
            this.createProtexConfigList(this.tempProtexConfigList);
          });
        }else{
          this.tempProtexConfigList!.unshift(this.newProtexConfig);
          this.createProtexConfigList(this.tempProtexConfigList);
          localStorage.setItem('newProtexConfigList', JSON.stringify(this.tempProtexConfigList));
        }
      }
    });
  }

  /**
   * Create Protex Config List
   * @param protexConfigList Protex Config List
   */
  createProtexConfigList(protexConfigList: Protex_Config[]) {
    this.protexConfigList = [];
    for (var protexConfig of protexConfigList) {
      this.protexConfigList.push(protexConfig);
    }
  }

  /**
   * Open Updated Protex Config Dialog
   * @param protexConfig Selected Protex Config
   */
  updateProtexConfig(protexConfig: Protex_Config) {
    const dialogRef = this.dialog.open(ProtexAddComponent, {
      height: '40%',
      width: '30%',
      disableClose: true,
      data: {
        data: protexConfig
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newProtexConfig = <Protex_Config>{};
        this.newProtexConfig = result.data;
        this.existingProtexConfig = this.tempProtexConfigList.find(x => x.id == this.newProtexConfig.id)!;
        // if(JSON.stringify(this.existingStakeholder) !== JSON.stringify(this.newStakeholder)){
        const index = this.tempProtexConfigList.indexOf(this.existingProtexConfig, 0);
        if (index > -1) {
          this.service.updateProtexConfig(this.newProtexConfig).subscribe(data => {
            this.tempProtexConfigList.splice(index, 1);
            this.tempProtexConfigList.unshift(data);
            this.createProtexConfigList(this.tempProtexConfigList);
          })
        }
      }
    });
  }

  /**
   * Delete Selected Protex Config object
   * @param protexConfig Selected Protex Config
   */
  deleteProtexConfig(protexConfig: Protex_Config) {
    this.loading = true;
    const deleteProtexDialogRef = this.dialog.open(ConfirmDeleteProtexDialogComponent, {
      height: '18%',
      width: '23%',
      disableClose: true,
      data: { name: protexConfig.protex_server }
    });

    deleteProtexDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === DELETE_LOWERCASE) {
          this.service.deleteProtexConfig(protexConfig).subscribe(data => {
            if (data.message === SUCCESS_LOWERCASE) {
              const index = this.tempProtexConfigList.indexOf(protexConfig, 0);
              this.loading = false;
              if (index > -1) {
                this.tempProtexConfigList.splice(index, 1);
                this.createProtexConfigList(this.tempProtexConfigList);
              }
            }
          });
        }
      }
    });
  }

}
