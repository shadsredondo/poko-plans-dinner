import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SavedMenu {
  id: string;
  menu_title: string;
  menu_data: any;
  guests: number | null;
  ingredients: string | null;
  effort: string | null;
  skill: string | null;
  cuisine: string | null;
  total_estimated_cost: number | null;
  total_pantry_savings: number | null;
  created_at: string;
}

export const useSavedMenus = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["saved_menus", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_menus")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SavedMenu[];
    },
    enabled: !!userId,
  });

  const saveMenu = useMutation({
    mutationFn: async (menu: {
      menu_title: string;
      menu_data: any;
      guests?: number;
      ingredients?: string;
      effort?: string;
      skill?: string;
      cuisine?: string;
      total_estimated_cost?: number;
      total_pantry_savings?: number;
    }) => {
      const { data, error } = await supabase
        .from("saved_menus")
        .insert({
          user_id: userId!,
          ...menu,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_menus", userId] });
    },
  });

  const deleteMenu = useMutation({
    mutationFn: async (menuId: string) => {
      const { error } = await supabase
        .from("saved_menus")
        .delete()
        .eq("id", menuId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_menus", userId] });
    },
  });

  return { ...query, saveMenu, deleteMenu };
};
