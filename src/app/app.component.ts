import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit  {
  title = 'ChatBot';
  public IsLoading = false;
  public Config = { show: false, backdrop: 'static' };
  private isBrowser: boolean;
  public internetConnected : boolean = false;

  constructor(
 
    @Inject(PLATFORM_ID) platformId: Object) { this.isBrowser = isPlatformBrowser(platformId); }
    ngOnInit(): void {
      if (this.isBrowser) {
        this.checkInternetConnection();
    
      }
    }
  public checkInternetConnection() {
 
  }
}
