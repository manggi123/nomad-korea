import { createClient } from "@/lib/supabase/server";
import { getAllCities } from "@/lib/supabase/queries/cities";
import { transformDbCitiesToCities } from "@/lib/utils/type-transformers";
import BudgetRecommendationsClient from "./budget-recommendations-client";
import type { City } from "@/types";

export default async function BudgetRecommendations() {
  const supabase = await createClient();

  let cities: City[];
  try {
    const dbCities = await getAllCities(supabase);
    cities = transformDbCitiesToCities(dbCities || []);
  } catch {
    cities = [];
  }

  return <BudgetRecommendationsClient cities={cities} />;
}
