import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiderService {
  private rootURL: string = "https://racehero.io/api/v1/public/sanctioning_organizations/ama/";
  constructor(private http: HttpClient) {}

  // returns a list of racers
  public getRacerList(racerName: string): Observable<any> {
    let url =
      `${this.rootURL}search/racers?query=` +
      racerName;
    return this.http.get(url);
  }

  // returns profile, runs(race results), and years raced
  public getRacerProfile(slug: string): Observable<any> {
    let url =
      `${this.rootURL}racers/` +
      slug +
      '/profile';
    return this.http.get(url);
  }

  // returns all races and points for a given rider
  public getResults(slug: string): Observable<any> {
    let url =
      `${this.rootURL}racers/` +
      slug +
      '?include=results,points&is_proam=false';
    return this.http.get(url);
  }

  // returns results of a specifc class on a specific event/race
  public getClassDetailsByEvent(classSlug: string): Observable<any> {
    let url =
      `${this.rootURL}runs/` +
      classSlug;
    return this.http.get(url);
  }
}
