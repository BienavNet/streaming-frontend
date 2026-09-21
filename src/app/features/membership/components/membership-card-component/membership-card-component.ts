import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MembershipDetails } from '../../../../core/models/membership.model';
import { ButtonModule } from 'primeng/button';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-membership-card-component',
  imports: [CardModule, ButtonModule, DatePipe],
  templateUrl: './membership-card-component.html',
  styleUrl: './membership-card-component.css',
})
export class MembershipCardComponent {
  membership = input.required<MembershipDetails>()
}
