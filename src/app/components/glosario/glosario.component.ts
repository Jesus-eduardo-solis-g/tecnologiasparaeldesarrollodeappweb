import { Component, OnInit, OnDestroy } from '@angular/core';
import { InfoService } from '../../services/info.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';

declare var $: any; // Declarar jQuery para utilizar DataTables

@Component({
  standalone: false,
  selector: 'app-glosario',
  templateUrl: './glosario.component.html',
  styleUrls: ['./glosario.component.css']
})
export class GlosarioComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  optionsReady = false;
  currentLang: string = 'es';
  langChangeSubscription: any;

  constructor(
    private infoService: InfoService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('es');
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;

    this.setTableOptions();

    // Suscribirse a los cambios de idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      this.setTableOptions();
    });
  }

  setTableOptions(): void {
    this.translate.get([
      'datatable.search', 
      'datatable.paginate.previous', 
      'datatable.paginate.next', 
      'datatable.info', 
      'datatable.lengthMenu'
    ]).subscribe(translations => {
      
      let data;
      if (this.currentLang === 'es') {
        data = this.infoService.getGlosario();
      } else {
        data = this.infoService.getGlossary();
      }

      // Destruir la tabla si ya está inicializada
      if ($.fn.DataTable && $.fn.dataTable.isDataTable('#glosarioTable')) {
        $('#glosarioTable').DataTable().clear().destroy();
      }

      // Configurar las opciones de DataTables
      this.dtOptions = {
        data: data,
        paging: true,
        info: false,
        responsive: true,
        lengthMenu: [[4, 8, 16, -1], [4, 8, 16, translations['datatable.lengthMenu']]],
        language: {
          search: translations['datatable.search'],
          paginate: {
            first: '',
            last: '',
            previous: translations['datatable.paginate.previous'],
            next: translations['datatable.paginate.next']
          },
          info: translations['datatable.info'],
          lengthMenu: translations['datatable.lengthMenu'],
        },
        columns: [
          { "data": "word" },
          { "data": "description" },
        ]
      };

      // Reinicializar la tabla
      $('#glosarioTable').DataTable(this.dtOptions);
      this.optionsReady = true;
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse del cambio de idioma para evitar problemas de memoria
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }

    // Destruir la tabla DataTable si existe al destruir el componente
    if ($.fn.DataTable && $.fn.dataTable.isDataTable('#glosarioTable')) {
      $('#glosarioTable').DataTable().clear().destroy();
    }
  }
}
