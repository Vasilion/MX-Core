import { Component } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Race, Rider, RiderProfile } from 'src/app/interfaces/mx';
import { RiderService } from 'src/app/services/rider.service';

@Component({
  selector: 'app-rider-search',
  templateUrl: './rider-search.component.html',
  styleUrls: ['./rider-search.component.scss'],
})
export class RiderSearchComponent {
  searchQuery: string = '';
  riderSelected: boolean = false;
  riders: Rider[] = []; //add types later
  riderProfile: RiderProfile | null = null;
  showSuccess!: boolean;
  showFailure!: boolean;

  constructor(private riderService: RiderService) {}

  public get searchResultMessage(): string {
    return `Showing results for ${this.searchQuery}`;
  }

  public get failedResultMessage(): string {
    return `No results for ${this.searchQuery}`;
  }

  public setOpenSuccess(isOpen: boolean): void {
    this.showSuccess = isOpen;
  }

  public setOpenFailure(isOpen: boolean): void {
    this.showFailure = isOpen;
  }

  public getRiders(search: string): void {
    this.riderSelected = false;
    this.riderService
      .getRacerList(search)
      .pipe(
        switchMap((ridersResult): Observable<any> => {
          if (
            !ridersResult ||
            !ridersResult.data ||
            ridersResult.data.length === 0
          ) {
            this.showFailure = true;
          } else {
            this.showSuccess = true;
          }
          if (ridersResult.data.length === 1) {
            const profile = ridersResult.data.find((): boolean => true);
            return this.riderProfileRequest(profile.slug);
          } // Map the response to the Rider interface
          this.riders = ridersResult.data.map((riderData: any) => ({
            city: riderData.city,
            hometown: riderData.hometown,
            id: riderData.id,
            ama_num: riderData.meta.ama_num,
            class: riderData.meta.levels.MX,
            rider_id: riderData.rider_id,
            name: riderData.name,
            slug: riderData.slug,
            state: riderData.state,
          }));
          return of(null);
        })
      )
      .subscribe((raceResults: Race[]): void => {
        if (this.riderProfile) {
          this.riderProfile.raceResults = raceResults;
        }
      });
  }

  public getRiderProfile(slug: string): void {
    this.riderProfileRequest(slug).subscribe({
      next: (raceResults: Race[]) => {
        if (this.riderProfile) {
          this.riderProfile.raceResults = raceResults;
        }
      },
      error: (err) => {
        console.error('Error fetching rider profile or race results:', err);
      },
    });
  }

  public getRaceResults(riderSlug: string) {
    return this.riderService.getResults(riderSlug).pipe(
      switchMap((raceResultsResponse: any) => {
        // Transform the results to match the Race[] structure
        const riderRaces: Race[] = raceResultsResponse.results.map(
          (raceData: any) => ({
            id: raceData.id,
            className: raceData.racer_class,
            moto1: raceData.meta.moto1Finish,
            moto2: raceData.meta.moto2Finish,
            moto3: raceData.meta.moto3Finish,
            points: raceData.meta.points,
            overallFinish: raceData.position_in_class,
            eventName: raceData.event.name,
            venueName: raceData.event.venue.name,
          })
        );

        this.riderProfile!.raceResults = riderRaces;

        return of(riderRaces);
      })
    );
  }

  private riderProfileRequest(slug: string): Observable<any> {
    return this.riderService.getRacerProfile(slug).pipe(
      tap(() => (this.riderSelected = false)),
      switchMap((riderProfileResult: any) => {
        // Assign rider profile information
        this.riderProfile = {
          slug: riderProfileResult.profile.slug,
          id: riderProfileResult.profile.id,
          birthdate: riderProfileResult.profile.birthdate,
          firstName: riderProfileResult.profile.first_name,
          lastName: riderProfileResult.profile.last_name,
          hometown: riderProfileResult.profile.hometown,
          city: riderProfileResult.profile.city,
          state: riderProfileResult.profile.state,
          ama_num: riderProfileResult.profile.meta.ama_num,
          class: riderProfileResult.profile.meta.levels.MX,
          sponsors: riderProfileResult.profile.sponsors,
          username: riderProfileResult.profile.username,
          raceResults: [], // Initially empty, to be populated with the next service call
        };

        // Switch to getRaceResults after setting the rider profile
        return this.getRaceResults(riderProfileResult.profile.slug).pipe(
          tap(() => (this.riderSelected = true))
        );
      })
    );
  }
}
