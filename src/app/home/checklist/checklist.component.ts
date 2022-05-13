import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridLine, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { Checklist, Comments, ReleaseChecklist, ViewComment } from '../home.models';
import { ChecklistService } from './checklist.service';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import * as moment from 'moment';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, FileManagerService, FileManagerSettingsModel, ToolbarSettingsModel, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RemovingEventArgs, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
export type Status = 'Done' | 'WIP'| 'N/A' | 'Open';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers:[ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, FileManagerService]
})
export class ChecklistComponent implements OnInit {

  checkList:Checklist[]=[];
  releaseChecklist : ReleaseChecklist[]| undefined =[];

  @ViewChild('commentDialog')
  public commentDialog!: DialogComponent;

  @ViewChild('addCommentDialog')
  public addCommentDialog!: DialogComponent;

  public target: string = '#modalTarget';
  public target1: string = '#commentDialog';
  public width: string = '750px';
  public width1: string = '660px';
  public height: string = '250px';
  public header!: string;
  public addHeader!: string;
  public isModal: Boolean = true;
  public showCloseIcon: Boolean = true;
  public hidden: Boolean = false;
  public position: object={ X: 'center', Y: 'center' };
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
 
  public lines!:GridLine;
  initialPage!:Object;
  public filter!: Object;
  id!: string| null;
  releaseName!: string| null;
  milestone!: string| null;
  comments:Comments[]=[];
  viewComments:ViewComment[]=[];
  displayComments:ViewComment[]=[];
  viewComment!:ViewComment;
  public cssClass: string = 'e-list-template';

  rteForm!: FormGroup;

  @ViewChild('fromRTE')
  private rteEle!: RichTextEditorComponent;
  @ViewChild('toolsRTE')
  public rteObj!: RichTextEditorComponent;

  public textArea!: HTMLElement;

  @ViewChild('dropdownbutton') element:any;

  public tools: ToolbarModule = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize','|',
        'Formats', 'NumberFormatList', 'BulletFormatList','|',
        'CreateLink', 'image']
  };
  
  constructor(private route: ActivatedRoute,private service:ChecklistService) { 
    
  } 

  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;
  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
  };
  @ViewChild('defaultupload')
  public uploadObj!: UploaderComponent;
  public onFileRemove(args: RemovingEventArgs): void {
    args.postRawFile = false;
  }
  hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  fileManagerSettings: FileManagerSettingsModel = {
    enable: true,
    path: '/Pictures/Food',
    ajaxSettings: {
      url: this.hostUrl + 'api/FileManager/FileOperations',
      getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
      uploadUrl: this.hostUrl + 'api/FileManager/Upload',
      downloadUrl: this.hostUrl + 'api/FileManager/Download'
    }
  };

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
    this.rteForm = new FormGroup({
      'name': new FormControl(null, Validators.required)
    });
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.releaseName = this.route.snapshot.queryParamMap.get('name');
    this.milestone = this.route.snapshot.queryParamMap.get('milestone');
    
    this.lines='Both';
    this.initialPage = {pageSize:9};
    this.filter = { type: "CheckBox" }; 
    this.getCheckList();
  }

  rteCreated(): void {
    this.rteEle.element.focus();
  }

  onSubmit(): void {
    alert(new Date().getTime());
    alert('Form submitted successfully' + this.rteForm.controls['name'].value);
    var data = { html: this.rteForm.controls['name'].value };
    var json = JSON.stringify(data);
    alert('json = ' + json);
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
    let rcList : ReleaseChecklist |undefined= <ReleaseChecklist> args.data;
      if (rcList?.status === "Done") { 
        args.cell!.classList.add('doneBackgroundColor'); 
      } 
      else if (rcList?.status === "N/A") { 
        args.cell!.classList.add('naBackgroundColor'); 
      } 
      else if (rcList?.status === "Open") { 
        args.cell!.classList.add('openBackgroundColor'); 
      } 
      else { 
        args.cell!.classList.add('wipBackgroundColor'); 
      } 
  } 

  clicked(headerLabel: string, releaseChecklist: ReleaseChecklist) { 
    this.displayComments,this.comments,this.viewComments=[];
    this.header = headerLabel + " Comments";
    this.comments = releaseChecklist.comments;

    for(var comment of this.comments){
      this.viewComment = <ViewComment>{};
      const duration = Math.min(comment.date - new Date().getTime(), 0);
      this.viewComment.message=comment.message;
      this.viewComment.date = moment(comment.date).format('LLL');
      // this.viewComment.date = this.service.getNiceTime(duration);
      this.viewComments.push(this.viewComment);
    }
    this.displayComments = this.viewComments;
    this.commentDialog.show();    
  } 

  openCommentDialog(){
    this.addHeader = "Add Comment";
    this.addCommentDialog.show();   
  }

  saveRelease(){
    alert('Save Changes');
  }

}

