import { useQuery } from "@tanstack/react-query";
import { listPatients } from "../api/patient.service";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await listPatients();
      return response;
    },
  });
}
