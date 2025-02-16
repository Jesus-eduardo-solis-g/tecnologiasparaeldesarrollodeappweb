import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoService } from 'src/app/services/info.service';
import { TranslateService } from '@ngx-translate/core'; // Importar TranslateService

@Component({
  standalone: false,
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.css']
})
export class RecursosComponent implements OnInit {
  id: number = 1;
  unidades: any[] = [];
  unidad: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private infoService: InfoService,
    private translate: TranslateService // Inyectar TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUnidades(); // Usar el método dinámico para cargar unidades según el idioma
    this.updateId();
    this.updateUnidad();

    // Suscribirse a los cambios de idioma para actualizar las unidades cuando el idioma cambia
    this.translate.onLangChange.subscribe(() => {
      this.loadUnidades();
      this.updateUnidad(); // Actualizar la unidad seleccionada con los nuevos datos
    });
  }

  ngDoCheck(): void {
    if (this.id !== this.route.snapshot.params['id']) {
      this.loadUnidades(); // Volver a cargar unidades según el idioma
      this.updateId();
      this.updateUnidad();
    }
  }

  // Método para elegir entre unidades o units según el idioma
  loadUnidades(): void {
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    if (currentLang === 'en') {
      this.unidades = this.infoService.getUnits(); // Obtener unidades en inglés
    } else {
      this.unidades = this.infoService.getUnidades(); // Obtener unidades en español
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
    this.unidad.contenido.forEach((element: any) => {
      if (!element.recurso || element.recurso.trim() === "") {
        element.recurso = "<h3 class='text-center'>Sin recursos disponibles</h3>";
      }
      if (!element.actividad || element.actividad.trim() === "") {
        element.actividad = "<h3 class='text-center'>Sin actividades disponibles</h3>";
      }
    });
  }
}
