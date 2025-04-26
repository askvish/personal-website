import { Component } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import Tesseract from 'tesseract.js';
import { jsPDF } from 'jspdf';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-document-scanner',
  imports: [CommonModule, WebcamModule],
  templateUrl: './document-scanner.component.html',
  styleUrl: './document-scanner.component.css',
})
export class DocumentScannerComponent {
  videoWidth = 640;
  videoHeight = 480;

  cameraVisible = false; // Controls visibility of the camera
  capturedImage: string | null = null;
  extractedText: string | null = null;
  loading = false; // Controls the loading animation

  private trigger: Subject<void> = new Subject<void>();

  // Start scanning (show camera)
  startScanning(): void {
    this.cameraVisible = true;
    this.extractedText = null;
    this.capturedImage = null;
  }

  // Capture image from webcam
  captureImage(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage.imageAsDataUrl;
    this.cameraVisible = false;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  performOCR(): void {
    if (this.capturedImage) {
      this.loading = true;
      this.extractedText = null;
      Tesseract.recognize(this.capturedImage, 'eng', {
        logger: (info) => console.log(info), // Log progress
      })
        .then(({ data }) => (this.extractedText = data.text))
        .catch((error) => console.error('OCR Error:', error))
        .finally(() => (this.loading = false));
    }
  }

  // Save as PDF
  saveAsPDF(): void {
    if (this.capturedImage) {
      const pdf = new jsPDF();
      pdf.addImage(this.capturedImage, 'JPEG', 10, 10, 180, 160);
      pdf.text('Extracted Text:', 10, 180);
      if (this.extractedText) {
        pdf.text(this.extractedText, 10, 190);
      }
      pdf.save('scanned-document.pdf');
    }
  }
}
