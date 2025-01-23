import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pricing',
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {

  pricingPlans = [
    {
      name: 'Trainer Provided Plan',
      price: 49,
      duration: 'month',
      features: [
        'Trainers provided for training sessions',
        'Access to premium slots',
        'Personalized training schedules',
        '24/7 Support'
      ]
    },
    {
      name: 'One Week Horse Booking',
      price: 69,
      duration: 'week',
      features: [
        '1 Horse booked for one time slot per week',
        'Access to basic time slots',
        'Standard Support'
      ]
    },
    {
      name: 'One Month Horse Booking',
      price: 99,
      duration: 'month',
      features: [
        '1 Horse booked for one time slot per month',
        'Access to basic time slots',
        'Standard Support'
      ]
    }
  ];
}
