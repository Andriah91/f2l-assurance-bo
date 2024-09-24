import { GestionAdministrateurComponent } from '../gestion-administrateur/gestion-administrateur.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing'; 
import { DebugElement } from '@angular/core';
import { GestionCarteComponent } from './gestion-carte.component';
  

describe('GestionNotificationComponent', () => {
    let component: GestionCarteComponent;
    let fixture: ComponentFixture<GestionCarteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionCarteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionCarteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
