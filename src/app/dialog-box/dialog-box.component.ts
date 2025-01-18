import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-box',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss'
})
export class DialogBoxComponent {
  isVisible = false;
 
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
 constructor(private router:Router){
   
 }
  open(): void {
    this.isVisible = true;
  }
 
  close(): void {
    this.isVisible = false;
  }
 
  confirm(): void {
    this.confirmed.emit();
    this.router.navigate(['/thank-you'])
    this.close();

  }
 
  cancel(): void {
    this.cancelled.emit();
    this.close();
  }
}
