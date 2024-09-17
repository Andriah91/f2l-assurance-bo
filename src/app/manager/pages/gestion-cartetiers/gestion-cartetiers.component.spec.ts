/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionCartetiersComponent } from './gestion-cartetiers.component';

describe('GestionCartetiersComponent', () => {
  let component: GestionCartetiersComponent;
  let fixture: ComponentFixture<GestionCartetiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCartetiersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCartetiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
