import { Component, inject, input, OnInit, output, signal } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PlanService } from '../../core/services/plan/plan.service';
import { DataViewModule } from 'primeng/dataview';
import { Plan } from '../../core/models/plan.model';
import { Panel } from "primeng/panel";
import { RegisterPlanForm } from "./components/register-plan-form/register-plan-form";
import { PlanCard } from './components/plan-card/plan-card';


@Component({
  selector: 'app-plan',
  imports: [DialogModule, ButtonModule, DataViewModule, Panel, RegisterPlanForm, PlanCard],
  templateUrl: './plan.html',
  styleUrl: './plan.css',
})
export class PlanComponent implements OnInit {
  
  private plansService = inject(PlanService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null)
  plans = signal<Plan[]>([]);

  platformId = input.required<string>()
  closeModal = output()

  isRegisterFormActive = signal<boolean>(false)

  
  _loadPlans() {
    this.isLoading.set(true)

    const sub = this.plansService.getPlansByPlatform(this.platformId()).subscribe({
      next: (response) => {
        this.plans.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false)
        this.errorMessage.set(err)
      },
    })

    return () => sub.unsubscribe();
  }
  
  ngOnInit(): void {
    this._loadPlans();
  }
  

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onClickRegisterFormButton() : void {
    this.isRegisterFormActive.update(old => !old);
  } 

}
