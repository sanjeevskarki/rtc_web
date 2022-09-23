import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Bkc, Project } from '../home.models';
import { BkcAddComponent } from './bkc.add/bkc.add.component';
import { BkcService } from './bkc.service';
import { ConfirmDeleteBkcDialogComponent } from './confirmdeletebkcdialog/confirm.delete.bkc.dialog.component';

@Component({
  selector: 'app-bkc',
  templateUrl: './bkc.component.html',
  styleUrls: ['./bkc.component.scss']
})
export class BkcComponent implements OnInit {

  bkcList:Bkc[]=[];
  stakeholderDisplayedColumns = ['seq','title', 'version', 'last_updated', 'comment', 'actions'];
  color = '#f1f3f4';
  newBkc! :Bkc;
  existingBkcList!:Bkc[];
  selectedProject!: Project;
  tempBkcList!:Bkc[];
  existingBkc!:Bkc;
  constructor(public dialog: MatDialog,private service:BkcService) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
    this.getExistingBkc();
  }

  getExistingBkc(){
    this.existingBkcList =[];
    this.service.getBkcList(this.selectedProject.project_id).subscribe(
      (response) => {
        this.existingBkcList = response;
        this.tempBkcList = response;
        this.createBkcList(this.existingBkcList);
        // this.bkcList = this.existingBkcList;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  openBkc(){
    const dialogRef = this.dialog.open(BkcAddComponent, {
      height: '50%',
      width: '30%',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        this.newBkc = <Bkc>{};
        this.newBkc = result.data;
        this.newBkc.project_id=this.selectedProject.project_id;
        this.existingBkcList.unshift(this.newBkc);
        
        this.createBkcList(this.existingBkcList);
        // this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
        if(this.selectedProject){
          this.saveBkc();
        }
       
      }
    });
  }

  createBkcList(existingBkcList:Bkc[]){
    this.bkcList=[];
    var count:number =1;
    for (var bkc of existingBkcList) {
      bkc.seq = count;
      this.bkcList.push(bkc);
      count++;
    }
  }

  saveBkc(){
      this.service.addBkc(this.newBkc).subscribe(data => {
      });
    
  }

  
  editBkc(bkc: Bkc){
    const dialogRef = this.dialog.open(BkcAddComponent, {
      height: '50%',
      width: '30%',
      data: {
        data: bkc
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.newBkc = <Bkc>{};
        this.newBkc = result.data;
        this.existingBkc = this.bkcList.find(x => x.id == this.newBkc.id)!;
        const index = this.bkcList.indexOf(this.existingBkc, 0);
        if (index > -1) {
          this.service.updateBkc(this.newBkc).subscribe(data => {
              this.existingBkcList.splice(index, 1);
              this.existingBkcList.unshift(this.newBkc);
              this.createBkcList(this.existingBkcList);
            })
        }       
      }
    });
  }

  updateBkc(){
    this.service.updateBkc(this.newBkc).subscribe(data => {
    });
  
}
  deleteBkc(bkc: Bkc){
    const dialogRef = this.dialog.open(ConfirmDeleteBkcDialogComponent, {
      height: '18%',
      width: '15%',
      data: { name: bkc.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.data === 'delete'){
          this.service.deleteBkc(bkc).subscribe(data => {
            if(data.message === 'success'){
              const index = this.existingBkcList.indexOf(bkc, 0);
              // alert(index)
              if (index > -1) {
                this.existingBkcList.splice(index, 1);
                this.createBkcList(this.existingBkcList);
              }
            }
          });
        }
      }
    });
  }
}
