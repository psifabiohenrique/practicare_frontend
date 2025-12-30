import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user.service";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getMe();
      return response;
    },
  });
}
