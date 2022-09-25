import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project, Stakeholder } from 'src/app/home/home.models';
import { Bdba_Config } from '../datacollection.models';
import { BdbaAddComponent } from './bdba.add/bdba.add.component';
import { BdbaService } from './bdba.service';
import { ConfirmDeleteBdbaDialogComponent } from './confirmdeletebdbadialog/confirm.delete.bdba.dialog.component';

@Component({
  selector: 'app-bdba',
  templateUrl: './bdba.component.html',
  styleUrls: ['./bdba.component.scss']
})
export class BdbaComponent implements OnInit {

  bdbaDisplayedColumns = ['product_id', 'product_name', 'actions'];
  color = '#f1f3f4';
  newBdbaConfig!: Bdba_Config;
  tempBdbaConfigList: Bdba_Config[] = [];
  bdbaConfigList: Bdba_Config[] = [];
  existingBdbaConfig!: Bdba_Config;
  selectedProject!: Project;
  constructor(public dialog: MatDialog, private service: BdbaService) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.getBdbaConfig();
  }

  getBdbaConfig() {
    this.service.getBdbaConfig(this.selectedProject.project_id).subscribe(
      (response) => {
        this.bdbaConfigList = response;
        this.tempBdbaConfigList = response;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  openBdbaConfig() {
    const dialogRef = this.dialog.open(BdbaAddComponent, {
      height: '30%',
      width: '30%',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newBdbaConfig = <Bdba_Config>{};
        this.newBdbaConfig = result.data;
        this.service.addBdbaConfig(this.newBdbaConfig).subscribe(data => {
          this.tempBdbaConfigList.unshift(data);
          this.createBdbaConfigList(this.tempBdbaConfigList);
        })
      }
    });

  }

  createBdbaConfigList(bdbaConfigList: Bdba_Config[]) {
    this.bdbaConfigList = [];
    for (var bdbaConfig of bdbaConfigList) {
      this.bdbaConfigList.push(bdbaConfig);
    }
  }

  updateBdbaConfig(bdbaConfig: Bdba_Config) {
    const dialogRef = this.dialog.open(BdbaAddComponent, {
      height: '30%',
      width: '30%',
      data: {
        data: bdbaConfig
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newBdbaConfig = <Bdba_Config>{};
        this.newBdbaConfig = result.data;
        this.existingBdbaConfig = this.tempBdbaConfigList.find(x => x.id == this.newBdbaConfig.id)!;
        // if(JSON.stringify(this.existingStakeholder) !== JSON.stringify(this.newStakeholder)){
        const index = this.tempBdbaConfigList.indexOf(this.existingBdbaConfig, 0);
        if (index > -1) {
          this.service.updateBdbaConfig(this.newBdbaConfig).subscribe(data => {
            this.tempBdbaConfigList.splice(index, 1);
            this.tempBdbaConfigList.unshift(data);
            this.createBdbaConfigList(this.tempBdbaConfigList);
          })
        }
      }
    });
  }

  deleteBdbaConfig(bdbaConfig: Bdba_Config) {
    const deleteBdbaDialogRef = this.dialog.open(ConfirmDeleteBdbaDialogComponent, {
      height: '18%',
      width: '23%',
      data: { name: bdbaConfig.product_name }
    });

    deleteBdbaDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'delete') {
          this.service.deleteBdbaConfig(bdbaConfig).subscribe(data => {
            if (data.message === 'success') {
              const index = this.tempBdbaConfigList.indexOf(bdbaConfig, 0);
              // alert(index)
              if (index > -1) {
                this.tempBdbaConfigList.splice(index, 1);
                this.createBdbaConfigList(this.tempBdbaConfigList);
              }
            }
          });
        }
      }
    });
  }

}
