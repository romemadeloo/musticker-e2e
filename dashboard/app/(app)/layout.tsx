import { cookies } from 'next/headers';
import { Sidebar } from '@/components/sidebar';
import { PROJECT_COOKIE } from '@/lib/constants';
import { getProjects } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [{ data: auth }, projects] = await Promise.all([supabase.auth.getUser(), getProjects()]);
  const selected = (await cookies()).get(PROJECT_COOKIE)?.value;
  const currentId = projects.find((p) => p.id === selected)?.id ?? projects[0]?.id ?? '';

  return (
    <div className="md:flex">
      <Sidebar projects={projects} currentId={currentId} email={auth.user?.email ?? ''} />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
