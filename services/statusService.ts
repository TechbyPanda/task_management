import { api } from "@/util/apiUtil";
import Status from "@/types/Status";

export const getStatuses = async (): Promise<Status[]> => {
  return api.get<Status[]>("/api/status");
};
