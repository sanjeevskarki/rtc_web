import { Component } from '@angular/core';
import { MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    public menuItems: MenuItemModel[] = [
        {
            id:'home',
            text: 'Home',
        },
        {
            id:'release',
            text: 'New Release',
        },
        {
            id:'admin',
            text: 'Admin',
        },
        {
            id:'report',
            text: 'Reports',
        },
        { 
            id:'help',
            text: 'Help' 
        }
    ];
   
    constructor(private router: Router) {

    }
    
    onListSelect(args: SelectEventArgs) {
        args.item.classList.remove("e-active");
    }

    select(args: MenuEventArgs): void {
        if (args.item.id === "home")
        {
            this.router.navigate([ 'home' ]);
        }
        else if (args.item.id === "release")
        {
            this.router.navigate([ 'release' ]);
        }
        else if (args.item.id === "admin")
        {
            this.router.navigate([ 'admin' ]);
        }
        else if (args.item.id === "report")
        {
            this.router.navigate([ 'report' ]);
        }
        else if (args.item.id === "help")
        {
            this.router.navigate([ 'help' ]);
        }
        
    }
}

