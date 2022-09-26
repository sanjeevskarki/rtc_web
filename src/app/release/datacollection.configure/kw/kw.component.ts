import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from 'src/app/home/home.models';
import { DELETE_LOWERCASE, SUCCESS_LOWERCASE, TABLE_HEADER_COLOR } from '../../release.constants';
import { Kw_Config } from '../datacollection.models';
import { ConfirmDeleteKwDialogComponent } from './confirmdeletekwdialog/confirm.delete.kw.dialog.component';
import { KwAddComponent } from './kw.add/kw.add.component';
import { KwService } from './kw.service';

@Component({
  selector: 'app-kw',
  templateUrl: './kw.component.html',
  styleUrls: ['./kw.component.scss']
})
export class KwComponent implements OnInit {

  kwDisplayedColumns = ['kw_server', 'kw_project_name', 'actions'];
  color = TABLE_HEADER_COLOR;
  newKwConfig!: Kw_Config;
  tempKwConfigList: Kw_Config[] = [];
  kwConfigList: Kw_Config[] = [];
  selectedProject!: Project;

  existingKwConfig!: Kw_Config;
  constructor(public dialog: MatDialog, private service: KwService) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.getProtexConfig();
  }

  /**
   * Call API for Getting Protex Config
   */
  getProtexConfig() {
    this.service.getKwConfig(this.selectedProject.project_id).subscribe(
      (response) => {
        this.kwConfigList = response;
        this.tempKwConfigList = response;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  /**
   * Oooopen Add KW Config Dialog
   */
  openKwConfig() {
    const dialogRef = this.dialog.open(KwAddComponent, {
      height: '30%',
      width: '30%',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newKwConfig = <Kw_Config>{};
        this.newKwConfig = result.data;
        this.service.addKwConfig(this.newKwConfig).subscribe(data => {
          this.tempKwConfigList.unshift(data);
          this.createKwConfigList(this.tempKwConfigList);
        })
      }
    });

  }

  /**
   * Create KW Config Object List
   * @param kwConfigList KW Config Object Lilst
   */
  createKwConfigList(kwConfigList: Kw_Config[]) {
    this.kwConfigList = [];
    for (var protexConfig of kwConfigList) {
      this.kwConfigList.push(protexConfig);
    }
  }

  /**
   * Open Update KW Config Dialog
   * @param kwConfig Selected KW Config Object
   */
  updateKwConfig(kwConfig: Kw_Config) {
    const dialogRef = this.dialog.open(KwAddComponent, {
      height: '30%',
      width: '30%',
      data: {
        data: kwConfig
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newKwConfig = <Kw_Config>{};
        this.newKwConfig = result.data;
        this.existingKwConfig = this.tempKwConfigList.find(x => x.id == this.newKwConfig.id)!;
        const index = this.tempKwConfigList.indexOf(this.existingKwConfig, 0);
        if (index > -1) {
          this.service.updateKwConfig(this.newKwConfig).subscribe(data => {
            this.tempKwConfigList.splice(index, 1);
            this.tempKwConfigList.unshift(data);
            this.createKwConfigList(this.tempKwConfigList);
          })
        }
      }
    });
  }

  /**
   * Delete Selected KW Config Object
   * @param kwConfig Selected KW  config Object
   */
  deleteKwConfig(kwConfig: Kw_Config) {
    const deleteProtexDialogRef = this.dialog.open(ConfirmDeleteKwDialogComponent, {
      height: '18%',
      width: '23%',
      data: { name: kwConfig.kw_project_name }
    });

    deleteProtexDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === DELETE_LOWERCASE) {
          this.service.deleteKwConfig(kwConfig).subscribe(data => {
            if (data.message === SUCCESS_LOWERCASE) {
              const index = this.tempKwConfigList.indexOf(kwConfig, 0);
              // alert(index)
              if (index > -1) {
                this.tempKwConfigList.splice(index, 1);
                this.createKwConfigList(this.tempKwConfigList);
              }
            }
          });
        }
      }
    });
  }
}
