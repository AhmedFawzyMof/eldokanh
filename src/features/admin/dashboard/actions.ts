import adminApi from "@/lib/admin/api";
import { useQuery } from "@tanstack/react-query";

const getDashboard = async () => {
  const response = await adminApi.get("/dashboard");
  return response.data;
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
