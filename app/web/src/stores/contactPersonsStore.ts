import { ref } from "vue";
import { defineStore } from "pinia";
import { type ApiCollection, type ContactPerson as ApiContactPerson } from "@vsg/sdk";
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

function normalizeContactPerson(contactPerson: ApiContactPerson): ContactPerson {
  return {
    id: contactPerson.id,
    firstName: contactPerson.firstName,
    lastName: contactPerson.lastName,
    type: contactPerson.position,
    email: contactPerson.email ?? "",
    address: contactPerson.address ?? null,
    phone: contactPerson.phone ?? "",
    profileImageId: null,
    profileImage: null,
    createdAt: "",
    updatedAt: "",
  };
}

export const useContactPersonsStore = defineStore("contact-persons", () => {
  const contactPersons = ref<ContactPerson[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let contactPersonsRequest: Promise<void> | null = null;

  async function fetchContactPersons(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.get<ApiCollection<ApiContactPerson>>("/api/contact-persons?limit=50");
      contactPersons.value = (result.member ?? []).map(normalizeContactPerson);
    } catch (e) {
      contactPersons.value = [];
      error.value = getApiErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (contactPersons.value.length > 0) {
      return;
    }

    if (!contactPersonsRequest) {
      contactPersonsRequest = fetchContactPersons().finally(() => {
        contactPersonsRequest = null;
      });
    }

    await contactPersonsRequest;
  }

  return {
    contactPersons,
    isLoading,
    error,
    fetchContactPersons,
    ensureLoaded,
  };
});
