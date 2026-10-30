import { cookies } from 'next/headers';
import { AppShell } from '@/components/app-shell';
import { FOLDED_COOKIE, NAV_COOKIE, PROJECT_COOKIE } from '@/lib/constants';
import { getProjects } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [{ data: auth }, projects] = await Promise.all([supabase.auth.getUser(), getProjects()]);
  const jar = await cookies();
  const selected = jar.get(PROJECT_COOKIE)?.value;
  const initialCollapsed = jar.get(NAV_COOKIE)?.value === 'collapsed';
  const initialFolded = decodeURIComponent(jar.get(FOLDED_COOKIE)?.value ?? '')
    .split('|')
    .filter(Boolean);
  const currentId = projects.find((p) => p.id === selected)?.id ?? projects[0]?.id ?? '';

  const { count: recentFailures } = currentId
    ? await supabase
        .from('executions')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', currentId)
        .in('status', ['failed', 'timedout', 'interrupted'])
        .gte('created_at', new Date(Date.now() - 86_400_000).toISOString())
    : { count: 0 };

  return (
    <AppShell
      projects={projects}
      currentId={currentId}
      email={auth.user?.email ?? ''}
      recentFailures={recentFailures ?? 0}
      initialCollapsed={initialCollapsed}
      initialFolded={initialFolded}
    >
      {children}
    </AppShell>
  );
}
