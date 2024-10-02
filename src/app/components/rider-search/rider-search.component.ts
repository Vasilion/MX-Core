import { Component, OnInit } from '@angular/core';
import { Race, Rider, RiderProfile } from 'src/app/interfaces/mx';
import { RiderService } from 'src/app/services/rider.service';

@Component({
  selector: 'app-rider-search',
  templateUrl: './rider-search.component.html',
  styleUrls: ['./rider-search.component.scss'],
})
export class RiderSearchComponent implements OnInit {
  searchQuery: string = '';
  riderSelected: boolean = false;
  riders: Rider[] = []; //add types later
  riderProfile: RiderProfile | null = null;

  constructor(private riderService: RiderService) {}

  ngOnInit() {}

  public getRiders(search: string): void {
    this.riderSelected = false;
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
    });
  }

  public getRiderProfile(slug: string): void {
    this.riderService.getRacerProfile(slug).subscribe((riderProfileResult) => {
      this.riderSelected = true;
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
        raceResults: [],
      };

      let riderRaces: Race[] = riderProfileResult.runs.map((raceData: any) => ({
        externalId: raceData.external_id,
        id: raceData.id,
        className: raceData.name,
        resultsId: raceData.results[0].id,
        moto1: raceData.results[0].meta.moto1Finish,
        moto2: raceData.results[0].meta.moto2Finish,
        moto3: raceData.results[0].meta.moto3Finish,
        points: raceData.results[0].meta.points,
        overallFinish: raceData.results[0].position_in_class,
      }));

      if (this.riderProfile) {
        this.riderProfile.raceResults = riderRaces;
      }

      console.log(riderProfileResult);
    });
  }
}
