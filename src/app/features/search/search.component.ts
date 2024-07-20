import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  numeroProcesso: string = '';
  codigoClasse: number | null = null;
  codigoOrgaoJulgador: number | null = null;
  searchOption: string = '';
  size: number = 10;
  nextTrf: number = 1;
  searchAfter: number | undefined;
  isLoading: boolean = false;

  constructor(
    private router: Router
  ){}

  ngOnInit() {
    this.clearFields();
  }

  clearFields() {
    this.numeroProcesso = '';
    this.codigoClasse = 0;
    this.codigoOrgaoJulgador = 0;
  }

  goToSearchResults() {
    this.router.navigate(['/search-results'], {
      queryParams: {
        numeroProcesso: this.numeroProcesso,
        codigoClasse: this.codigoClasse,
        codigoOrgaoJulgador: this.codigoOrgaoJulgador,
        size: this.size,
        nextTrf: this.nextTrf,
        searchAfter: this.searchAfter
    }});
  }

  setCursorToStart(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.setSelectionRange(0, 0);
  }

  selectRadioButtonNumero(): void {
    this.searchOption = 'numero';
    this.clearFields();
  }

  selectRadioButtonclasseEOrgao(): void {
    this.searchOption = 'classeEOrgao';
    this.clearFields();
  }

  // Verifica se o botão deve ser habilitado
  get isButtonEnabled(): boolean {
    if (this.searchOption === 'numero') {
      return this.numeroProcesso.replace(/\D/g, '').length === 20;
    } else if (this.searchOption === 'classeEOrgao') {
      const classeLength = this.codigoClasse ? this.codigoClasse.toString().replace(/\D/g, '').length : 0;
      const orgaoLength = this.codigoOrgaoJulgador ? this.codigoOrgaoJulgador.toString().replace(/\D/g, '').length : 0;
      return classeLength >= 1 && orgaoLength >= 1;
    }
    return false;
  }

}
