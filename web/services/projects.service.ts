import { DetailedProject } from "@/interfaces/project.interface";
import api from "./axios.service";

export async function getAllProject({
  currentPage = 1,
  pageSize = 10,
}: {
  currentPage?: number;
  pageSize?: number;
}) {
  const response = await api.get("/missions", {
    params: {
      page: currentPage,
      page_size: pageSize,
    },
  });
  const data = response.data.missions;
  return data as DetailedProject[];
}

export async function getFeaturedProject({
  currentPage = 1,
  pageSize = 10,
}: {
  currentPage?: number;
  pageSize?: number;
}) {
  const response = await api.get("/missions/featured", {
    params: {
      featured: true,
      page: currentPage,
      page_size: pageSize,
    },
  });
  const data = response.data.missions;
  return data as DetailedProject[];
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
  const response = await api.get("/missions/featured", {
    params: {
      category: true,
      page: currentPage,
      page_size: pageSize,
    },
  });
  const data = response.data.missions;
  return data as DetailedProject[];
}
