export interface BlockConfigInterface {
  type: "event" | "method" | "getter" | "setter";
  name: string;
  params: string[];
  output: boolean;
  componentName: string;
}
