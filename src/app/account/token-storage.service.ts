import { Injectable } from '@angular/core';
import { Project } from '../home/home.models';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_PROJECT = 'user-project';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('notificationSettings');
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

//   public saveProject(projects: Project[]): void {
//     window.sessionStorage.setItem(USER_PROJECT, JSON.stringify(projects));
//   }

//   public getProject(): Project[] {
//     const project = window.sessionStorage.getItem(USER_PROJECT);
//     if (project) {
//         return JSON.parse(project);
//       }
//       return [];
//   }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}