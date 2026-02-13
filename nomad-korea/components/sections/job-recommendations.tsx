import { createClient } from "@/lib/supabase/server";
import { getAllCities } from "@/lib/supabase/queries/cities";
import { transformDbCitiesToCities } from "@/lib/utils/type-transformers";
import JobRecommendationsClient from "./job-recommendations-client";
import type { City } from "@/types";

export default async function JobRecommendations() {
  const supabase = await createClient();

  let cities: City[];
  try {
    const dbCities = await getAllCities(supabase);
    cities = transformDbCitiesToCities(dbCities || []);
  } catch {
    cities = [];
  }

  return <JobRecommendationsClient cities={cities} />;
}
