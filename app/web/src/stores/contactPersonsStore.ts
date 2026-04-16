import { ref } from "vue";
import { defineStore } from "pinia";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export interface ThumbnailsMap {
  thumb?: string;
  small?: string;
  medium?: string;
  large?: string;
}

export interface Media {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  type: string;
  thumbnails?: ThumbnailsMap | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPerson {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  address: string | null;
  phone: string;
  profileImageId: number | null;
  profileImage: Media | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  data: ContactPerson[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useContactPersonsStore = defineStore("contact-persons", () => {
  const contactPersons = ref<ContactPerson[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchContactPersons(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.get<PaginatedResponse>("/api/contact-persons?limit=50");
      contactPersons.value = result.data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (contactPersons.value.length > 0) {
      return;
    }

    await fetchContactPersons();
  }

  return {
    contactPersons,
    isLoading,
    error,
    fetchContactPersons,
    ensureLoaded,
  };
});
