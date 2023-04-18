import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { tap } from "rxjs";
import { NbaService } from "../nba.service";
import { Stats, Team } from "../shared/models/data.models";
import { DAYS_INTERVAL } from "../shared/constants/constants";

@Component({
  selector: "app-team-stats",
  templateUrl: "./team-stats.component.html",
  styleUrls: ["./team-stats.component.css"],
})
export class TeamStatsComponent implements OnInit, OnChanges {
  @Input() team!: Team;
  @Input("selectedRange") selectedRange: number = DAYS_INTERVAL[1];
  @Output() calculateTeamsList: EventEmitter<void> = new EventEmitter<void>();

  stats!: Stats;
  loadingResult: boolean = false;
  protected readonly DAYS_INTERVAL: number[] = DAYS_INTERVAL;

  constructor(protected nbaService: NbaService) {}

  ngOnInit(): void {
    this.getLastResults();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getLastResults();
  }

  getLastResults() {
    this.loadingResult = true;
    this.nbaService
      .getLastResults(this.team, this.selectedRange)
      .pipe(tap((games) => (this.stats = this.nbaService.getStatsFromGames(games, this.team))))
      .subscribe({
        error: () => {
          this.loadingResult = false;
        },
        complete: () => {
          this.loadingResult = false;
        },
      });
  }

  removeTeamAndCalculate(team: Team) {
    this.nbaService.removeTrackedTeam(team);
    this.calculateTeamsList.emit();
  }
}
