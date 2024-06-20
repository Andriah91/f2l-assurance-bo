import { GestionAdministrateurComponent } from '../gestion-administrateur/gestion-administrateur.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionPubComponent } from './gestion-pub.component';

describe('GestionNotificationComponent', () => {
    let component: GestionPubComponent;
    let fixture: ComponentFixture<GestionPubComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionPubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionPubComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
