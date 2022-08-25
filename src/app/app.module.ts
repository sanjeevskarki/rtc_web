import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { WorkWeekPipePipe } from './home/work-week-pipe.pipe';

import { ReportComponent } from './report/report.component';
import { ChecklistComponent } from './home/checklist/checklist.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EvidenceAddComponent } from './home/evidence.add/evidenceadd.component';
import { ReleaseComponent } from './release/release.component';

import { CommentAddComponent } from './home/comment.add/commentadd.component';
import { ChecklistMenuComponent } from './home/checklist.menu/checklist.menu.component';
import { ReleaseEditComponent } from './release/release.edit/release.edit.component';
import { BkcComponent } from './home/bkc/bkc.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule, MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ChecklistConfirmDialogComponent } from './home/checklistconfirmdialog/checklist.confirm.dialog.component';
import { ReleaseConfirmDialogComponent } from './release/releaseconfirmdialog/release.confirm.dialog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReleaseStakeholderComponent } from './release/release.stakeholder/release.stakeholder.component';

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
    BkcComponent,
    ChecklistConfirmDialogComponent,
    ReleaseConfirmDialogComponent,
    ReleaseStakeholderComponent
    
  ],
  imports: [
    HttpClientModule, BrowserModule, AppRoutingModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule,
    MatToolbarModule,MatIconModule,MatSidenavModule,MatListModule,MatButtonModule,MatTableModule,MatDialogModule,MatInputModule,MatPaginatorModule,MatSortModule,MatTooltipModule,
    MatSelectModule,MatGridListModule,MatDatepickerModule,MatNativeDateModule, MatRippleModule, MatProgressSpinnerModule, PdfViewerModule 
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
