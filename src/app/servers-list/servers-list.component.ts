import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Server } from "../interface/server";
import { ServerItemComponent } from "../server-item/server-item.component";

@Component({
  selector: "app-servers-list",
  standalone: true,
  templateUrl: "./servers-list.component.html",
  styleUrl: "./servers-list.component.scss",
  imports: [CommonModule, ServerItemComponent]
})
export class ServersListComponent {
  @Input() serversList: Server[] = [];
  @Output() pingServerEvent = new EventEmitter<string>();

  pingServer(ipAddress: string) {
    this.pingServerEvent.emit(ipAddress);
  }
}
