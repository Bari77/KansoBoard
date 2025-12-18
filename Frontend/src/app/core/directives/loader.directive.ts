import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { inject, Injectable } from "@angular/core";
import { LoaderComponent } from "../layout/loader/components/loader/loader.component";

@Injectable({ providedIn: 'root' })
export class GlobalLoaderOverlayDirective {
    private readonly overlay = inject(Overlay);
    private overlayRef?: OverlayRef;

    public show(): void {
        if (this.overlayRef) return;

        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'loader-backdrop',
            positionStrategy: this.overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically()
        });

        this.overlayRef.attach(new ComponentPortal(LoaderComponent));
    }

    public hide(): void {
        this.overlayRef?.dispose();
        this.overlayRef = undefined;
    }
}
