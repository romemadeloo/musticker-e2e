-- The Musticker suite and its targets, mirroring tests/fixtures/environments.ts.
insert into public.projects (slug, name, description, repo_url)
values (
  'musticker',
  'Musticker E2E',
  'Playwright suite for the Korean storefront and the admin panel.',
  null
)
on conflict (slug) do nothing;

insert into public.environments (project_id, key, name, base_url, api_url, admin_url, is_production, description)
select p.id, v.key, v.name, v.base_url, v.api_url, v.admin_url, v.is_production, v.description
from public.projects p
cross join (values
  ('production', 'Production', 'https://www.musticker.com/kr', 'https://api.musticker.com/index.php', 'https://admin-panel.musticker.com', true, 'Live customers. Read-only tags only.'),
  ('qa', 'QA (dev-1 → dev-2)', null, null, null, false, 'Resolves to dev-1, falling back to dev-2 if dev-1 fails readiness.'),
  ('dev-1', 'Dev-Shared 1', 'https://shared-dev-static-sf.musticker.com/kr', 'https://shared-dev-static-api.musticker.com/index.php', 'https://shared-dev-static-admin.musticker.com', false, 'The only target for order-changing admin specs.'),
  ('dev-2', 'Dev-Shared 2', 'https://shared-dev-static-sf-2.musticker.com/kr', 'https://shared-dev-static-api-2.musticker.com/index.php', 'https://shared-dev-static-admin-2.musticker.com', false, null),
  ('dev-3', 'Dev-Shared 3', 'https://shared-dev-static-sf-3.musticker.com/kr', 'https://shared-dev-static-api-3.musticker.com/index.php', 'https://shared-dev-static-admin-3.musticker.com', false, null),
  ('dev-4', 'Dev-Shared 4', 'https://shared-dev-static-sf-4.musticker.com/kr', 'https://shared-dev-static-api-4.musticker.com/index.php', 'https://shared-dev-static-admin-4.musticker.com', false, null),
  ('dev-5', 'Dev-Shared 5', 'https://shared-dev-static-sf-5.musticker.com/kr', 'https://shared-dev-static-api-5.musticker.com/index.php', 'https://shared-dev-static-admin-5.musticker.com', false, null),
  ('dev-6', 'Dev-Shared 6', 'https://shared-dev-static-sf-6.musticker.com/kr', 'https://shared-dev-static-api-6.musticker.com/index.php', 'https://shared-dev-static-admin-6.musticker.com', false, null)
) as v(key, name, base_url, api_url, admin_url, is_production, description)
where p.slug = 'musticker'
on conflict (project_id, key) do nothing;

insert into public.settings (project_id, default_environment)
select id, 'qa' from public.projects where slug = 'musticker'
on conflict (project_id) do nothing;

-- Disabled until GitHub dispatch is configured in Settings.
insert into public.schedules (project_id, name, cron, environment_key, suite, browser_project, enabled)
select p.id, v.name, v.cron, v.env, v.suite, v.browser, false
from public.projects p
cross join (values
  ('Nightly smoke on QA', '0 2 * * *', 'qa', 'smoke', 'chromium-desktop'),
  ('Weekday production smoke', '0 9 * * 1-5', 'production', 'smoke', 'chromium-desktop'),
  ('Weekly regression on QA', '0 3 * * 0', 'qa', 'regression', 'all-desktop')
) as v(name, cron, env, suite, browser)
where p.slug = 'musticker';
