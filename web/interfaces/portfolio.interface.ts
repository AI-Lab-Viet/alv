import { PortfolioProject } from "./project.interface";

export interface IGetPortfolioResponse {
  status: string;
  total_projects: number;
  projects: PortfolioProject[];
}
