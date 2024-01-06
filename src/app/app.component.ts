import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ServerService } from "./service/server.service";
import { BehaviorSubject, Observable, catchError, map, of, startWith } from "rxjs";
import { AppState } from "./interface/app-state";
import { CustomResponse } from "./interface/custom-response";
import { DataState } from "./enums/data-state.enum";
import { ServersListComponent } from "./servers-list/servers-list.component";
import { ServerItemComponent } from "./server-item/server-item.component";
import { Status } from "./enums/status.enum";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  providers: [ServerService],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    ServersListComponent,
    ServerItemComponent,
    ReactiveFormsModule
  ]
})
export class AppComponent implements OnInit {
  title = "servers-front";
  appState$: Observable<AppState<CustomResponse>>;
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  readonly DataState = DataState;
  readonly Status = Status;

  selectedStatus = new FormControl(Status.ALL);

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response) => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE, appData: null }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  pingServer(ipAddress: string): void {
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((response) => {
        const index = this.dataSubject.value.data.servers.findIndex(
          (server) => server.id === response.data.server.id
        );
        this.dataSubject.value.data.servers[index] = response.data.server;
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value };
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value).pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }
}
