import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-viewer',
  imports: [],
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './markdown-viewer.component.css',
})
export class MarkdownViewerComponent {
  markdownContent: SafeHtml | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadMarkdown('/assets/mds/Markdown-basic.md'); // Path to your Markdown file
  }

  loadMarkdown(filePath: string): void {
    this.http
      .get(filePath, { responseType: 'text' })
      .subscribe((data: string) => {
        if (typeof data === 'string') {
          const rawHtml: string = marked(data).toString(); // Convert Markdown to HTML
          this.markdownContent =
            this.sanitizer.bypassSecurityTrustHtml(rawHtml); // Sanitize HTML
        }
      });
  }
}
