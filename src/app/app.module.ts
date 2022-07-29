import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { WorkWeekPipePipe } from './home/work-week-pipe.pipe';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { SidebarModule, MenuAllModule, TreeViewAllModule, ToolbarAllModule} from '@syncfusion/ej2-angular-navigations';
import { ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule, SplitButtonModule, ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ReportComponent } from './report/report.component';
import { ChecklistComponent } from './home/checklist/checklist.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { TextBoxModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { InPlaceEditorModule } from '@syncfusion/ej2-angular-inplace-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { EvidenceAddComponent } from './home/evidence.add/evidenceadd.component';
import { ReleaseComponent } from './release/release.new/release.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ProgressBarAllModule } from '@syncfusion/ej2-angular-progressbar';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { CommentAddComponent } from './home/comment.add/commentadd.component';
import { ChecklistMenuComponent } from './home/checklist.menu/checklist.menu.component';
import { ReleaseEditComponent } from './release/release.edit/release.edit.component';
import { BkcComponent } from './home/bkc/bkc.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    WorkWeekPipePipe,
    ReportComponent,
    ChecklistComponent,
    AdminComponent,
    HelpComponent,
    EvidenceAddComponent,
    ReleaseComponent,
    CommentAddComponent,
    ChecklistMenuComponent,
    ReleaseEditComponent,
    BkcComponent
  ],
  imports: [
    HttpClientModule, BrowserModule, AppRoutingModule, ToolbarModule, DatePickerModule, TooltipModule,
    ListViewAllModule,SidebarModule, MenuAllModule, TreeViewAllModule, ToolbarAllModule, GridModule,
    ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, DropDownButtonModule, SplitButtonModule, 
    ProgressButtonModule, DialogModule, TextBoxModule, NumericTextBoxModule, RichTextEditorAllModule,
    FormsModule, ReactiveFormsModule, UploaderModule, ToastModule, DropDownListModule, CalendarModule, ProgressBarAllModule,InPlaceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
