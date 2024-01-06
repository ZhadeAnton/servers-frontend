import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { CustomResponse } from "../interface/custom-response";
import { Server } from "../interface/server";
import { apiUrl } from "../api/url";

@Injectable({
  providedIn: "root",
})
export class ServerService {
  constructor(private http: HttpClient) {}

  servers$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${apiUrl}/server/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  save$ = (server: Server) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${apiUrl}/server/save`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  ping$ = (ipAddress: string) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${apiUrl}/server/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  delete$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${apiUrl}/server/delete/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(() => new Error(`An error occured - Error code: ${error?.status}`));
  }
}
