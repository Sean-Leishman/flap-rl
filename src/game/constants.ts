import { defineComponent, Types } from "bitecs";

export const Vector2 = { x: Types.f32, y: Types.f32 };
export const Position = defineComponent(Vector2);
export const Rotation = defineComponent({ angle: Types.f32 });
export const Velocity = defineComponent(Vector2);
export const Sprite = defineComponent({
  texture: Types.ui8,
});
export const Player = defineComponent({
  dead: Types.ui8,
  alive: Types.ui8,
  input: Types.ui8,
});
export const Pipe = defineComponent({ type: Types.ui8 });
export const RecentPipe = defineComponent();
export const LastPipe = defineComponent();
export const Static = defineComponent();
export enum Direction {
  None,
  Left,
  Right,
  Up,
  Down,
}
export const Input = defineComponent({
  direction: Types.ui8,
});
export const Vision = defineComponent({
  yVel: Types.f32,
  distanceToClosestPipe: Types.f32,
  heightBelowTopPipe: Types.f32,
  lastPassedPipe: Types.f32,
  hasPassed: Types.ui8,
  timeAlive: Types.ui8,
});
