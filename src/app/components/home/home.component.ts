import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InfoService } from '../../services/info.service';  // Asegúrate de que la ruta sea correcta
import { TranslateService } from '@ngx-translate/core';  // Importar TranslateService

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  responsables = [
    {
      name : "Dr. José Asunción Enríquez Zárate",
      photo: "assets/img/prof1.jpg",
      mail: "sseisescom@ipn.mx",
      info: "Doctor en Educación <br/>Maestría en Ciencias de la Computación <br/>Docente en ESCOM",
      intereses: "Tecnologías Web<br/>Bases de datos<br/>Programación Móvil<br/>Educación"
    },
    {
      name : "Dr. José Asunción Enríquez Zárate",
      photo: "assets/img/prof1.jpg",
      mail: "sseisescom@ipn.mx",
      info: "Doctor en Educación <br/>Maestría en Ciencias de la Computación <br/>Docente en ESCOM",
      intereses: "Tecnologías Web<br/>Bases de datos<br/>Programación Móvil<br/>Educación"
    },
    {
      name : "Dr. José Asunción Enríquez Zárate",
      photo: "assets/img/prof1.jpg",
      mail: "sseisescom@ipn.mx",
      info: "Doctor en Educación <br/>Maestría en Ciencias de la Computación <br/>Docente en ESCOM",
      intereses: "Tecnologías Web<br/>Bases de datos<br/>Programación Móvil<br/>Educación"
    }
  ];

  constructor(private infoService: InfoService, private translate: TranslateService) {}

  text = '';  // Texto que se mostrará en la animación de escribir y borrar
  textNoDelete = ''; // Texto que solo se escribirá
  private typingSpeed = 100; // Velocidad de escritura en ms
  private typingSpeed2 = 50; // Velocidad de escritura en ms
  private deletingSpeed = 100; // Velocidad de borrado en ms

  textosAnimacion: any; // Variable para almacenar los textos de la animación
  private animationActive = false;
  private animationId = 0; // Nuevo ID para control de animaciones

  // Referencia al contenedor del texto
  @ViewChild('typeTextNoDelete', { static: false }) typeTextNoDeleteElement: ElementRef | undefined;

  ngOnInit(): void {
    this.loadAnimationTexts();
    this.translate.onLangChange.subscribe(() => {
      this.loadAnimationTexts();
    });
  }

  private loadAnimationTexts(): void {
    this.animationId++; // Invalidar animaciones anteriores
    const currentAnimationId = this.animationId;
    
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    this.textosAnimacion = currentLang === 'en' 
      ? this.infoService.getAnimationTexts() 
      : this.infoService.getAnimacionesTexto();

    this.resetText();
    this.startAnimations(currentAnimationId);
  }

  private startAnimations(animationId: number): void {
    this.startTypingAnimation(animationId);
    this.startTypingNoDeleteAnimation(animationId);
  }

  private resetText(): void {
    this.text = ''; // Limpiar el texto de la animación
    this.textNoDelete = ''; // Limpiar el texto de la animación sin borrar
  }

  private async startTypingAnimation(animationId: number) {
    await this.typeText(this.textosAnimacion.text1, animationId);
    while (animationId === this.animationId) {
      await this.typeText(this.textosAnimacion.text2, animationId);
      if (animationId !== this.animationId) break;
      await this.sleep(2000);
      await this.deleteText(this.textosAnimacion.text2, animationId);
      await this.typeText(this.textosAnimacion.text3, animationId);
      if (animationId !== this.animationId) break;
      await this.sleep(2000);
      await this.deleteText(this.textosAnimacion.text3, animationId);
      await this.typeText(this.textosAnimacion.text4, animationId);
      if (animationId !== this.animationId) break;
      await this.sleep(2000);
      await this.deleteText(this.textosAnimacion.text4, animationId);
      // ... (repetir para los demás textos con verificaciones de animationId)
    }
  }

  private async startTypingNoDeleteAnimation(animationId: number) {
    await this.typeTextNoDelete(this.textosAnimacion.text5, animationId);
    if (animationId !== this.animationId) return;
    await this.typeTextNoDelete(this.textosAnimacion.text6, animationId);
    if (animationId !== this.animationId) return;
  }

  // Verifica si el texto se ha desbordado
  private checkTextOverflow() {
    if (this.typeTextNoDeleteElement) {
      const element = this.typeTextNoDeleteElement.nativeElement;
      if (element.scrollWidth > element.clientWidth) {
        // El texto se desbordó, hacer salto de línea
        this.textNoDelete += '\n';
      }
    }
  }

  private async typeText(text: string, animationId: number) {
    for (let i = 0; i < text.length; i++) {
      if (animationId !== this.animationId) return;
      if (text.charAt(i).match(/[^\n\r]/)) {
        this.text += text.charAt(i);
        await this.sleep(this.typingSpeed);
      }
    }
  }
  
  private async deleteText(text: string, animationId: number) {
    for (let i = 0; i < text.length; i++) {
      if (animationId !== this.animationId) return;
      if (this.text.length > 0 && this.text.slice(-1).match(/[^\n\r]/)) {
        this.text = this.text.slice(0, -1);
        await this.sleep(this.deletingSpeed);
      }
    }
  }
  
  private async typeTextNoDelete(text: string, animationId: number) {
    for (let i = 0; i < text.length; i++) {
      if (animationId !== this.animationId) return;
      if (text.charAt(i).match(/[^\n\r]/)) {
        this.textNoDelete += text.charAt(i);
        await this.sleep(this.typingSpeed2);
      }
      this.checkTextOverflow();
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  goToId(id:any){
    const element = document.querySelector(id);
    element.scrollIntoView();
  }
}
