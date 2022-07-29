import { Component, OnInit } from '@angular/core';
import { MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { Router } from '@angular/router';
import { Project } from '../home.models';


@Component({
  selector: 'app-checklistmenu',
  templateUrl: './checklist.menu.component.html',
  styleUrls: ['./checklist.menu.component.scss']
})
export class ChecklistMenuComponent implements OnInit{
    selectedReleaseId!: number;
    releaseName!: string| null;
    milestone!: string| null;
    workWeek!: string| null;
    selectedProject!: Project;
    
    public menuItems: MenuItemModel[] = [
        {
            id:'releasecompliance',
            text: 'Release Compliance',
        },
        {
            id:'releaseinfo',
            text: 'Release Info',
        },
        {
            id:'bkc',
            text: 'BKC',
        },
        {
            id:'notification',
            text: 'Notification',
        }
    ];
   
    constructor(private router: Router) {
        
    }
    ngOnInit(): void {
        this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
        this.setTitle();
    }
    
    onListSelect(args: SelectEventArgs) {
        args.item.classList.remove("e-active");
    }
    first(){
        alert('select');
    }

    select(args: MenuEventArgs): void {
        if (args.item.id === "releasecompliance")
        {
            this.router.navigate([ 'checklist/releasecompliance' ]);
        }
        else if (args.item.id === "releaseinfo")
        {
            this.router.navigate([ 'checklist/releaseinfo' ]);
        }
        else if (args.item.id === "bkc")
        {
            this.router.navigate([ 'checklist/bkc' ]);
        }
        else if (args.item.id === "notification")
        {
            this.router.navigate([ 'checklist/notification' ]);
        }
        
    }

    setTitle(){
        // this.release = this.checkList.find(x => x.id === this.selectedReleaseId)!;
        // this.releaseChecklist = this.release.releaseChecklist;
        this.selectedReleaseId = this.selectedProject.project_id!;
        this.releaseName = this.selectedProject.project_name;
        this.milestone = this.selectedProject.project_milestone_id;
        this.workWeek = this.selectedProject.project_release_date;
        // this.oldChecklist = this.releaseChecklist!;
        
      }
}

