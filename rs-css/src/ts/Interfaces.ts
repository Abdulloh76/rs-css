export interface Ball {
  id?: number;
  class?: string;
  position: number[];
}

export interface Hole {
  id?: string;
  class: string;
}

export interface Level {
  id: number;
  title: string;
  selector: string;
  carpet: Ball[][]; // there would be four arrays as four quarters and balls in each quarter
  holes: Hole[];
}

// export interface LevelsProgress {

// }
