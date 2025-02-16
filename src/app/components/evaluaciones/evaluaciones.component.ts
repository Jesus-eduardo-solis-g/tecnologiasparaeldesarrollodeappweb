import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoService } from '../../services/info.service';
import { TranslateService } from '@ngx-translate/core'; // Importar TranslateService

@Component({
  standalone: false,
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.css']
})
export class EvaluacionesComponent implements OnInit {

  id: number = 1;
  unidad: any;
  unidades: any[] = [];
  autoevaluacion: any[] = [];
  test: any[] = [];
  res: number[] = [];
  note: number = 0;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private infoService: InfoService,
    private translate: TranslateService // Inyectar TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUnidades(); // Usar el método dinámico para cargar unidades según el idioma
    this.autoevaluacion = this.infoService.getAutoevaluaciones();
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
      this.loadUnidades();
      this.autoevaluacion = this.infoService.getAutoevaluaciones();
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
    this.test = this.autoevaluacion[this.id - 1];
    this.res = new Array(this.autoevaluacion[this.id - 1].length).fill(-1);
  }

  onSubmit(f: any): void {
    this.note = 0;
    this.test.forEach((value, index) => {
      if (value.res === this.res[index]) {
        this.note++;
      }
    });
    this.note *= 10;
    this.note /= this.test.length;
    this.note = Number(this.note.toFixed(3));
  }
}
