import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://totmafmeowdcukohpqza.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdG1hZm1lb3dkY3Vrb2hwcXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyODY3NjQsImV4cCI6MjA5MDg2Mjc2NH0.wmf0Dk8iIBbtIKzApRHHhLZCWhcOQREVooH_dhmBdtQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: "Nouveau" | "contact" | "qualified" | "converted";
  priority: "low" | "medium" | "high";
  source: string | null;
  notes: string | null;
  created_at: string;
  last_contact_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  lead_id: number;
  message: string;
  sender: "agent" | "lead";
  created_at: string;
}

// Leads CRUD
export async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function getLeadById(id: number) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function createLead(lead: Partial<Lead>) {
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLead(id: number, updates: Partial<Lead>) {
  const { data, error } = await supabase
    .from("leads")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function deleteLead(id: number) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

// Conversations
export async function getConversations(leadId: number) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Conversation[];
}

export async function addConversation(conv: Partial<Conversation>) {
  const { data, error } = await supabase
    .from("conversations")
    .insert(conv)
    .select()
    .single();
  if (error) throw error;
  return data as Conversation;
}

// Stats
export async function getCrmStats() {
  const { data: leads, error } = await supabase.from("leads").select("*");
  if (error) throw error;
  const all = leads as Lead[];
  return {
    total: all.length,
    nouveau: all.filter((l) => l.status === "Nouveau").length,
    contact: all.filter((l) => l.status === "contact").length,
    qualified: all.filter((l) => l.status === "qualified").length,
    converted: all.filter((l) => l.status === "converted").length,
    highPriority: all.filter((l) => l.priority === "high").length,
  };
}
