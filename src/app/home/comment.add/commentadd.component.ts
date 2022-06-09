import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RemovingEventArgs, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { v4 as uuidv4 } from 'uuid';
import { Comments, Files, ReleaseChecklist } from '../home.models';

@Component({
  selector: 'commentadd',
  templateUrl: './commentadd.component.html',
  styleUrls: ['./commentadd.component.scss']
})
export class CommentAddComponent implements OnInit {

  public addCommentHeader!: string;
  commentForm!: FormGroup;
  files:Files[]=[];
  file!:Files;
  @ViewChild('addCommentDialog')
  public addCommentDialog!: DialogComponent;
  public target1: string = '#modalTarget';
  public target2: string = '#addCommentDialog';
  public toastPosition: ToastPositionModel = { X: 'Right' };
  public uploadCommentInput: string = '';
  public visible: boolean = false;
  public multiple: boolean = false;
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  public position: object={ X: 'center', Y: 'center' };
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public width: string = '51%';

  public isModal: Boolean = true;
  public hidden: Boolean = false;

  // @ViewChild('upload')
  // public uploadObj!: UploaderComponent;

  public tools: ToolbarModule = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize','|',
        'Formats', 'NumberFormatList', 'BulletFormatList','|',
        'CreateLink']
  };

  newComment!:Comments;
  selectedRelease!:ReleaseChecklist;
  
  @ViewChild('toasttype')
  private toastObj!: ToastComponent;
  @Output() childEvent = new EventEmitter<any>();

  public toasts: { [key: string]: Object }[] = [
    { title: 'Success!', content: 'Comment Added Successfully', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  ];
  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
  };
  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;

  @ViewChild('defaultupload')
  public uploadObj!: UploaderComponent;

  constructor() { }

  ngOnInit(): void {
    this.addCommentHeader = "Add Comment";
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, Validators.required),
      'upload': new FormControl(null, [])
    });
  }

  commentDialogClose(){
    this.commentForm.reset();
    this.uploadObj.clearAll();
  }

  public onCreate(): void {
    setTimeout(function () {
    }.bind(this), 200);
  }

  public onFileSelected() {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click(); return false;
  }

  public onFileSelect: EmitType<Object> = (args: any) => {
    this.uploadCommentInput = args.filesData[0].name;
    this.file=<Files>{};
    this.file.id = args.filesData[0].id;
    this.file.name = args.filesData[0].name;
    this.files.push(this.file);
    
  }

  addComment(){
    this.addCommentDialog.show();
  }

  closeComment(){
    this.addCommentDialog.hide();
  }

  public Submit(): void {
    this.createNewComment();
    this.childEvent.emit(this.newComment);
    this.toastObj.show(this.toasts[0]);
    this.addCommentDialog.hide();
  }
 
  createNewComment() {
    alert(this.files.length);
    const newComments: Comments = {
      id:uuidv4(),
      message: this.commentForm.controls['comment'].value,
      date: new Date().getTime(),
      file: this.files 
    };
    this.newComment = newComments;
  }

  public onFileRemove(args: RemovingEventArgs): void {
    this.files = this.files.filter(item => item.id !== args.filesData[0].id);
    args.postRawFile = false;
  }

}
