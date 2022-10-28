import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatListOptionCheckboxPosition, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Platform } from '../home/home.models';
import { NAME_LOWERCASE } from '../release/release.constants';
import { PlatfromService } from './platform.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit {

  addPlatformForm!: UntypedFormGroup;
  constructor(private service:PlatfromService,private formBuilder: UntypedFormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPlatform();
    this.addPlatformForm = this.formBuilder.group({
      name: [null, Validators.required]
    });

  }

  platformList!: any[];
  getPlatform() {
    this.service.getPlatform().subscribe(
      (response) => {
        this.platformList = response;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  trackByFn(index:any, item:any) {    
    return item.id; // unique id corresponding to the item
  }

  addPlatformRef!:any;
  addPlatformDialogRef: any;
  openPlatformDialog(taskDialog:any){
    this.addPlatformRef = taskDialog;
    
    this.addPlatformDialogRef = this.dialog.open(this.addPlatformRef, {
      height: '30%',
      width: '25%',
      disableClose: true
    });
   
    
  }

  closeAddPlatformDialog(){
    this.addPlatformDialogRef.close();
  }

  platform!:Platform;
  savePlatform(){
    this.platform=<Platform>{};
    this.platform.name=this.addPlatformForm.controls[NAME_LOWERCASE].value;
    this.service.createPlatform(this.platform).subscribe(
      (response) => {
        // this.getPlatform();
        this.platformList.unshift(this.platform);
        this.addPlatformDialogRef.close();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }
  
  selectedOptions=[];
  onNgModelChange(event: any) {
    // this.selectedOption=$event;
    // this.stakeholderNotificationList.find(x => x.value == item.value).checked = event.checked;
  }

}
