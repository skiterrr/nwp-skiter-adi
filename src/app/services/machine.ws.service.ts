import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { Machine } from '../models/machine';

@Injectable({ providedIn: 'root' })
export class MachineWsService {
  private client?: Client;
  private updates$ = new Subject<Machine>();

  connect(): void {
    if (this.client?.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws`),
      reconnectDelay: 3000,
      debug: () => {},
    });

    this.client.onConnect = () => {
      this.client?.subscribe('/topic/machines', (msg: IMessage) => {
        try {
          const machine: Machine = JSON.parse(msg.body);
          this.updates$.next(machine);
        } catch {
        }
      });
    };

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = undefined;
  }

  machineUpdates(): Observable<Machine> {
    return this.updates$.asObservable();
  }
}
