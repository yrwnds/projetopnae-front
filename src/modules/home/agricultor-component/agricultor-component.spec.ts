import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultorComponent } from './agricultor-component';

describe('AgricultorComponent', () => {
  let component: AgricultorComponent;
  let fixture: ComponentFixture<AgricultorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgricultorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgricultorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
