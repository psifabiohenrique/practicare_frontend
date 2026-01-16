export const Status = {
  idle: "idle",
  recording: "recording",
  paused: "paused",
  inactive: "inactive",
};

export type StatusType = (typeof Status)[keyof typeof Status];
