import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, NgZone, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechService } from './speech.service';
import { Router } from '@angular/router';
import { FormDataService } from '../interview-home/form-data.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
declare var webkitSpeechRecognition: new () => any;
@Component({
  selector: 'app-interview-bot',
  standalone: true,
  imports: [FormsModule, CommonModule,DialogBoxComponent],
  templateUrl: './interview-bot.component.html',
  styleUrl: './interview-bot.component.scss'
})
export class InterviewBotComponent {
  @ViewChild('msgSection') msgSection!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('confirmationDialog') confirmationDialog!: DialogBoxComponent;
  isVisible = false;
 
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  isVideoVisible = true;

  counter: number = 1800;
  isTimerExpired: boolean = false;
  timer: any;
  warningMessage: string = '';
  isFullScreen: boolean = false;
  stopSpeak:boolean=false;


  //voice parameters
  results: any;
  isListening: boolean = false;
  speechResultsInProgress: boolean = false;
  speechResults: any;
  openVoicePannel: boolean = false;

  formData: any;
  userName: any = '';
  intervieweName: string = "omkar";
  constructor(private _Speech_Service: SpeechService, private zone: NgZone, private router: Router, private formservice: FormDataService) {
    //  this.zone=zone;
    // this.requestFullScreen();
    this.formData = formservice.getFormData();
    setTimeout(() => {
      this.userName = this.formData.name
      console.log(this.userName);
      // this.intervieweName=this.userName as string
      console.log(this.intervieweName);
      // Allow for DOM update
      this.conversation.push(
        { type: 'bot', message: `Welcome to the interview! ${this.userName}`+". Please say 'Hi' to start The interview" }
      )
      this.botMessages.push(
        `Welcome to the interview! ${this.userName}` +". Please say 'Hi' to start The interview."
      )
      this.speakQuestion();
      this.startTimer();
    }, 2000);

    this.startVideo();

    // this.speakQuestion();





  }

  conversation: { type: 'bot' | 'user'; message: string }[] = [];
  botMessages: string[] = [];
  userMessages: string[] = [];
  sessionId: string = '';
  userMessage = '';
  userCode = '';

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const formData = navigation?.extras.state?.['formData'];
    console.log('Received form data:', formData);
  }


  onEndInterview(): void {
    this.confirmationDialog.open();
  }
 
  endInterview(): void {
    console.log('Interview ended');
// Add your logic to end the interview here
  }
 
  cancelEndInterview(): void {
    console.log('End interview cancelled');
  }
  resetCode(){
    this.userCode='';
  }
  sendMessage() {

    this.userMessages.push(this.userMessage);
    console.log(this.userMessage);
    

    if (this.conversation[this.conversation.length - 1]) {
      this.conversation.push({ type: 'user', message: this.userMessage });
      // this.messages.push(`${this.userMessage}`);
      // this.userMessages.push(`${this.userMessage}`);
      
      this.getAIResponse(this.userMessage);
      
    }
    this.userMessage='';
  }

  sendMessageVoice(userInput?: any) {

  }

  stopVoice(){
    if(!this.stopSpeak){
      this.stopSpeak=true;
      this._Speech_Service.stopListening();
    }
    this.stopSpeak=false;
   

  }


  scrollToBottom() {
    try {
      this.msgSection.nativeElement.scrollTop = this.msgSection.nativeElement.scrollHeight;
    } catch (err) { }
  }

  speakQuestion(): void {

    this._Speech_Service.speakQuestion(this.botMessages[this.botMessages.length - 1]);
  }

  startListening(): void {
    this._Speech_Service.startListening((transcript) => {
      console.log('User response:', transcript);
      // Handle the user's response here
    });
  }

  stopListening(): void {
    this._Speech_Service.stopSpeaking();
  }

  onCodeSubmit(userCode: any) {
    //  const payload={question:this.messages[this.messages.length-1],session_id:this.sessionId};
    const payload = { question: userCode, session_id: this.sessionId };
    this.getAnswerFromBot(payload);
    this.userCode = '';

  }

  startTimer() {
    this.isTimerExpired = false;
    this.counter = 1800; // Example: Timer starts from 60 seconds
    this.timer = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.timer);
        this.isTimerExpired = true;
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getAIResponse(userMessage: any) {

    const payload = { question: userMessage, session_id: this.sessionId };
    this.getAnswerFromBot(payload);

  }

  getAnswerFromBot(payload: any) {

    this._Speech_Service.getAnswer(payload).subscribe((response: any) => {
      this.sessionId = response.session_id;
      const aiResponse = response.answer;
      this.conversation.push({ type: 'bot', message: aiResponse });
      this.botMessages.push(`${aiResponse}`);
      this.userMessage = '';
      this.speakQuestion();
      setTimeout(() => { // Allow for DOM update
        this.scrollToBottom();
      }, 0);
    });
  }

  //video -container

  startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error('Error accessing the camera: ', err.message);
        alert('Could not access your camera. Please check your settings.');
      });
  }

  minimizeVideo() {
    this.isVideoVisible = false;
  }

  closeVideo() {
    const video = this.videoElement.nativeElement;
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    this.isVideoVisible = false;
  }

  startListeningVoice() {

    console.log('here');
    if (!this.isListening) {
      // this.isListening = true;
      this.openVoicePannel = true;
      if (this.openVoicePannel == true) {
        this.isListening = true;
        this.results = undefined;
        console.log('this.isListening: ', this.isListening);

        if ('webkitSpeechRecognition' in window) {
          const vSearch = new webkitSpeechRecognition();
          vSearch.continuous = false;
          vSearch.interimresults = false;
          vSearch.lang = 'en-US';
          vSearch.start();
          vSearch.onresult = (e: any) => {
            console.log(e);
            this.results = e.results[0][0].transcript;
            this.getSpeechResults();
            vSearch.stop();
            this.zone.run(() => {
              // this.isListening = false;
              this.stopListeningVoice();
              console.log('this.isListening: ', this.isListening);
            });
            console.log('this.isListening: ', this.isListening);
          };
          vSearch.onaudioend = (e: any) => {
            this.zone.run(() => {
              // this.isListening = false;
              this.stopListeningVoice();
              console.log('this.isListening: ', this.isListening);
            });
            console.log(e);
          };
        } else {
          alert('Your browser does not support voice recognition!');
        }

      }
      else {
        this.isListening = false;
        console.log('this.isListening: ', this.isListening);
      }

    }
  }
  stopListeningVoice() {
    this.isListening = false;

    this.openVoicePannel = false;
  }

  getSpeechResults() {
    this.speechResultsInProgress = true;
    console.log(this.results);
    // this.userInput = this.results;
    console.log('this.isListening: ', this.isListening);
    this.userMessage = this.results;
    // this.sendMessage(this.results);
    // this.speechResultsInProgress = false;
    // this.openVoicePannel = false; // Move this line here

  }

  // @HostListener('document:visibilitychange', [])
  // onVisibilityChange() {
  //   if (document.hidden) {
  //     this.warningMessage = 'Please stay on the current tab!';
  //     // Optional: Pause functionality, log an event, etc.
  //   } else {
  //     this.warningMessage = '';
  //   }
  // }

  // @HostListener('window:blur', [])
  // onWindowBlur() {
  //   this.warningMessage = 'Please keep the browser window in focus!';
  //   // Optional: Pause timer or other functionality
  // }

  // @HostListener('window:focus', [])
  // onWindowFocus() {
  //   this.warningMessage = '';
  //   // Optional: Resume timer or other functionality
  // }

  // @HostListener('document:fullscreenchange', [])
  // onFullScreenChange() {
  //   this.isFullScreen = !!document.fullscreenElement;
  //   if (!this.isFullScreen) {
  //     this.warningMessage = 'Please return to full-screen mode!';
  //   } else {
  //     this.warningMessage = '';
  //   }
  // }

  // requestFullScreen() {
  //   const elem = document.documentElement;
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen().catch(err => {
  //       console.error('Error attempting to enable full-screen mode:', err);
  //     });
  //   } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
  //     (elem as any).webkitRequestFullscreen();
  //   } else if ((elem as any).msRequestFullscreen) { /* IE11 */
  //     (elem as any).msRequestFullscreen();
  //   }
  // }

  // exitFullScreen() {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen().catch(err => {
  //       console.error('Error attempting to exit full-screen mode:', err);
  //     });
  //   } else if ((document as any).webkitExitFullscreen) { /* Safari */
  //     (document as any).webkitExitFullscreen();
  //   } else if ((document as any).msExitFullscreen) { /* IE11 */
  //     (document as any).msExitFullscreen();
  //   }
  // }


  // Disable right-click
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.showWarning('Right-click is not allowed!');
  }

  // Disable keyboard shortcuts for copy, cut, and paste
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      (event.ctrlKey || event.metaKey) && // Detect Ctrl (Windows) or Command (Mac)
      (event.key === 'a' || event.key === 'c' || event.key === 'x' || event.key === 'v')
    ) {
      event.preventDefault();
      this.showWarning('Copy-paste actions are not allowed!');
    }
  }

  // Show warning message
  showWarning(message: string) {
    this.warningMessage = message;
    setTimeout(() => {
      this.warningMessage = ''; // Hide the warning after 2 seconds
    }, 2000);
  }



}
