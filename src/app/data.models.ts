export interface Game {
  id: number;
  date: Date;
  home_team: Team;
  home_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string;
  visitor_team: Team;
  visitor_team_score: number;
}

export interface Team extends League {
  id: number;
  abbreviation: string;
  city: string;
  full_name: string;
  name: string;
}

export interface Stats {
  wins: number;
  losses: number;
  averagePointsScored: number;
  averagePointsConceded: number;
  lastGames: Result[];
}

export interface League {
  conference: Conference;
  division: Division;
}

export type Conference = "West" | "East";

export type Division = "Atlantic" | "Central" | "Southeast " | "Northwest" | "Pacific" | "Southwest";

export type Result = "W" | "L";
