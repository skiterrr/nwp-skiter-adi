import { Component, OnInit } from '@angular/core';
import { ErrorLogService } from '../../services/errorLog.service';
import { ErrorLog } from '../../models/errorLog';

@Component({
  selector: 'app-error-history',
  templateUrl: './error-history.component.html',
  styleUrls: ['./error-history.component.css']
})
export class ErrorHistoryComponent implements OnInit {
  logs: ErrorLog[] = [];

  constructor(private logService: ErrorLogService) {}

  ngOnInit() {
    this.logs = this.logService.list();
  }
}
