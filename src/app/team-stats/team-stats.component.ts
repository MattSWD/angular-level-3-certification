import { Component, Input, OnInit } from "@angular/core";
import { tap } from "rxjs";
import { NbaService } from "../nba.service";
import { Stats, Team } from "../data.models";

@Component({
  selector: "app-team-stats",
  templateUrl: "./team-stats.component.html",
  styleUrls: ["./team-stats.component.css"],
})
export class TeamStatsComponent implements OnInit {
  @Input()
  team!: Team;

  stats!: Stats;

  days: number[] = [6, 12, 20];
  selectedRange: number = this.days[1];
  loadingResult: boolean = false;

  constructor(protected nbaService: NbaService) {}

  ngOnInit(): void {
    this.getLastResults();
  }

  getLastResults() {
    this.loadingResult = true;
    this.nbaService
      .getLastResults(this.team, this.selectedRange)
      .pipe(tap((games) => (this.stats = this.nbaService.getStatsFromGames(games, this.team))))
      .subscribe({
        error: () => (this.loadingResult = false),
        complete: () => (this.loadingResult = false),
      });
  }
}
