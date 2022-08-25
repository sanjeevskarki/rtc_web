import { Component, OnInit } from '@angular/core';
import { Project } from '../home.models';
import { ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-checklistmenu',
    templateUrl: './checklist.menu.component.html',
    styleUrls: ['./checklist.menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ChecklistMenuComponent implements OnInit {
    selectedReleaseId!: number;
    releaseName!: string | null;
    milestone!: string | null;
    workWeek!: string | null;
    selectedProject!: Project;
    isReleaseComplianceVisible: boolean = true;
    isReleaseInfoVisible: boolean = true;
    isBkcVisble: boolean = true;
    isNotificationVisble: boolean = true;
    releaseInfoLabel!: string;

    constructor() { }

    ngOnInit(): void {
        this.selectedProject = JSON.parse(localStorage.getItem('selectedProject')!);
        this.setTitle();
    }

    setTitle() {
        if (this.selectedProject) {
            this.releaseInfoLabel = 'Release Info';
            this.selectedReleaseId = this.selectedProject.project_id!;
            this.releaseName = this.selectedProject.project_name;
            this.milestone = this.selectedProject.project_milestone_id;
            this.workWeek = this.selectedProject.project_release_date;
        } else {
            this.releaseInfoLabel = 'Add Release';
            this.isReleaseComplianceVisible = false;
            this.isBkcVisble = false;
            this.isNotificationVisble = false;
        }

    }
}

