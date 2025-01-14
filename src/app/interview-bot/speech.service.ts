import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private speechRecognition: any;
  private speechSynthesis: any;

  constructor( private http: HttpClient) {
    this.initSpeechRecognition();
    this.initSpeechSynthesis();
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  
  }

  private initSpeechSynthesis() {
    this.speechSynthesis = window.speechSynthesis;
  }

  speakQuestion(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    this.speechSynthesis.speak(utterance);
  }

  startListening(onResult: (transcript: string) => void): void {
    this.speechRecognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      onResult(transcript);
    };
    this.speechRecognition.start();
  }

  stopListening(): void {
    this.speechRecognition.stop();
  }

  isListening(): boolean {
    return this.speechRecognition?.listening;
  }

  getAnswer(payload:any) {
    // const payload={
    //   "question":question,
    //   "session_id":sessionId
    // }
    const url='http://localhost:8000/v1/policybot/query'
    return this.http.post(url,payload);
  }
}