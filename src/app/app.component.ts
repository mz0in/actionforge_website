import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Subscription, filter } from 'rxjs';
import { IWhoAmI } from './schemas/whoami';
import { GatewayService } from './services/gateway.service';
import { NavigationEnd, Router } from '@angular/router';
import { HighlightLoader } from 'ngx-highlightjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  gw = inject(GatewayService);
  router = inject(Router);
  hljsLoader = inject(HighlightLoader);

  whoami: IWhoAmI | null = null;
  whoamiSubscription: Subscription | null = null;

  currentRoute = '';

  getThemeIcon(): string {
    return document.documentElement.classList.contains('dark') ? 'octLightBulb' : 'octMoon';
  }

  title = location.hostname;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentRoute = (event as NavigationEnd).url;
    });
  }

  isHomeRoute(): boolean {
    return this.currentRoute === '/';
  }

  ngOnInit(): void {
    initFlowbite();

    const theme = window.localStorage.getItem('theme');
    if (theme === 'dark' || !theme) {
      document.documentElement.classList.add('dark');
      this.hljsLoader.setTheme('assets/github-dark.min.css');
    } else {
      this.hljsLoader.setTheme('assets/github.min.css');
    }
  }

  onClickToggleTheme(_event: MouseEvent): void {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
      this.hljsLoader.setTheme('assets/github.min.css');
    } else {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
      this.hljsLoader.setTheme('assets/github-dark.min.css');
    }
  }

  isCurrentPage(page: string): boolean {
    return window.location.pathname === page;
  }

  onSignIn(_event: MouseEvent): void {
    void this.gw.signIn();
  }

  onSignOut(_event: MouseEvent): void {
    //
  }

  ngOnDestroy(): void {
    if (this.whoamiSubscription !== null) {
      this.whoamiSubscription.unsubscribe();
    }
  }

  async ngAfterViewInit(): Promise<void> {

    this.whoamiSubscription = this.gw.whoAmIObservable().subscribe((whoami: IWhoAmI | null) => {
      this.whoami = whoami;
    });

    void this.gw.httpCheckIfUserIsSignedIn();
  }
}
