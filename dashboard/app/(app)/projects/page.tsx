import { Card, EmptyState, Notice, PageHeader, StatTile } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { formatRelative } from '@/lib/format';
import { getProjects } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';
import { selectProject } from '../actions';
import { createProject, deleteProject } from './actions';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string; empty?: string }> }) {
  const { error, created, empty } = await searchParams;
  const projects = await getProjects();
  const supabase = await createClient();

  const summaries = await Promise.all(
    projects.map(async (p) => {
      const [cases, suites, last] = await Promise.all([
        supabase.from('test_cases').select('id', { count: 'exact', head: true }).eq('project_id', p.id).neq('status', 'retired'),
        supabase.from('test_suites').select('id', { count: 'exact', head: true }).eq('project_id', p.id),
        supabase.from('executions').select('status,created_at').eq('project_id', p.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
      ]);
      return { project: p, cases: cases.count ?? 0, suites: suites.count ?? 0, last: last.data };
    })
  );

  return (
    <>
      <PageHeader title="Projects" description="Each project is one Playwright repository reporting into this dashboard." />
      {error && <Notice tone="error">{error}</Notice>}
      {created && <Notice tone="success">Project created and selected. Point its reporter at it with DASHBOARD_PROJECT=&lt;slug&gt;.</Notice>}
      {empty && projects.length === 0 && <Notice>Create a project to get started, or run supabase/seed.sql.</Notice>}

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {summaries.map(({ project, cases, suites, last }) => (
          <Card key={project.id}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold">{project.name}</h2>
                  <div className="font-mono text-xs text-muted">{project.slug}</div>
                </div>
                <form action={selectProject}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button className="btn" type="submit">
                    Open
                  </button>
                </form>
              </div>
              {project.description && <p className="mt-2 text-sm text-ink-2">{project.description}</p>}
              {project.repo_url && (
                <a href={project.repo_url} className="mt-1 block truncate text-xs text-accent hover:underline" target="_blank" rel="noreferrer">
                  {project.repo_url}
                </a>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <StatTile label="Suites" value={suites} />
                <StatTile label="Test cases" value={cases} />
                <StatTile label="Last run" value={<StatusBadge status={last?.status} />} hint={last ? formatRelative(last.created_at) : undefined} />
              </div>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-xs text-muted">Delete project</summary>
                <form action={deleteProject} className="mt-2 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={project.id} />
                  <input name="confirm" placeholder={`Type ${project.slug}`} className="input" aria-label="Confirm slug" />
                  <button className="btn btn-danger" type="submit">
                    Delete with all runs
                  </button>
                </form>
              </details>
            </div>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card>
            <EmptyState title="No projects yet" />
          </Card>
        )}
      </div>

      <Card title="New project">
        <form action={createProject} className="grid gap-3 p-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" required className="input w-full" placeholder="Musticker E2E" />
          </div>
          <div>
            <label className="label" htmlFor="slug">
              Slug (reporter&apos;s DASHBOARD_PROJECT)
            </label>
            <input id="slug" name="slug" required className="input w-full" placeholder="musticker" />
          </div>
          <div>
            <label className="label" htmlFor="repo_url">
              Repository URL
            </label>
            <input id="repo_url" name="repo_url" type="url" className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <input id="description" name="description" className="input w-full" />
          </div>
          <div>
            <button className="btn btn-primary" type="submit">
              Create project
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}
