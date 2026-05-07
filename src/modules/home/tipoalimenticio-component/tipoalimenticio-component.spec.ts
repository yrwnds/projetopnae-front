import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoalimenticioComponent } from './tipoalimenticio-component';

describe('TipoalimenticioComponent', () => {
  let component: TipoalimenticioComponent;
  let fixture: ComponentFixture<TipoalimenticioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoalimenticioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoalimenticioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
