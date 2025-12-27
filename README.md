This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## RBAC with Supabase

- Set `SUPABASE_SERVICE_ROLE_KEY` in your environment (server-only) alongside `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`.
- Admin-only user management lives at `/admin/users` and uses `app_metadata.role` (`admin` or `user`).
- API endpoints under `/api/admin/users` are protected by session checks and require an `admin` role.
- To align with [custom claims and RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac):
	- Add a default role on sign-up and expose it as a JWT claim via SQL (run in the Supabase SQL editor):

		```sql
		-- Default every new user to "user"
		create or replace function public.handle_new_user()
		returns trigger as $$
		begin
			update auth.users
			set app_metadata = coalesce(app_metadata, '{}'::jsonb) || jsonb_build_object('role', 'user')
			where id = new.id;
			return new;
		end;
		$$ language plpgsql security definer;

		drop trigger if exists on_auth_user_created on auth.users;
		create trigger on_auth_user_created
			after insert on auth.users
			for each row execute procedure public.handle_new_user();

		-- Make role available as a custom claim for RLS and the client
		create or replace function auth.jwt_custom_claims()
		returns jsonb language sql stable as $$
			select jsonb_build_object(
				'role',
				coalesce((select app_metadata ->> 'role' from auth.users where id = auth.uid()), 'user')
			);
		$$;
		```
	- Use the Admin panel to promote/demote users; roles are stored in `app_metadata` and reflected in JWT claims after re-login.
