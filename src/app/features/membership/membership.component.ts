import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MembershipService } from '../../core/services/membership/membership.service';
import { MembershipDetails } from '../../core/models/membership.model';
import { RegisterMembershipFormComponent } from "./components/register-membership-form-component/register-membership-form-component";

import { MembershipCardComponent } from './components/membership-card-component/membership-card-component';
import { UpdateMembershipComponent } from "./components/update-membership-component/update-membership-component";

@Component({
  selector: 'app-membership',
  imports: [PanelModule, DialogModule, ButtonModule, RegisterMembershipFormComponent, MembershipCardComponent, UpdateMembershipComponent],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.css',
})
export class MembershipComponent implements OnInit {

  private membershipService = inject(MembershipService);
  isLoading = signal<boolean>(false);

  membershipDetails = signal<MembershipDetails | null>(null);
  
  isRegisterFormActive = signal<boolean>(false);
  isUpdateBtnPressed = signal<boolean>(false);
  accountId = input.required<string>();
  onCloseModal = output<undefined>();
  
  
  ngOnInit(): void {
    this._loadMembership();
  }

  private _loadMembership() {
    this.isLoading.set(true);
    
    const sub = this.membershipService.getMembership(this.accountId())
        .subscribe({
          next: (response) => {
            this.membershipDetails.set(response);
            this.isLoading.set(false)
          }, 
          error: (err) => {
            this.isLoading.set(false)
            console.log(err)
          }
        })

    return () => sub.unsubscribe()
  }

  onClickRegisterBtn() : void {
    this.isRegisterFormActive.update(old => !old);
  }
  
  closeModal() : void {
    this.onCloseModal.emit(undefined);
  }

  onUpdateClickBtn(): void {
    this.isUpdateBtnPressed.update(old => !old);
  }
}
