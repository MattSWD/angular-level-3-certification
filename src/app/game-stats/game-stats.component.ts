import { Component, OnDestroy, OnInit } from "@angular/core";
import { Conference, Division, Team } from "../data.models";
import { Observable, Subject, takeUntil, tap } from "rxjs";
import { NbaService } from "../nba.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

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
  allConference: Conference[] = ["Western", "Eastern"];
  teamsFilteringForm: FormGroup = new FormGroup<any>([]);

  constructor(protected nbaService: NbaService, private formBuilder: FormBuilder) {
    this.teams$ = nbaService.getAllTeams().pipe(tap((data) => (this.allTeams = data)));
  }

  ngOnInit() {
    this.creatingTeamsFilteringForm();
    this.onConferenceChange();
  }

  creatingTeamsFilteringForm() {
    this.teamsFilteringForm = this.formBuilder.group({
      conference: new FormControl<Conference>(null),
      division: new FormControl<Division>({
        value: null,
        disabled: true,
      }),
      team: new FormControl<Team>(null),
    });
  }

  onConferenceChange() {
    this.teamsFilteringForm
      .get("conference")
      .valueChanges.pipe(
        tap(() => (this.teamsFilteringForm.get("division") as FormControl<Division>).reset()),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: () => {
          this.division$ = this.nbaService.getDivisionsByConference(this.teamsFilteringForm.get("conference").value);
          (this.teamsFilteringForm.get("division") as FormControl<Division>).enable();
        },
      });
  }

  trackTeam(teamId: string): void {
    let team: Team = this.allTeams.find((team: Team) => team.id == Number(teamId));
    if (team) this.nbaService.addTrackedTeam(team);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
