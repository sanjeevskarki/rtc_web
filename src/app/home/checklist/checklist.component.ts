import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridLine, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { Checklist, ReleaseChecklist } from '../home.models';
import { ChecklistService } from './checklist.service';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';

export type Status = 'Done' | 'WIP'| 'N/A' | 'Open' | 'TBD';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  checkList:Checklist[]=[];
  releaseChecklist : ReleaseChecklist[]| undefined =[];

  @ViewChild('modalDialog')
  public modalDialog!: DialogComponent;

  public target: string = '#modalTarget';
  public width: string = '335px';
  public header: string = 'Software Update';
  public content: string = 'Your current software version is up to date.';
  public isModal: Boolean = true;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
 
  public lines!:GridLine;
  initialPage!:Object;
  public filter!: Object;
  id!: string| null;
  
  @ViewChild('dropdownbutton') element:any;
  
  constructor(private route: ActivatedRoute,private service:ChecklistService) { }
  public items: ItemModel[] = [
    {
      text: 'Done',
    },
    {
      text: 'N/A',  
    },
    {
        text: 'Open',
    },
    {
        text: 'WIP',  
    }
  ];
  

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lines='Both';
    this.initialPage = {pageSize:9};
    this.filter = { type: "CheckBox" }; 
    this.getCheckList();
  }

  getCheckList(){
    this.service.checkList().subscribe(
      (response) => {
        this.checkList = response;
        this.releaseChecklist = this.checkList.find(x => x.id == this.id)?.releaseChecklist;
      },
      (err) => {
        console.log(err.name);
      }
    );
  }

  onClick (id:string|null,vector:string,args: MenuEventArgs) {
    var newStatus:string|undefined = args.item.text;

    const objIndex = this.releaseChecklist!.findIndex((obj => obj.vector == vector));
    var newCheckList: ReleaseChecklist |undefined = this.releaseChecklist![objIndex];
    this.releaseChecklist = this.releaseChecklist!.filter(val=>val.vector!==vector);
    
    newCheckList.status = newStatus;
    this.releaseChecklist?.push(newCheckList);

  }
  customiseCell(args: QueryCellInfoEventArgs) { 
    // if (args.column!.field === 'Status') { 
      let rcList : ReleaseChecklist |undefined= <ReleaseChecklist> args.data;
        if (rcList?.status === "Done") { 
            args.cell!.classList.add('doneBackgroundColor'); 
        } else if (rcList?.status === "N/A") { 
            args.cell!.classList.add('naBackgroundColor'); 
        } 
        else if (rcList?.status === "Open") { 
            args.cell!.classList.add('openBackgroundColor'); 
        } 
        else { 
            args.cell!.classList.add('wipBackgroundColor'); 
        } 
    // }
  } 

  clicked(e: any, test: any[]){ 
    alert(e);
    alert(test.length); 
    this.header = e+ "Comments"
    this.modalDialog.show();
      // this.dialog.open(SystemErrorComponent, {
      //   restoreFocus: false,
      //   width: '37.5rem',
      //   data: { errorHeader },
      // });
    
   } 

   public modalDlgClose = (): void => {
    // this.modalButton.element.style.display = '';
  }
  // On Dialog open, 'Open' Button will be hidden
  public modalDlgOpen = (): void => {
      // this.modalButton.element.style.display = 'none';
  }


}

