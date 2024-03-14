/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionPersonnelComponent } from './gestion-contrat.component';

describe('GestionPersonnelComponent', () => {
    let component: GestionPersonnelComponent;
    let fixture: ComponentFixture<GestionPersonnelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionPersonnelComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionPersonnelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
