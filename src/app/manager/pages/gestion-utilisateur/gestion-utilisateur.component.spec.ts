/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionServicesComponent } from './gestion-utilisateur.component';

describe('GestionServicesComponent', () => {
    let component: GestionServicesComponent;
    let fixture: ComponentFixture<GestionServicesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionServicesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
