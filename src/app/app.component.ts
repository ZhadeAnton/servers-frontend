import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ServerService } from "./service/server.service";
import { Observable, catchError, map, of, startWith } from "rxjs";
import { AppState } from "./interface/app-state";
import { CustomResponse } from "./interface/custom-response";
import { DataState } from "./enums/data-state.enum";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  providers: [ServerService],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit {
  title = "servers-front";
  appState$: Observable<AppState<CustomResponse>>;

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE, appData: null }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }
}
