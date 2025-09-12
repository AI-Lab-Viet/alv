import { IGetPortfolioResponse } from "@/interfaces/portfolio.interface";
import api from "./axios.service";

export async function getPortfolioPage() {
  try {
    const response = await api.get("/portfolio");

    return response.data as IGetPortfolioResponse;
  } catch (error) {
    console.error(`Failed to get portfolio`, error);
    if (error instanceof Error && error.message.includes("validation")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error(`Unable to retrieve portfolio of user`);
  }
}
