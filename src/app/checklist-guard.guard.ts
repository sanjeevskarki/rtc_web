import { HostListener, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ChecklistComponent } from './home/checklist/checklist.component';
import { ReleaseComponent } from './release/release.new/release.component';

@Injectable({
  providedIn: 'root'
})
export class ChecklistGuard implements CanDeactivate<ChecklistComponent> {
  
  @HostListener('window:beforeunload')
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

@Injectable({
  providedIn: 'root'
})
export class ReleaseGuard implements CanDeactivate<ReleaseComponent> {
  
  @HostListener('window:beforeunload')
  canDeactivate(component: ReleaseComponent, currentRoute:ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if(component.checkData()){
      let subject = new Subject<boolean>();
      component.openConfirmation();
      subject = component.subject;
      return subject.asObservable();
    }
    return true;
  }
  
}
