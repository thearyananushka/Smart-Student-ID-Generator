export type TemplateType = "modern" | "classic";

export interface StudentData {
  studentName: string;
  rollNumber: string;
  class: string;
  division: string;
  photo?: string;
  allergies?: string[];
  rackNumber: string;
  busRoute: string;
  template: TemplateType;
  timestamp: string;
}
