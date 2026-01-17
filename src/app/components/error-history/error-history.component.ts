import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorLogService } from '../../services/errorLog.service';
import { ErrorLog } from '../../models/errorLog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-history',
  templateUrl: './error-history.component.html',
  styleUrls: ['./error-history.component.css']
})
export class ErrorHistoryComponent implements OnInit, OnDestroy {
  logs: ErrorLog[] = [];
  loading = false;
  error = '';

  private sub?: Subscription;

  constructor(private logService: ErrorLogService) {}

  ngOnInit(): void {
    this.loadErrors();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadErrors(): void {
    this.loading = true;
    this.error = '';

    this.sub = this.logService.getErrors().subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Greška pri učitavanju';
        this.loading = false;
        console.error('Error loading logs:', err);
      }
    });
  }

  refresh(): void {
    this.loadErrors();
  }
}
