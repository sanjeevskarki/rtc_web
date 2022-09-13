import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ChecklistComponent } from './home/checklist/checklist.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { ChecklistGuard, ReleaseGuard } from './checklist-guard.guard';
import { ReleaseComponent } from './release/release.component';
import { ReleaseEditComponent } from './release/release.edit/release.edit.component';
import { BkcComponent } from './home/bkc/bkc.component';
import { ChecklistMenuComponent } from './home/checklist.menu/checklist.menu.component';
import { NotificationComponent } from './home/notification/notification.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'release', component: ReleaseComponent,canDeactivate: [ReleaseGuard]  },
  { path: 'admin', component: AdminComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'report', component: ReportComponent },
  { path: 'help', component: HelpComponent },
  { path: 'checklist',        
        component: ChecklistMenuComponent,
        children: [
          {
            path: 'releasecompliance',        
            component: ChecklistComponent,
            // canDeactivate: [ChecklistGuard],
          },
          {
            path: 'releaseinfo',        
            component: ReleaseEditComponent,
          },
          {
            path: 'bkc',        
            component: BkcComponent,
          },
          {
            path: 'notification',        
            component: NotificationComponent,
          }
       ]           

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
