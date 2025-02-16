import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, routingProviders } from './app.routing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { UnidadComponent } from './components/unidad/unidad.component';
import { HtmlObjetPipe } from './pipes/html-objet.pipe';
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { FormsModule } from '@angular/forms';
import { GlosarioComponent } from './components/glosario/glosario.component';
import { DataTablesModule } from 'angular-datatables';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InfoService } from './services/info.service';

// Función para cargar traducciones
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecursosComponent,
    UnidadesComponent,
    UnidadComponent,
    HtmlObjetPipe,
    EvaluacionesComponent,
    GlosarioComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [HttpClient, routingProviders, InfoService],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
