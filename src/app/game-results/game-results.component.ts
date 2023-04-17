import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NbaService } from "../nba.service";
import { Game, Team } from "../shared/models/data.models";
import { Observable, Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"],
})
export class GameResultsComponent implements OnInit, OnDestroy {
  team?: Team;
  games$?: Observable<Game[]>;
  selectedRange: number = 12;

  protected _onDestroy: Subject<void> = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private nbaService: NbaService) {
    this.activatedRoute.paramMap.pipe(takeUntil(this._onDestroy)).subscribe((paramMap) => {
      this.team = this.nbaService.getTrackedTeams().find((team) => team.abbreviation === paramMap.get("teamAbbr"));
    });
  }

  ngOnInit(): void {
    this.getQueryParamsFromUrl();
  }

  getQueryParamsFromUrl(): void {
    this.activatedRoute.queryParamMap?.pipe(takeUntil(this._onDestroy)).subscribe({
      next: (queryParam: ParamMap) => {
        this.selectedRange = queryParam.get("selectedRange") as unknown as number;
        if (this.team) {
          this.games$ = this.nbaService.getLastResults(this.team, this.selectedRange);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
