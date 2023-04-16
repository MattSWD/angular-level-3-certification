import { Component, ElementRef, HostListener, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "[app-dialog]",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class DialogComponent {
  @Input() title: string;

  constructor(private host: ElementRef) {}

  showModal() {
    this.host.nativeElement.showModal();
  }

  close() {
    this.host.nativeElement.close();
  }

  @HostListener("click", ["$event"])
  onDialogClick(event: MouseEvent) {
    if ((event.target as any).nodeName === "DIALOG") {
      this.close();
    }
  }
}
