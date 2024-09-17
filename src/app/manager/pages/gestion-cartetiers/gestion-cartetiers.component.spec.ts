import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionCartetiersComponent } from './gestion-cartetiers.component';

describe('GestionCartetiersComponent', () => {
  let component: GestionCartetiersComponent;
  let fixture: ComponentFixture<GestionCartetiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCartetiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCartetiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
