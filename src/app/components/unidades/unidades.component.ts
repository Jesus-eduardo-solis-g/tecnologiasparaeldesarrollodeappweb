import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoService } from '../../services/info.service';
import { TranslateService } from '@ngx-translate/core'; // Importar TranslateService

@Component({
  standalone: false,
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit, DoCheck {
  uniSection: string = 'contenidos';
  unidades: any[] = [];
  id: number = 1;
  unidad: any;
  flagCuadro: boolean = true;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private infoService: InfoService,
    private translate: TranslateService // Inyectar TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUnidades(); // Cargar unidades según el idioma
    this.updateId();
    this.updateUnidad();

    // Suscribirse a cambios de idioma
    this.translate.onLangChange.subscribe(() => {
      this.loadUnidades();
      this.updateUnidad();
    });
  }

  ngDoCheck(): void {
    if (this.id !== this.route.snapshot.params['id']) {
      this.loadUnidades();
      this.updateId();
      this.updateUnidad();
    }
  }

  // Cargar unidades según el idioma
  loadUnidades(): void {
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    console.log('Idioma actual:', currentLang); // Mostrar el idioma actual en la consola
  
    if (currentLang === 'en') {
      this.unidades = this.infoService.getUnits(); // Unidades en inglés
      console.log('Unidades en inglés cargadas:', this.unidades); // Mostrar las unidades en inglés
    } else {
      this.unidades = this.infoService.getUnidades(); // Unidades en español
      console.log('Unidades en español cargadas:', this.unidades); // Mostrar las unidades en español
    }
  }
   

  updateId(): void {
    this.id = 1;
    if (!isNaN(this.route.snapshot.params['id'])) {
      this.id = this.route.snapshot.params['id'] % this.unidades.length === 0 
        ? this.unidades.length 
        : this.route.snapshot.params['id'] % this.unidades.length;
    }
  }

  updateUnidad(): void {
    this.unidad = this.unidades[this.id - 1];

    // Cuadro de evaluación vacío
    if (!this.unidad.cuadroEval || this.unidad.cuadroEval.trim() === "") {
      this.flagCuadro = false;
      // this.unidad.cuadroEvaluacion = "<h3 class='text-center'>Sin cuadro de evaluación disponible</h3>";
    }

    // Verificar contenido y traducir mensajes estáticos
    this.unidad.contenido.forEach((element: any) => {
      if (!element.unidad || element.unidad.trim() === "") {
        // Usar el servicio de traducción para los mensajes estáticos
        this.translate.get('unit.noInfo').subscribe((res: string) => {
          console.log('Translation result:', res); // Verificar si devuelve el valor correcto
          element.unidad = `<h3 class='text-center'>${res}</h3>`;
        });
      }
      if (!element.actividad || element.actividad.trim() === "") {
        this.translate.get('unit.noActivities').subscribe((res: string) => {
          element.actividad = `<h3 class='text-center'>${res}</h3>`;
        });
      }
    });
  }
}
