export interface ErrorLog {
  id: number;
  machineId: number;
  timestamp: string;
  machineName: string;
  operation: string;
  errorMessage: string;
}
