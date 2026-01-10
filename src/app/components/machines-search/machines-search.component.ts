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
  scheduledDate: string = '';
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

  // onSubmit() {
  //   this.error = '';
  //   this.submitting = true;
  //
  //   try {
  //     const v = this.form.value;
  //     const selectedStates = this.allStates.filter((_, i) => this.statesArray.value[i]);
  //     this.rows = this.store.search({
  //       name: v.name ?? '',
  //       ownerEmail: v.ownerEmail ?? '',
  //       states: selectedStates,
  //       fromDate: v.fromDate ?? '',
  //       toDate: v.toDate ?? ''
  //     });
  //   } catch (e: any) {
  //     this.error = e?.message ?? 'Greska pri pretrazi';
  //   } finally {
  //     this.submitting = false;
  //   }
  // }
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

      // NEMA this.rows = ...
      // rows se automatski puni preko this.store.machines$ subscribe-a
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'Greska pri pretrazi';
    } finally {
      this.submitting = false;
    }
  }


  // reset() {
  //   this.form.reset({
  //     name: '',
  //     ownerEmail: '',
  //     states: this.allStates.map(() => false),
  //     fromDate: '',
  //     toDate: ''
  //   });
  //   this.rows = this.store.listVisible();
  // }
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
      await this.store.refresh(); // vrati sve (za usera ili admina)
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
