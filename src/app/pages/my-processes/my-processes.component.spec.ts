import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProcessesComponent } from './my-processes.component';

describe('MyProcessesComponent', () => {
  let component: MyProcessesComponent;
  let fixture: ComponentFixture<MyProcessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyProcessesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
