import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../../../core/services/dashboard/dashboard.service';
import { DashboardData } from '../../../../core/models/dashboard.model';
import { TableModule } from "primeng/table";

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-component',
  imports: [CardModule, TableModule, AvatarModule, AvatarGroupModule, CurrencyPipe, DatePipe],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
    private dashboardService = inject(DashboardService);
    
    isLoading = signal<boolean>(false);
    panelData = signal<DashboardData>(Object.create(null));


    ngOnInit(): void {
        this._loadData();
    }

    private _loadData() {
        this.isLoading.set(true);

        const sub = this.dashboardService.loadData().subscribe({
            next: (response) => {
                this.isLoading.set(false);
                this.panelData.set(response!);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });

        return () => sub.unsubscribe();
    }
}
