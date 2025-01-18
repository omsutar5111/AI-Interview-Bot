import { Routes } from '@angular/router';
import { InterviewHomeComponent } from './interview-home/interview-home.component';
import { InterviewBotComponent } from './interview-bot/interview-bot.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

export const routes: Routes = [

  { path: '', redirectTo: 'interview-home', pathMatch: 'full' },
  {path:'interview-home',component:InterviewHomeComponent}, // Default route
  { path: 'interview-bot', component: InterviewBotComponent },
  {path:'thank-you',component:ThankYouComponent}
  ];
