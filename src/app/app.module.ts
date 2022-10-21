import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { WorkWeekPipePipe, DateTimeFormatPipe, ReplaceDevtoolString, ReplaceIntelString } from './home/work-week-pipe.pipe';
import { ReportComponent } from './report/report.component';
import { ChecklistComponent } from './home/checklist/checklist.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvidenceAddComponent } from './home/evidence.add/evidenceadd.component';
import { ReleaseComponent } from './release/release.component';
import { ChecklistMenuComponent } from './home/checklist.menu/checklist.menu.component';
import { ReleaseEditComponent } from './release/release.edit/release.edit.component';
import { NotificationComponent } from './home/notification/notification.component';
import { BkcComponent } from './home/bkc/bkc.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDeleteStakeholderDialogComponent } from './release/confirmdeletestakeholderdialog/confirm.delete.stakeholder.dialog.component';
import { ReleaseConfirmDialogComponent } from './release/releaseconfirmdialog/release.confirm.dialog.component';
import { ReleaseStakeholderComponent } from './release/release.stakeholder/release.stakeholder.component';
import { BkcAddComponent } from './home/bkc/bkc.add/bkc.add.component';
import { ConfirmDeleteBkcDialogComponent } from './home/bkc/confirmdeletebkcdialog/confirm.delete.bkc.dialog.component';
import { DatacollectionConfigureComponent } from './release/datacollection.configure/datacollection.configure.component';
import { ProtexComponent } from './release/datacollection.configure/protex/protex.component';
import { BdbaComponent } from './release/datacollection.configure/bdba/bdba.component';
import { KwComponent } from './release/datacollection.configure/kw/kw.component';
import { ProtexAddComponent } from './release/datacollection.configure/protex/protex.add/protex.add.component';
import { KwAddComponent } from './release/datacollection.configure/kw/kw.add/kw.add.component';
import { BdbaAddComponent } from './release/datacollection.configure/bdba/bdba.add/bdba.add.component';
import { ConfirmDeleteProtexDialogComponent } from './release/datacollection.configure/protex/confirmdeleteprotexdialog/confirm.delete.protex.dialog.component';
import { ConfirmDeleteBdbaDialogComponent } from './release/datacollection.configure/bdba/confirmdeletebdbadialog/confirm.delete.bdba.dialog.component';
import { ConfirmDeleteKwDialogComponent } from './release/datacollection.configure/kw/confirmdeletekwdialog/confirm.delete.kw.dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DownloadingstatusComponent } from './downloadingstatus/downloadingstatus.component';
import { ConfirmReleaseStatusComponent } from './release/confirm.release.status/confirm.release.status.component';
import { ConfirmUploadFileComponent } from './home/checklist/confirm.upload.file/confirm.upload.file.component';
import { LoginComponent } from './account/login.component';
import { NgxEditorModule } from "ngx-editor";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PlatformComponent } from './platform/platform.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    WorkWeekPipePipe,
    DateTimeFormatPipe,
    ReplaceDevtoolString, 
    ReplaceIntelString,
    ReportComponent,
    ChecklistComponent,
    AdminComponent,
    HelpComponent,
    EvidenceAddComponent,
    ReleaseComponent,
    ChecklistMenuComponent,
    ReleaseEditComponent,
    BkcComponent,
    ConfirmDeleteStakeholderDialogComponent,
    ReleaseConfirmDialogComponent,
    ReleaseStakeholderComponent,
    NotificationComponent,
    BkcAddComponent,
    ConfirmDeleteBkcDialogComponent,
    DatacollectionConfigureComponent,
    ProtexComponent,
    BdbaComponent,
    KwComponent,
    ProtexAddComponent,
    KwAddComponent,
    BdbaAddComponent,
    ConfirmDeleteProtexDialogComponent,
    ConfirmDeleteBdbaDialogComponent,
    ConfirmDeleteKwDialogComponent,
    DownloadingstatusComponent,
    ConfirmReleaseStatusComponent,
    ConfirmUploadFileComponent,
    LoginComponent,
    PlatformComponent
  ],
  imports: [
    HttpClientModule, BrowserModule, AppRoutingModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule,
    MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule,
    MatButtonModule, MatTableModule, MatDialogModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule,
    MatSelectModule, MatGridListModule, MatDatepickerModule, MatNativeDateModule,
    MatRippleModule, MatProgressSpinnerModule, MatMenuModule, MatCheckboxModule, MatChipsModule, MatProgressBarModule, NgxEditorModule, MatAutocompleteModule, MatFormFieldModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
