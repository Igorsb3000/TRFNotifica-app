import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NaoEncontradaComponent } from './nao-encontrada.component';

describe('NaoEncontradaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        NaoEncontradaComponent
      ],
    }).compileComponents();
  });

  it('Cria Página não encontradas', () => {
    const fixture = TestBed.createComponent(NaoEncontradaComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
