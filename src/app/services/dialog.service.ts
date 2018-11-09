import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(
        private readonly dialog: MatDialog) { }

    public open<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, data: any) {
        const config: MatDialogConfig = {
            height: 'auto',
            width: 'auto',
            maxHeight: 'calc(100vh - 1.4rem)',
            maxWidth: 'calc(100vw - 1.4rem)',
            data: data,
            autoFocus: false,
            panelClass: 'dialog-container',
            backdropClass: 'dialog-backdrop',
            hasBackdrop: true
        };

        return this.dialog.open(componentOrTemplateRef, config);
    }
}
