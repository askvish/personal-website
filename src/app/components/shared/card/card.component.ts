import { Component, Input } from '@angular/core';
import { ItemModel } from '../model/item-model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() item!: ItemModel;

  /**
   * Opens a link in a new tab
   * @param link The link to open
   */
  openLink(link: string) {
    if (link.startsWith('http')) window.open(link, '_blank');
    else window.location.href = link;
  }
}
