import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PROJECT_COOKIE } from './constants';
import { createClient } from './supabase/server';
import type { Project } from './types';

// Every page is scoped to one project, picked in the sidebar and remembered in a cookie.
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('projects').select('*').order('name');
  return (data ?? []) as Project[];
}

export async function getCurrentProject(): Promise<{ project: Project; projects: Project[] }> {
  const projects = await getProjects();
  if (projects.length === 0) {
    redirect('/projects?empty=1');
  }

  const selected = (await cookies()).get(PROJECT_COOKIE)?.value;
  const project = projects.find((p) => p.id === selected) ?? projects[0];
  return { project, projects };
}
