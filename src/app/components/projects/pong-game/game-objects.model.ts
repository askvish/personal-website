export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface GameObject {
  position: Position;
  dimensions: Dimensions;
  velocity?: Position;
  color: string;
}

export interface GameState {
  ball: GameObject;
  paddles: GameObject[];
  scores: number[];
  playing: boolean;
  gameBoundary: Dimensions;
  difficulty: string;
}
