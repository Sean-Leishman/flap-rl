import { defineComponent, Types } from "bitecs";

export const Vector2 = { x: Types.f32, y: Types.f32 };
export const Position = defineComponent(Vector2);
export const Rotation = defineComponent(Vector2);
export const Velocity = defineComponent(Vector2);
export const Sprite = defineComponent({
  texture: Types.ui8,
});
export const Player = defineComponent();
export const Pipe = defineComponent();
export const RecentPipe = defineComponent();
export const LastPipe = defineComponent();
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
