import { DetailedProject } from "@/interfaces/project.interface";
import api from "./axios.service";

// Utility function to validate parameters
function validatePagination(currentPage: number, pageSize: number): void {
  if (currentPage < 1) {
    throw new Error("Current page must be greater than 0");
  }
  if (pageSize < 1 || pageSize > 100) {
    throw new Error("Page size must be between 1 and 100");
  }
}

export async function getAllProject({
  currentPage = 1,
  pageSize = 10,
}: {
  currentPage?: number;
  pageSize?: number;
}) {
  try {
    validatePagination(currentPage, pageSize);

    const response = await api.get("/missions", {
      params: {
        page: currentPage,
        page_size: pageSize,
      },
    });

    console.log("Get all projects response:", response);

    return response.data.missions as DetailedProject[];
  } catch (error) {
    console.error("Failed to get all projects:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error("Unable to retrieve projects");
  }
}

export async function getFeaturedProject({
  currentPage = 1,
  pageSize = 10,
}: {
  currentPage?: number;
  pageSize?: number;
}) {
  try {
    validatePagination(currentPage, pageSize);

    const response = await api.get("/missions/featured", {
      params: {
        featured: true,
        page: currentPage,
        page_size: pageSize,
      },
    });

    console.log("Get featured projects response:", response);

    return response.data.missions as DetailedProject[];
  } catch (error) {
    console.error("Failed to get featured projects:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error("Unable to retrieve featured projects");
  }
}

export async function getProjectByCategory({
  category,
  currentPage = 1,
  pageSize = 10,
}: {
  category: string;
  currentPage?: number;
  pageSize?: number;
}) {
  try {
    if (!category || category.trim() === "") {
      throw new Error("Category is required and cannot be empty");
    }
    validatePagination(currentPage, pageSize);

    const response = await api.get("/missions/category", {
      params: {
        category: category.trim(),
        page: currentPage,
        page_size: pageSize,
      },
    });

    console.log("Get projects by category response:", response);

    return response.data.missions as DetailedProject[];
  } catch (error) {
    console.error(`Failed to get projects for category "${category}":`, error);
    if (error instanceof Error && error.message.includes("validation")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error(`Unable to retrieve projects for category: ${category}`);
  }
}

export async function getProjectById({ missionId }: { missionId: string }) {
  try {
    const response = await api.get("/mission_agent", {
      params: {
        mission_id: missionId,
      },
    });

    console.log("Get project by ID response:", response);

    return response.data.mission as DetailedProject;
  } catch (error) {
    console.error(`Failed to get project with ID "${missionId}":`, error);
    if (error instanceof Error && error.message.includes("validation")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error(`Unable to retrieve project with ID: ${missionId}`);
  }
}
