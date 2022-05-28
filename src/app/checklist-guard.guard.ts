import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ChecklistComponent } from './home/checklist/checklist.component';

@Injectable({
  providedIn: 'root'
})
export class ChecklistGuard implements CanDeactivate<ChecklistComponent> {
  
  canDeactivate(component: ChecklistComponent, currentRoute:ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if(component.checkData()){
      let subject = new Subject<boolean>();
      component.openConfirmation();
      subject = component.subject;
      return subject.asObservable();
    }
    return true;
  }
  
  
}
