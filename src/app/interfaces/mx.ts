export interface Rider {
  city: string;
  hometown: string;
  id: number;
  ama_num: string;
  class: string;
  rider_id: string;
  name: string;
  slug: string;
  state: string;
}

export interface RiderProfile {
  slug: string;
  id: number;
  birthdate: Date;
  firstName: string;
  lastName: string;
  hometown: string;
  city: string;
  state: string;
  ama_num: string;
  class: string;
  sponsors: string[];
  username: string;
  raceResults: Race[];
}

export interface Race {
  externalId: string;
  id: number;
  className: string;
  resultsId: number;
  moto1: string;
  moto2: string;
  moto3: string;
  points: string;
  overallFinish: number;
}
