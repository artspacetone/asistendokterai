export enum Sender {
  User = 'user',
  AI = 'ai',
  System = 'system',
}

export interface AssessmentPlan {
    assessment: string[];
    plan: string[];
    nextSteps: string[];
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string; // ISO 8601 format
  image?: string; // base64 encoded image
  assessment?: AssessmentPlan;
  isEmergency?: boolean;
  containsDrugInfo?: boolean;
}