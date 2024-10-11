import { Component, OnInit, ViewChild } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { Race, Rider, RiderProfile } from 'src/app/interfaces/mx';
import { RiderService } from 'src/app/services/rider.service';

@Component({
  selector: 'app-rider-search',
  templateUrl: './rider-search.component.html',
  styleUrls: ['./rider-search.component.scss'],
})
export class RiderSearchComponent implements OnInit {
  isLoading = false;
  searchQuery: string = '';
  eventResult: any = [];
  riderSelected: boolean = false;
  riders: Rider[] = []; //add types later
  riderProfile: RiderProfile | null = null;

  constructor(private riderService: RiderService) {}

  ngOnInit() {}

  public getRiders(search: string): void {
    this.riderSelected = false;
    this.isLoading = true;
    this.riderService.getRacerList(search).subscribe((ridersResult) => {
      // Map the response to the Rider interface
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
      this.isLoading = false;
    });
  }

  public getRiderProfile(slug: string): void {
    this.riderSelected = false;
    this.searchQuery = '';
    this.eventResult = [];
    this.isLoading = true;

    this.riderService
      .getRacerProfile(slug)
      .pipe(
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
          return this.getRaceResults(riderProfileResult.profile.slug);
        })
      )
      .subscribe({
        next: (raceResults: Race[]) => {
          if (this.riderProfile) {
            this.riderProfile.raceResults = raceResults.reverse();
          }
          this.riderSelected = true; // Now the rider profile is fully loaded
          this.isLoading = false;
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
            classSlug: raceData.run.results_url.substring(
              raceData.run.results_url.lastIndexOf('/') + 1
            ),
          })
        );

        this.riderProfile!.raceResults = riderRaces;

        return of(riderRaces);
      })
    );
  }

  public getRaceDetails(classSlug: string) {
    this.riderService.getClassDetailsByEvent(classSlug).subscribe((res) => {
      this.eventResult = res.results.sort((a: any, b: any) =>
        a.position_in_class > b.position_in_class ? 1 : -1
      );
    });
  }

  public clearRaceResult(): void {
    this.eventResult = [];
  }
}
