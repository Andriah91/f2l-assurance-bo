/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionAdministrateurComponent } from './gestion-administrateur.component';

describe('GestionServicesComponent', () => {
    let component: GestionAdministrateurComponent;
    let fixture: ComponentFixture<GestionAdministrateurComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionAdministrateurComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionAdministrateurComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
