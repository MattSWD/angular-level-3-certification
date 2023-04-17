import { Component, OnDestroy, OnInit } from "@angular/core";
import { Conference, Division, Team } from "../shared/models/data.models";
import { Observable, of, Subject, takeUntil, tap } from "rxjs";
import { NbaService } from "../nba.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DAYS_INTERVAL } from "../shared/constants/constants";

@Component({
  selector: "app-game-stats",
  templateUrl: "./game-stats.component.html",
  styleUrls: ["./game-stats.component.css"],
})
export class GameStatsComponent implements OnInit, OnDestroy {
  protected _onDestroy: Subject<void> = new Subject<void>();

  teams$: Observable<Team[]>;
  division$: Observable<Division[]>;

  allTeams: Team[] = [];
  allConference: Conference[] = ["West", "East"];
  teamsFilteringForm: FormGroup = new FormGroup<any>([]);

  constructor(protected nbaService: NbaService, private formBuilder: FormBuilder) {
    this.teams$ = nbaService.getAllTeams().pipe(tap((data: Team[]) => (this.allTeams = data)));
  }

  ngOnInit() {
    this.creatingTeamsFilteringForm();
    this.onConferenceChange();
    this.onDivisionChange();
  }

  creatingTeamsFilteringForm(): void {
    this.teamsFilteringForm = this.formBuilder.group({
      conference: new FormControl<Conference>(null),
      division: new FormControl<Division>({
        value: null,
        disabled: true,
      }),
      team: new FormControl<Team>(null, { validators: Validators.required }),
      days: new FormControl<number>(DAYS_INTERVAL[1]),
    });
  }

  onConferenceChange(): void {
    this.teamsFilteringForm
      .get("conference")
      .valueChanges.pipe(
        tap(() => (this.teamsFilteringForm.get("division") as FormControl<Division>).reset()),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: () => {
          if (this.teamsFilteringForm.get("conference").value) {
            this.division$ = this.nbaService.getDivisionsByConference(this.teamsFilteringForm.get("conference").value);
            (this.teamsFilteringForm.get("division") as FormControl<Division>).enable();
          }
        },
      });
  }

  onDivisionChange(): void {
    this.teamsFilteringForm
      .get("division")
      .valueChanges.pipe(
        tap(() => (this.teamsFilteringForm.get("team") as FormControl<Team>).reset()),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: () => {
          this.getFilteredTeam();
        },
      });
  }

  getFilteredTeam(): void {
    const selectedConference: Conference = this.teamsFilteringForm.get("conference").value;
    const selectedDivision: Division = this.teamsFilteringForm.get("division").value;
    let filteredTeams: Team[] = [...this.allTeams];

    if (selectedConference) {
      filteredTeams = filteredTeams.filter((team: Team) => team.conference == selectedConference);
    }
    if (selectedDivision) {
      filteredTeams = filteredTeams.filter((team: Team) => team.division == selectedDivision);
    }
    this.teams$ = of(filteredTeams);
  }

  trackTeam(): void {
    this.nbaService.addTrackedTeam(this.teamsFilteringForm.get("team").value as Team);
    (this.teamsFilteringForm.get("division") as FormControl<Division>).disable();
    (this.teamsFilteringForm.get("conference") as FormControl<Conference>).reset();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected readonly DAYS_INTERVAL = DAYS_INTERVAL;
}
