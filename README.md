# Workspace — React + Node sample app

A small project tracker used as a reference for app structure: nested components, nested hooks that
delegate to plain logic modules, a Zustand global store, and UI rendered from JSON declarations.

- **client/** — React 19, TypeScript, Vite, React Router, Zustand
- **server/** — Node.js + Express, in-memory data (restarting the server resets it)

## Run

Requires Node 20+.

```bash
npm install
```

```bash
npm run dev
```

This starts the API on http://localhost:4000 and the web app on http://localhost:5180.
The client calls relative `/api/...` URLs with `fetch`; Vite proxies them to the API.

Other scripts: `npm run dev:server`, `npm run dev:client`, `npm run build` (typecheck + production build).
Set `API_DELAY_MS=400` when starting the server to slow every response down and see loading states.

## Pages

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Dashboard | Body rendered entirely from `dashboard.page.json` |
| `/projects` | Projects | Search, status filter, sort (all sent to the API), "New project" dialog |
| `/projects/:projectId` | Project board | Task columns, quick add, move, delete (optimistic updates) |
| `/team` | Team | One request on mount; search, role, sort, layout and the detail panel never call the API |
| `/settings` | Settings | Form rendered from `settings.form.json` |
| `*` | Not found | |

## Client layout

```
client/src
├── api/          fetch wrapper (client.ts), one module per resource, cache keys
├── store/        Zustand stores
├── logic/        plain functions, no React — everything hooks delegate to
├── hooks/
│   ├── core/     generic hooks (useResource, useMutation, useFormState, ...)
│   └── domain/   feature hooks composed from the core ones
├── ui-schema/    JSON declarations + registry + schemas + renderer
├── components/   common/ form/ layout/ projects/ tasks/ team/ feedback/
├── pages/        one component per route
└── styles/       design tokens (light + dark) and component styles
```

### Global state (Zustand)

| Store | Holds |
| --- | --- |
| `uiStore` | theme preference, sidebar collapsed (both persisted to localStorage), toasts |
| `filterStore` | project list filters and board filters |
| `resourceStore` | cache of everything fetched from the API, with stale/invalidate tracking |

### Component nesting

Deepest chains of the app's own components, measured in the running app:

```
App > AppShell > ProjectDetailPage > PageContainer > AsyncBoundary > TaskBoard > TaskColumn
    > TaskList > TaskCard > TaskCardFooter > AssigneeBadge > Avatar                      (12)

App > AppShell > DashboardPage > PageContainer > AsyncBoundary > SchemaRenderer
    > Stack > Grid > Card > Stack > ListRow > Badge                                      (12)

App > AppShell > SettingsPage > PageContainer > AsyncBoundary > FormProvider
    > SchemaRenderer > Stack > FormSection > TextField > FieldShell                      (11)
```

React Router adds its own wrapper components between `App`, `AppShell` and the page; those are not
counted above. JSON declarations may nest at most `MAX_SCHEMA_DEPTH` (6) levels
(`ui-schema/validate.ts`), which keeps schema-rendered pages inside the 15-level budget.

### Hook nesting

Each hook keeps its decisions in a `logic/*.ts` module and only wires state and effects together.

```
useProjectBoard                      logic/boardLogic.ts
├── useProject / useProjectTasks
│   └── useResource                  logic/resourceLogic.ts
│       └── useLatest
├── useTaskFilters                   logic/taskLogic.ts
│   └── useDebouncedValue
├── useTaskMutations                 logic/taskLogic.ts
│   └── useMutation                  logic/mutationLogic.ts
│       ├── useToast
│       ├── useMountedRef
│       └── useLatest
├── useMembers                       logic/memberLogic.ts
└── useWorkspaceSettings             logic/settingsLogic.ts
```

The deepest chain is 4 custom hooks (`useProjectBoard > useTaskMutations > useMutation > useToast`).
Other entry points follow the same shape: `useDashboard`, `useProjectList`, `useCreateProject`,
`useSettingsForm`, `useTaskCard`, `useFormField`.

`useTeamDirectory` is the client-only variant: `useTeam` fetches under a constant cache key, and
`useTeamView` keeps the view options in component state (not in a store), so they never reach the API
and reset when the page unmounts. Everything shown is derived in `logic/teamLogic.ts`.

## JSON-declared UI

`ui-schema/` renders common UI components from JSON:

- **Declarations** (`declarations/*.json`) — a tree of `{ type, props, children }` nodes.
- **Registry** (`registry.ts`) — maps each `type` to a React component.
- **Schemas** (`schemas.ts`) — the props each registered component accepts (type, required, default, enum values).

```json
{
  "type": "ListRow",
  "repeat": { "source": "upcoming", "as": "project", "key": "project.id" },
  "props": {
    "title": { "$bind": "project.name" },
    "description": "{{project.progress}}% complete",
    "onClick": { "$action": "navigate", "payload": "/projects/{{project.id}}" }
  }
}
```

| Syntax | Meaning |
| --- | --- |
| `{ "$bind": "a.b" }` | value at that path in the scope passed to `<SchemaRenderer scope>` |
| `"{{a.b}}"` inside a string | interpolated from the scope |
| `{ "$action": "name", "payload": … }` | callback that runs the handler from `<SchemaRenderer actions>` |
| `"repeat": { "source", "as", "key", "empty" }` | render the node once per array item |
| `"when": "a.b"` | render only while that scope value is truthy |

Declarations are checked against the schemas once at startup (problems are logged to the console) and
again with real values at render time; a node that fails renders a visible error box instead of crashing.

**Adding a component:** add its schema to `schemas.ts`, then add the component to `registry.ts`.
TypeScript reports an error until both exist.

## API

All routes are under `/api`. Errors are returned as `{ "error": { "message", "details" } }`.

| Method | Path | |
| --- | --- | --- |
| GET | `/health` | |
| GET | `/dashboard/summary` | totals, tasks by status, workload, upcoming deadlines |
| GET | `/dashboard/activity?limit=` | recent activity |
| GET | `/projects?status=&q=&sort=` | `sort`: `updated`, `name`, `due`, `progress` |
| POST | `/projects` | |
| GET / PATCH | `/projects/:projectId` | |
| GET / POST | `/projects/:projectId/tasks` | |
| PATCH / DELETE | `/tasks/:taskId` | |
| GET | `/members` | |
| GET | `/team` | members with their projects and assigned tasks |
| GET / PUT | `/settings` | |

Server layout: `routes/` → `controllers/` → `services/` → `data/` (seeded in-memory store), with
request validation in `middleware/validate.js` driven by the rule sets in `schemas/`.
