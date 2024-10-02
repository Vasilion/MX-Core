import { Component, OnInit } from '@angular/core';
import { Rider } from 'src/app/interfaces/mx';
import { RiderService } from 'src/app/services/rider.service';

@Component({
  selector: 'app-rider-search',
  templateUrl: './rider-search.component.html',
  styleUrls: ['./rider-search.component.scss'],
})
export class RiderSearchComponent implements OnInit {
  searchQuery: string = '';
  riders: Rider[] = []; //add types later

  constructor(private riderService: RiderService) {}

  ngOnInit() {}

  public getRiders(search: string): void {
    this.riderService.getRacerList(search).subscribe((ridersResult) => {
      // Map the response to the Rider interface
      this.riders = ridersResult.data.map((riderData: any) => ({
        city: riderData.city,
        hometown: riderData.hometown,
        id: riderData.id,
        ama_num: riderData.meta.ama_num,
        exception_code: riderData.meta.exception_code,
        class: riderData.meta.levels.MX,
        rider_id: riderData.rider_id,
        name: riderData.name,
        slug: riderData.slug,
        state: riderData.state,
      }));

      console.log(this.riders);
    });
  }
}
