import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditalComponent } from './edital-component';

describe('EditalComponent', () => {
  let component: EditalComponent;
  let fixture: ComponentFixture<EditalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
