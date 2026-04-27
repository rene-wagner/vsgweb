import { ref } from "vue";
import { defineStore } from "pinia";
import { type ContactPerson as ApiContactPerson, type MediaItem } from "@vsg/sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export interface ContactPerson {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  address: string | null;
  phone: string;
  profileImage: MediaItem | null;
}

function normalizeContactPerson(contactPerson: ApiContactPerson): ContactPerson {
  return {
    id: contactPerson.id,
    slug: contactPerson.slug,
    firstName: contactPerson.firstName,
    lastName: contactPerson.lastName,
    type: contactPerson.position,
    email: contactPerson.email ?? "",
    address: contactPerson.address ?? null,
    phone: contactPerson.phone ?? "",
    profileImage: contactPerson.picture ?? null,
  };
}

export const useContactPeopleStore = defineStore("contact-people", () => {
  const contactPeople = ref<ContactPerson[]>([]);
  const boardContactPeople = ref<ContactPerson[]>([]);
  const isLoading = ref(false);
  const isBoardLoading = ref(false);
  const error = ref<string | null>(null);
  const boardError = ref<string | null>(null);
  let contactPeopleRequest: Promise<void> | null = null;
  let boardContactPeopleRequest: Promise<void> | null = null;

  async function fetchContactPeople(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.contactPeople.list({ query: { itemsPerPage: 50 } });
      contactPeople.value = (result.member ?? []).map(normalizeContactPerson);
    } catch (e) {
      error.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBoardContactPeople(): Promise<void> {
    isBoardLoading.value = true;
    boardError.value = null;

    try {
      const result = await vsg.contactPeople.list({ query: { itemsPerPage: 50, isBoard: true } });
      boardContactPeople.value = (result.member ?? []).map(normalizeContactPerson);
    } catch (e) {
      boardError.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isBoardLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (contactPeople.value.length > 0) {
      return;
    }

    if (!contactPeopleRequest) {
      contactPeopleRequest = fetchContactPeople().finally(() => {
        contactPeopleRequest = null;
      });
    }

    await contactPeopleRequest;
  }

  async function ensureBoardLoaded(): Promise<void> {
    if (boardContactPeople.value.length > 0) {
      return;
    }

    if (!boardContactPeopleRequest) {
      boardContactPeopleRequest = fetchBoardContactPeople().finally(() => {
        boardContactPeopleRequest = null;
      });
    }

    await boardContactPeopleRequest;
  }

  return {
    contactPeople,
    boardContactPeople,
    isLoading,
    isBoardLoading,
    error,
    boardError,
    fetchContactPeople,
    fetchBoardContactPeople,
    ensureLoaded,
    ensureBoardLoaded,
  };
});
