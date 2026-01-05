import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {Machine, MachineState} from '../../models/machine';
import {MachineStoreService} from '../../services/machine-store.service';
import {AuthService} from "../../services/auth.service";
import {Permission} from "../../models/permission";

@Component({
  selector: 'app-machines-search',
  templateUrl: './machines-search.component.html',
  styleUrls: ['./machines-search.component.css']
})
export class MachinesSearchComponent implements OnInit {

  showScheduler = false;
  selectedMachine: Machine | null = null;
  scheduledOperation: 'START' | 'STOP' | 'RESTART' = 'START';
  scheduledDate: string = '';


  canSearch = false;


  allStates = Object.values(MachineState);

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
    this.rows = this.store.listVisible();
    this.canSearch = this.auth.hasPermission(Permission.MACHINE_SEARCH);
  }

  onSubmit() {
    this.error = '';
    this.submitting = true;

    try {
      const v = this.form.value;
      const selectedStates = this.allStates.filter((_, i) => this.statesArray.value[i]);
      this.rows = this.store.search({
        name: v.name ?? '',
        ownerEmail: v.ownerEmail ?? '',
        states: selectedStates,
        fromDate: v.fromDate ?? '',
        toDate: v.toDate ?? ''
      });
    } catch (e: any) {
      this.error = e?.message ?? 'Greska pri pretrazi';
    } finally {
      this.submitting = false;
    }
  }

  reset() {
    this.form.reset({
      name: '',
      ownerEmail: '',
      states: this.allStates.map(() => false),
      fromDate: '',
      toDate: ''
    });
    this.rows = this.store.listVisible();
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
    this.scheduledDate = '';
    this.showScheduler = true;
  }

  closeScheduler() {
    this.showScheduler = false;
    this.selectedMachine = null;
  }

  schedule() {
    if (!this.selectedMachine || !this.scheduledDate) {
      this.error = 'Morate izabrati operaciju i datum.';
      return;
    }

    this.store.schedule(
      this.selectedMachine.id,
      this.scheduledOperation,
      this.scheduledDate
    );

    this.closeScheduler();
  }

  protected readonly Permission = Permission;
}
