import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAerolineasComponent } from './home-aerolineas.component';

describe('HomeAerolineasComponent', () => {
  let component: HomeAerolineasComponent;
  let fixture: ComponentFixture<HomeAerolineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAerolineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAerolineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
