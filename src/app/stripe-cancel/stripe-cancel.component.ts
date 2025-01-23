import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stripe-cancel',
  imports: [RouterLink],
  templateUrl: './stripe-cancel.component.html',
  styleUrl: './stripe-cancel.component.css'
})
export class StripeCancelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Payment was canceled');
  }
}