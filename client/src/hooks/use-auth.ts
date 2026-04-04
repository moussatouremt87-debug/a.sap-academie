import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Demo user for mockup exploration
const DEMO_USER = {
  id: 1,
  username: "moussa.demo",
  email: "moussa@asap-academie.com",
  firstName: "Moussa",
  lastName: "Touré",
  role: "student",
  avatar: null,
};

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      // Return demo user directly (no backend needed)
      return DEMO_USER;
    },
    staleTime: Infinity,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // No-op for demo mode
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
