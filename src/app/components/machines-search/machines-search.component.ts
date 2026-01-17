import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {Machine, MachineState} from '../../models/machine';
import {MachineStoreService} from '../../services/machine-store.service';
import {AuthService} from "../../services/auth.service";
import {Permission} from "../../models/permission";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-machines-search',
  templateUrl: './machines-search.component.html',
  styleUrls: ['./machines-search.component.css']
})
export class MachinesSearchComponent implements OnInit {

  showScheduler = false;
  selectedMachine: Machine | null = null;
  scheduledOperation: 'START' | 'STOP' | 'RESTART' = 'START';
  scheduledDate: string = '';  // yyyy-MM-dd
  scheduledTime: string = '';  // HH:mm  ⬅️ DODAJ OVO
  private sub?: Subscription;

  canSearch = false;

  allStates: Array<'ON' | 'OFF'> = ['ON', 'OFF'];

  form = this.fb.group({
    name: [''],
    ownerEmail: [''],
    states: this.fb.array<boolean>(this.allStates.map(() => false)),
    fromDate: [''],
    toDate: ['']
  });

  submitting = false;
  error = '';
  rows = this.store.listVisible();

  constructor(
    private fb: FormBuilder,
    private store: MachineStoreService,
    public auth: AuthService
  ) {}

  get statesArray(): FormArray {
    return this.form.get('states') as FormArray;
  }

  ngOnInit(): void {
    this.sub = this.store.machines$.subscribe(list => {
      this.rows = list
    });
    this.store.connectWs()
    this.store.refresh()
    this.canSearch = this.auth.hasPermission(Permission.MACHINE_SEARCH);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.store.disconnectWs();
  }

  async onSubmit() {
    this.error = '';
    this.submitting = true;

    try {
      const v = this.form.value;

      const selectedStates = this.allStates.filter((_, i) => this.statesArray.value[i]);

      await this.store.refresh({
        name: (v.name ?? '').trim() || undefined,
        state: selectedStates.length ? selectedStates : undefined,
        dateFrom: (v.fromDate ?? '') || undefined,
        dateTo: (v.toDate ?? '') || undefined,
      });

    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'Greska pri pretrazi';
    } finally {
      this.submitting = false;
    }
  }

  async reset() {
    this.form.reset({
      name: '',
      ownerEmail: '',
      states: this.allStates.map(() => false),
      fromDate: '',
      toDate: ''
    });

    this.error = '';
    this.submitting = true;

    try {
      await this.store.refresh();
    } finally {
      this.submitting = false;
    }
  }

  start(machine: Machine) {
    this.error = '';
    this.submitting = true;

    this.store.start(machine.id)
      .then(() => {
        this.rows = this.store.listVisible();
      })
      .catch((err: string) => this.error = err)
      .finally(() => this.submitting = false);
  }

  stop(machine: Machine) {
    this.error = '';
    this.submitting = true;

    this.store.stop(machine.id)
      .then(() => {
        this.rows = this.store.listVisible();
      })
      .catch((err: string) => this.error = err)
      .finally(() => this.submitting = false);
  }

  restart(machine: Machine) {
    this.error = '';
    this.submitting = true;

    this.store.restart(machine.id)
      .then(() => {
        this.rows = this.store.listVisible();
      })
      .catch((err: string) => this.error = err)
      .finally(() => this.submitting = false);
  }

  openScheduler(m: Machine) {
    this.selectedMachine = m;
    this.scheduledOperation = 'START';

    // datetime-local format: "2026-01-17T20:30"
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // default 10 min
    this.scheduledDate = now.toISOString().slice(0, 16); // "2026-01-17T20:30"

    this.showScheduler = true;
  }

  closeScheduler() {
    this.showScheduler = false;
    this.selectedMachine = null;
  }

  async schedule() {
    if (!this.selectedMachine || !this.scheduledDate) {
      this.error = 'Morate izabrati operaciju i datum/vreme.';
      return;
    }

    const scheduledDateTime = this.scheduledDate + ':00';

    this.submitting = true;
    this.error = '';

    try {
      await this.store.schedule(
        this.selectedMachine.id,
        this.scheduledOperation,
        scheduledDateTime
      );

      alert(`Operacija ${this.scheduledOperation} zakazana za ${scheduledDateTime}`);
      this.closeScheduler();

    } catch (err: any) {
      this.error = err?.error?.message ?? err?.message ?? 'Greška pri zakazivanju';
    } finally {
      this.submitting = false;
    }
  }

  protected readonly Permission = Permission;
}
