export interface Ball {
  id?: number;
  class?: string;
  position: number[];
}

export interface Hole {
  id?: string;
  class?: string;
}

export interface Quarter {
  class?: string;
  id?: string;
  balls?: Ball[];
}

export interface Level {
  id: number;
  title: string;
  selector: string;
  description: string;
  carpet: Quarter[]; // there would be four arrays as four quarters and balls in each quarter
  holes: Hole[];
}
