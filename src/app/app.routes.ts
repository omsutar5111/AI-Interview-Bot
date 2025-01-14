import { Routes } from '@angular/router';
import { InterviewHomeComponent } from './interview-home/interview-home.component';
import { InterviewBotComponent } from './interview-bot/interview-bot.component';

export const routes: Routes = [
  { path: '', redirectTo: '/interview-bot', pathMatch: 'full' }, // Default route
  { path: 'interview-bot', component: InterviewBotComponent },
  ];
