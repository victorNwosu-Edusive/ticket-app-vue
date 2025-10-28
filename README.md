# Ticketa Web App

Ticket management dashboard built with **Vue 3**, **Vite**, and **Tailwind CSS**. The app provides authentication, dashboard analytics, and CRUD management for support tickets stored client-side via `localStorage`.

## 1. Prerequisites

- **Node.js** `>= 18`
- **npm** `>= 9`

Verify versions:
```bash
node -v
npm -v
```

## 2. Installation

Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd ticket-app-vue
npm install
```

## 3. Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR (http://localhost:5173). |
| `npm run build` | Create production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint on the project. |

## 4. Project Structure

```
src/
  components/      # Shared UI components (Navbar, Toast)
  frontend/pages/  # Vue page components (Home, Dashboard, Tickets, etc.)
  services/        # LocalStorage-backed ticket service
  composables/     # Reusable composition utilities (useTickets)
  main.js          # App entry point and router configuration
```

## 5. Environment & Storage

- Authentication and ticket data persist in browser `localStorage` using keys:
  - `ticketapp_session`
  - `ticketapp_users`
  - `ticketapp_tickets`
- Clearing browser storage resets the app to seeded sample tickets.

## 6. Usage Flow

1. Sign up a new user or log in with existing credentials.
2. Access the dashboard for ticket summaries.
3. Manage tickets via:
   - `/tickets` list page (view/delete)
   - `/tickets/create` form (create)
   - `/tickets/:id/edit` form (update)

## 7. Development Notes

- Routing guard checks for `ticketapp_session` before allowing dashboard or ticket pages.
- Toast notifications auto-dismiss after 3 seconds (`Toast` component).
- Styling primarily uses Tailwind utility classes (configured via `index.css`).

## 8. Troubleshooting

| Issue | Resolution |
| --- | --- |
| `npm run dev` fails | Ensure Node.js >= 18. Delete `node_modules` and reinstall. |
| Tickets missing | Confirm browser `localStorage` is intact; clear storage to reset seed data. |
| Lint errors | Run `npm run lint` and follow ESLint output to fix. |
