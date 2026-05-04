import type {
  ApiDepartment,
  ApiDepartmentResult,
  ApiDepartmentTrainingSession,
  Department,
  DepartmentLocation,
  DepartmentResult,
  DepartmentTrainingSession,
  LocationSummary,
} from "@vsg/types";

function normalizeLocation(location: LocationSummary): DepartmentLocation {
  return {
    id: location.id,
    name: location.name,
    street: location.street ?? "",
    city: location.city ?? "",
    mapsUrl: location.mapsUrl ?? null,
    picture: location.picture ?? null,
  };
}

function normalizeDepartmentSession(
  session: ApiDepartmentTrainingSession,
): DepartmentTrainingSession {
  return {
    id: session.id,
    day: session.day,
    time: session.time,
    locationId: session.location?.id ?? null,
    location: session.location ? normalizeLocation(session.location) : null,
    sort: 0,
    createdAt: "",
    updatedAt: "",
  };
}

function normalizeDepartmentResult(result: ApiDepartmentResult): DepartmentResult {
  return {
    id: result.id,
    title: result.title,
    league: result.league,
    url: result.url,
  };
}

export function normalizeDepartment(department: ApiDepartment): Department {
  const locations = new Map<number, DepartmentLocation>();
  const icon = typeof department.icon === "object" ? department.icon : null;

  for (const group of department.trainingGroups ?? []) {
    for (const session of group.departmentTrainingSessions ?? []) {
      if (session.location) {
        locations.set(session.location.id, normalizeLocation(session.location));
      }
    }
  }

  return {
    id: department.id,
    name: department.name,
    slug: department.slug,
    color: department.color,
    shortDescription: department.description ?? "",
    welcomeText: null,
    iconId: icon?.id ?? null,
    icon,
    stats: (department.departmentStats ?? []).map((stat, index) => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      sort: index,
      createdAt: "",
      updatedAt: "",
    })),
    departmentResults: (department.departmentResults ?? []).map(normalizeDepartmentResult),
    trainingGroups: (department.trainingGroups ?? []).map((group, index) => ({
      id: group.id,
      name: group.name,
      ageRange: group.ageRange ?? null,
      icon: group.ageRange ? "youth" : "adults",
      variant: index % 2 === 0 ? "primary" : "secondary",
      sort: index,
      sessions: (group.departmentTrainingSessions ?? []).map(normalizeDepartmentSession),
      createdAt: "",
      updatedAt: "",
    })),
    locations: Array.from(locations.values()),
    trainers: [],
    createdAt: "",
    updatedAt: "",
  };
}
