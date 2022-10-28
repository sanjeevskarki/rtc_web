import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Stakeholder } from 'src/app/home/home.models';
import { Roles } from '../release.models';
import { ReleaseStakeholderService } from './release.stakeholder.service';

@Component({
  selector: 'app-release.stakeholder',
  templateUrl: './release.stakeholder.component.html',
  styleUrls: ['./release.stakeholder.component.scss']
})
export class ReleaseStakeholderComponent implements OnInit {

  addStakeholderForm!: UntypedFormGroup;
  newStakeholder!:Stakeholder;
  selectedStakeholder!:Stakeholder;
  filteredOptions!: Observable<string[]>;
  stakeholderHeader!:string;
  // roles: string[] = [
  //   'Attorney',
  //   'Development Lead', 
  //   'Marketing',
  //   'Product Architect',
  //   'Product Security Expert', 
  //   'Program Manager',
  //   'Project Manager',
  //   'Security Champion',
  //   'Security & Privacy Lead',
  //   'Security Lead',
  //   'System Architect', 
  //   'Validation Lead',
  //   'Other'
  // ];
  constructor(private formBuilder: UntypedFormBuilder,public dialogRef: MatDialogRef<ReleaseStakeholderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private service: ReleaseStakeholderService) { }

  ngOnInit(): void {
    this.getRoles();
    this.stakeholderHeader='Add Stakeholder';
    this.addStakeholderForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      wwid: [null, []],
      role: [null, Validators.required]
    });
    if (this.data) {
      this.stakeholderHeader='Update Stakeholder';
      this.selectedStakeholder = this.data.data;
      this.addStakeholderForm.patchValue({
        name: this.selectedStakeholder.name,
        email: this.selectedStakeholder.email,
        wwid: this.selectedStakeholder.wwid,
        role: this.selectedStakeholder.role,
        email_notification: this.selectedStakeholder.email_notification,
      });
    }
   
  }

  roleList!:Roles[];
  roles!:string[];
  getRoles() {
    this.service.getRoles().subscribe(
      (response) => {
        this.roleList = response;
        this.createRolesDropdown();
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  createRolesDropdown() {
    this.roles =[];
    if (this.roleList != null) {
      for (var i = 0; i < this.roleList.length; i++) {
        this.roles.push(this.roleList[i].name);
      }
    }
    this.filteredOptions = this.addStakeholderForm.controls['role'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value!)),
    );
  }

  /**
   * Close the Add Stakeholder Dialog
   */
  close(){
    this.dialogRef.close();
  }
  
  /**
   * Save Stakeholder
   */
  saveStakeholder() {
    this.createNewStakeholder();
    this.dialogRef.close({ data: this.updatedStakeholder });
  }

  updatedStakeholder!:Stakeholder;
  /**
   * Create New Stakeholder object
   */
  createNewStakeholder(){
    let emailNotification:boolean=true;

    if(this.addStakeholderForm.controls['role'].value === 'Attorney'){
      emailNotification = false;
    }

    if (this.selectedStakeholder) {
      this.selectedStakeholder.name = this.addStakeholderForm.controls['name'].value;
      this.selectedStakeholder.email = this.addStakeholderForm.controls['email'].value;
      this.selectedStakeholder.wwid = this.addStakeholderForm.controls['wwid'].value;
      this.selectedStakeholder.role = this.addStakeholderForm.controls['role'].value;
      this.selectedStakeholder.email_notification = this.selectedStakeholder.email_notification!;;
      this.updatedStakeholder = this.selectedStakeholder;
    } else {
      this.newStakeholder = <Stakeholder>{};
      this.newStakeholder.name = this.addStakeholderForm.controls['name'].value;
      this.newStakeholder.email = this.addStakeholderForm.controls['email'].value;
      this.newStakeholder.wwid = this.addStakeholderForm.controls['wwid'].value;
      this.newStakeholder.role = this.addStakeholderForm.controls['role'].value;
      this.newStakeholder.email_notification = emailNotification;
      this.updatedStakeholder = this.newStakeholder;
    }
    
    // const newStakeholder: Stakeholder = {
    //   // id: tempid,
    //   name: this.addStakeholderForm.controls['name'].value,
    //   email: this.addStakeholderForm.controls['email'].value,
    //   wwid: this.addStakeholderForm.controls['wwid'].value,
    //   role: this.addStakeholderForm.controls['role'].value,
    //   email_notification: emailNotification,
    // };
    // this.newStakeholder = newStakeholder;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter(option => option.toLowerCase().includes(filterValue));
  }

  trackByFn(index:any, item:any) {    
    return item.id; // unique id corresponding to the item
  }

}
