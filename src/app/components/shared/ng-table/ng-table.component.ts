import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ng-table',
  imports: [MatTableModule],
  templateUrl: './ng-table.component.html',
  styleUrl: './ng-table.component.css',
})
export class NgTableComponent {
  @Input() colSource: string[] = [];
  @Input() dataSource: any[] = [];
}
