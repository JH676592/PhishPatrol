export enum ScenarioType {
  EMAIL = "EMAIL",
  SMS = "SMS",
}

export interface Scenario {
  id: number;
  type: ScenarioType;
  content: string;
  isScam: boolean;
  explanation: string;
  error?: string;
}