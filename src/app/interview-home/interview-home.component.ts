import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpeechService } from '../interview-bot/speech.service';

@Component({
  selector: 'app-interview-home',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './interview-home.component.html',
  styleUrl: './interview-home.component.scss'
})
export class InterviewHomeComponent {
  language: string = '';
  timeSlot: string = '';
  email: string = '';

  constructor(private router: Router,) {
    
  }

  isFormValid() {
    return this.language && this.timeSlot && this.email;
  }

  submitForm() {
    alert('Thank you, interview details will be forwarded to your email. All the best!');
    this.router.navigate(['/interview']);
  }
}
