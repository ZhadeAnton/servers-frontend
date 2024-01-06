import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { CustomResponse } from "../interface/custom-response";
import { Server } from "../interface/server";
import { apiUrl } from "../api/url";
import { Status } from "../enums/status.enum";

@Injectable({
  providedIn: "root"
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

  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      switch (status) {
        case Status.SERVER_UP:
        case Status.SERVER_DOWN: {
          const copyOfResponseData = Object.assign({}, response.data);
          const filteredServers = copyOfResponseData.servers.filter(
            (server) => server.status === status
          );

          subscriber.next({
            ...response,
            data: { ...copyOfResponseData, servers: filteredServers }
          });
          break;
        }
        case Status.ALL:
        default:
          {
            subscriber.next({ ...response });
          }
          subscriber.complete();
      }
    });

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
