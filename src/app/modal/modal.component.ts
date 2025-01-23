import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isVisible: boolean = false;  
  @Input() eventDetails: any = {}; 
  @Output() closeModalEvent = new EventEmitter<boolean>();  

  closeModal() {
    this.closeModalEvent.emit(false);  
  }
}
