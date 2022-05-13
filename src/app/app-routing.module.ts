import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ChecklistComponent } from './home/checklist/checklist.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'release', component: ChecklistComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'report', component: ReportComponent },
  { path: 'help', component: HelpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
