import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stripe-success',
  imports: [RouterLink],
  templateUrl: './stripe-success.component.html',
  styleUrl: './stripe-success.component.css'
})
export class StripeSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // You can handle any additional logic here after payment success if needed
    console.log('Payment was successful');
  }

}