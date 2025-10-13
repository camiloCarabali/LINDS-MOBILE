import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JobService } from '../../services';
import { BackendJob, LoadingState } from '../../interfaces';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit, OnDestroy {

  jobs: BackendJob[] = [];
  filteredJobs: BackendJob[] = [];
  searchTerm: string = '';
  loadingState: LoadingState = { isLoading: false };
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.initializeData();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.jobService.availableJobs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(jobs => {
        this.jobs = jobs;
        this.applyCurrentFilter();
      });

    this.jobService.loadingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loadingState => {
        this.loadingState = loadingState;
      });

    this.jobService.getAvailableJobs().subscribe();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.applyCurrentFilter();
      });
  }

  filterJobs(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.searchSubject.next(searchTerm);
  }

  private applyCurrentFilter(): void {
    if (this.searchTerm === '') {
      this.filteredJobs = [...this.jobs];
    } else {
      this.filteredJobs = this.jobs.filter(job => 
        job.titulo.toLowerCase().includes(this.searchTerm) ||
        job.descripcion.toLowerCase().includes(this.searchTerm) ||
        job.origen.toLowerCase().includes(this.searchTerm) ||
        job.destino.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  applyForJob(job: BackendJob): void {
    if (this.loadingState.isLoading) return;

    this.jobService.applyToJob(job.id).subscribe({
      next: () => {
        console.log('Application successful');
      },
      error: (error) => {
        console.error('Application failed:', error);
      }
    });
  }

  viewJobDetails(job: BackendJob): void {
    console.log('Ver detalles del trabajo:', job);
  }

  refreshJobs(): void {
    this.jobService.getAvailableJobs().subscribe();
  }

  getPaymentText(job: BackendJob): string {
    return `$${job.precio.toLocaleString()}`;
  }
}