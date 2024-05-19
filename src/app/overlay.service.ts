import { Injectable, Injector, ComponentRef, ApplicationRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { QuestionsAddOverlayComponent } from './overlays/questions-add-overlay/questions-add-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private injector: Injector, private appRef: ApplicationRef) {}

  open() {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });

    const overlayPortal = new ComponentPortal(QuestionsAddOverlayComponent);
    this.overlayRef.attach(overlayPortal);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
