import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Server } from "../interface/server";
import { Status } from "../enums/status.enum";

@Component({
  selector: "app-server-item",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./server-item.component.html",
  styleUrl: "./server-item.component.scss"
})
export class ServerItemComponent {
  @Input() serverItem: Server = null;
  @Output() pingServerEvent = new EventEmitter<string>();
  readonly Status = Status;

  pingServer(ipAddress: string) {
    this.pingServerEvent.emit(ipAddress);
  }
}
