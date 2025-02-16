import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { InfoService } from './services/info.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'Tecnologías para el desarrollo de aplicaciones Web';
  unidades: any;
  currentLink: string = "";
  lastScrollPosition = 0;
  isSticky = false; // Empieza con el header visible
  navs: Array<any> = [];

  constructor(
    private router: Router,
    private infoService: InfoService,
    private translate: TranslateService // Inyecta el servicio de traducción
  ) {
    this.unidades = this.infoService.getTitleUnits();
    this.translate.setDefaultLang('es'); // Establece el idioma predeterminado
  }

  ngOnInit(): void {
    this.checkScroll();
    this.loadNavs();
    this.translate.onLangChange.subscribe(() => {
      this.loadNavs();
    });
  }

  ngDoCheck(): void {
    this.currentLink = this.router.url;
  }

  loadNavs(): void {
    const titles = [
      'home.welcome.title',
      'home.methodology.title',
      'home.competence.title',
      'home.eval.title',
      'home.strat.title',
      'home.prog.title',
      'home.contacts.title',
      'home.req.title'
    ];

    const navLinks = [
      "#curso-info",
      "#meto",
      "#competencia",
      "#eval",
      "#estrategias",
      "#programa-estudios",
      "#contactos",
      "#reque"
    ];

    this.translate.get(titles).subscribe(translations => {
      this.navs = navLinks.map((link, index) => ({
        title: translations[titles[index]],
        link: link
      }));
    });
  }

  goToId(id: any) {
    const element = document.querySelector(id);
    element?.scrollIntoView();
  }

  collapse() {
    document.getElementById('navbarSupportedContent')?.classList.remove('show');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang); // Método para cambiar el idioma
  }

  @HostListener('document:scroll', ['$event'])
  checkScroll(event?: Event) {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    this.isSticky = scrollPosition < 0 || scrollPosition > this.lastScrollPosition;

    this.lastScrollPosition = scrollPosition;
  }
}
