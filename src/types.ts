export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HassLike {
  states: Record<string, HassEntity>;
  language?: string;
}

export interface SkyScoopConfig {
  type?: string;
  name?: string;
  temperature_entity?: string;
  weather_entity?: string;
}

export interface CustomCardDescriptor {
  type: string;
  name: string;
  description: string;
  preview: boolean;
}

declare global {
  interface Window {
    customCards?: CustomCardDescriptor[];
  }
}