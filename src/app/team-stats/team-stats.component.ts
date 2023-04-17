import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { tap } from "rxjs";
import { NbaService } from "../nba.service";
import { Stats, Team } from "../shared/models/data.models";
import { DAYS_INTERVAL } from "../shared/constants/constants";

@Component({
  selector: "app-team-stats",
  templateUrl: "./team-stats.component.html",
  styleUrls: ["./team-stats.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamStatsComponent implements OnInit, OnChanges {
  @Input() team!: Team;
  stats!: Stats;

  @Input("selectedRange") selectedRange: number = DAYS_INTERVAL[1];
  loadingResult: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, protected nbaService: NbaService) {}

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
          this.changeDetectorRef.markForCheck();
        },
        complete: () => {
          this.loadingResult = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  protected readonly DAYS_INTERVAL = DAYS_INTERVAL;
}
