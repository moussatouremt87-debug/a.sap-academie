import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

// Transform a Supabase course row + nested modules/lessons into the format the frontend expects
function transformCourse(c: any) {
  return {
    id: String(c.id),
    title: c.title,
    description: c.description,
    longDescription: c.long_description,
    category: c.category,
    level: c.level,
    format: c.format,
    duration: c.duration,
    price: c.price,
    badge: c.badge,
    instructor: c.instructor_name,
    rating: Number(c.rating),
    reviews: c.reviews_count,
    prerequisites: c.prerequisites,
    certificationInfo: c.certification_info,
    objectives: c.objectives || [],
    modules: (c.course_modules || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((m: any) => ({
        id: "m" + m.id,
        title: m.title,
        duration: m.duration,
        hasQuiz: m.has_quiz,
        lessons: (m.course_lessons || [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((l: any) => ({
            id: "l" + l.id,
            title: l.title,
            duration: l.duration,
            isFree: l.is_free,
          })),
      })),
  };
}

// Fetch data from Supabase based on the API-style URL pattern
async function getSupabaseData(url: string): Promise<unknown | null> {
  // List all courses/formations
  if (
    url === "/api/courses" ||
    url === "/api/formations" ||
    url.endsWith("/formations")
  ) {
    const { data, error } = await supabase
      .from("courses")
      .select("*, course_modules(*, course_lessons(*))")
      .eq("is_published", true)
      .order("id");
    if (error) throw new Error(error.message);
    return (data || []).map(transformCourse);
  }

  // Single course by id (detail page expects price in centimes, duration in minutes)
  const courseMatch = url.match(/\/api\/courses\/(\d+)$/);
  if (courseMatch) {
    const { data, error } = await supabase
      .from("courses")
      .select("*, course_modules(*, course_lessons(*))")
      .eq("id", parseInt(courseMatch[1]))
      .single();
    if (error || !data) return null;
    const course = transformCourse(data);
    return { ...course, price: data.price * 100, duration: data.duration * 60 };
  }

  // Single formation by id
  const formationMatch = url.match(/\/api\/formations\/(\d+)$/);
  if (formationMatch) {
    const { data, error } = await supabase
      .from("courses")
      .select("*, course_modules(*, course_lessons(*))")
      .eq("id", parseInt(formationMatch[1]))
      .single();
    if (error || !data) return null;
    return transformCourse(data);
  }

  // User profile
  if (url === "/api/user" || url === "/api/me") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    return profile;
  }

  // Enrollments for current user
  if (url === "/api/enrollments") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("enrollments")
      .select("*, courses(*)")
      .eq("user_id", user.id);
    return data || [];
  }

  return null;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let text: string;
    try {
      text = await res.text();
    } catch {
      text = res.statusText;
    }
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  // Try Supabase first
  const supabaseData = await getSupabaseData(url);
  if (supabaseData !== null) {
    return new Response(JSON.stringify(supabaseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Fallback to fetch for any other endpoints
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn({
  on401,
}: { on401?: UnauthorizedBehavior } = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const url = queryKey[0];

    // Try Supabase first
    try {
      const supabaseData = await getSupabaseData(url);
      if (supabaseData !== null) return supabaseData;
    } catch (e) {
      console.error("Supabase query error:", e);
    }

    // Fallback to fetch
    const res = await fetch(url, { credentials: "include" });
    if (on401 === "returnNull" && res.status === 401) return null;
    await throwIfResNotOk(res);
    return await res.json();
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});
