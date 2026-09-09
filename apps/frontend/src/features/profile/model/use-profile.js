//@ts-check
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, getProfileStats, getProfileHistory } from "@/services/profile.service";
import { useAppToast } from "@/hooks/use-app-toast";

export const PROFILE_QUERY_KEY = ["user"];

export function useUserQuery() {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5,
    });
}

export function useProfileStatsQuery() {
    return useQuery({
        queryKey: [...PROFILE_QUERY_KEY, "stats"],
        queryFn: getProfileStats,
        staleTime: 1000 * 60 * 5,
    });
}

export function useProfileHistoryQuery() {
    return useQuery({
        queryKey: [...PROFILE_QUERY_KEY, "history"],
        queryFn: getProfileHistory,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();
    const { success, error } = useAppToast();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
            success("Perfil atualizado", "Seus dados foram salvos com sucesso.");
        },
        onError: async (err) => {
            console.error(err);
            let errorMessage = "Ocorreu um erro ao atualizar o perfil.";
            try {
                if (err.response) {
                    const errorData = await err.response.json();
                    if (errorData?.error?.message) {
                        errorMessage = errorData.error.message;
                    } else if (errorData?.error) {
                        errorMessage = errorData.error;
                    }
                }
            } catch (e) {}
            error(errorMessage);
        }
    });
}
