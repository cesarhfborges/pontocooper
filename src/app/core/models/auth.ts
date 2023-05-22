export interface Auth {
  access: string;
  refresh: string;
  valid?: Date | null;
}
