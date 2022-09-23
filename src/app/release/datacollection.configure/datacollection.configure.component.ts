import { Component, OnInit } from '@angular/core';
import { Stakeholder } from 'src/app/home/home.models';

@Component({
  selector: 'app-datacollection.configure',
  templateUrl: './datacollection.configure.component.html',
  styleUrls: ['./datacollection.configure.component.scss']
})
export class DatacollectionConfigureComponent implements OnInit {

  stakeholders:Stakeholder[]=[];
  stakeholderDisplayedColumns = ['name', 'email', 'wwid', 'role', 'actions'];
  color = '#f1f3f4';
  constructor() { }

  ngOnInit(): void {
  }

  addProtexScan(){

  }

  updateProtexScan(data:any){

  }

  deleteStakeholder(data:any){

  }

}
