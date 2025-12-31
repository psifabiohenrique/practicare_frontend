import { useState, useEffect } from "react";
import { getMe } from "../api/user.service";
import type { User } from "../types/user";

export function useUser() {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  async function fetchUser() {
    try {
      setIsLoading(true);
      const user = await getMe();
      setData(user);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { data, isLoading, error, refetch: fetchUser };
}
