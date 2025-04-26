import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CheatSheetItem } from '../shared/model/cheat-sheet-item';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-cheat-sheet-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cheat-sheet-card.component.html',
  styleUrl: './cheat-sheet-card.component.css',
})
export class CheatSheetCardComponent {
  constructor(private dialog: MatDialog) {}

  @Input() item!: CheatSheetItem;

  /**
   * Opens a dialog with the given type.
   *
   * @param type the type of dialog to open
   */
  openDialog(type: string): void {
    this.dialog.open(DialogComponent, {
      data: { type }, // Pass the value to the dialog
      width: '90%', // Set width to 90%
      maxHeight: '90vh', // Limit height to make it scrollable
      panelClass: 'custom-dialog-container', // Add a custom class for further styling
    });
  }
}
