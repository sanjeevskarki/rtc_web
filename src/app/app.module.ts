import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
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
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    ReportComponent,
    ChecklistComponent,
    AdminComponent,
    HelpComponent,
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ToolbarModule,
    ListViewAllModule,SidebarModule, MenuAllModule, TreeViewAllModule, ToolbarAllModule, GridModule,
    ButtonModule, CheckBoxModule, RadioButtonModule, SwitchModule, DropDownButtonModule, SplitButtonModule, 
    ProgressButtonModule, DialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
