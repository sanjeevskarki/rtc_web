import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ADMIN_USER } from '../home/home.constants';
import { RTC_VERSION } from '../release/release.constants';
import { UserStatus } from './login.model';
import { LoginService } from './login.service';
import { TokenStorageService } from './token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  suffix = '@intel.com';
  rtcVersion: string = RTC_VERSION;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  userName!:string;
  notExist:boolean = false;
  isLoading:boolean=false;
  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private service: LoginService,public dialog: MatDialog, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.userName = this.tokenStorage.getUser();
    }
  }

  loginConfirmDialogRef:any;
  login(_templateRef: any){
    this.notExist=false;
    this.isLoading = true;
    this.userName = this.loginForm.controls['email'].value; // "yossi.avni@intel.com";
    if(this.userName === ADMIN_USER){
      this.tokenStorage.saveUser(this.userName);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.isLoading = false;
      this.router.navigate(['/home']);
    }else{
      this.service.login(this.userName).subscribe(
        data => {
          if(data.status){
            this.tokenStorage.saveToken(data.token!);
            this.tokenStorage.saveUser(this.userName);

            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.isLoading = false;
            this.router.navigate(['/home']);
          }else{
            this.loginConfirmDialogRef = this.dialog.open(_templateRef, {
              height: '17%',
              width: '30%',
              disableClose: true
            });
            this.isLoading = false;
            this.notExist=true;
          }
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
    
  }

  closeDialog(){
    this.loginConfirmDialogRef.close();
  }
  continue(){
    this.loginConfirmDialogRef.close();
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.isLoading = false;
    this.router.navigate(['/home']);
  }

  // close(){

  // }

  reloadPage(): void {
    window.location.reload();
  }

  isValidEmailId() {
    if (this.loginForm.controls['email'].value?.endsWith(this.suffix)) {
      return false;
    } else {
      return true;
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }

}
