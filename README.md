# Astro + Logto auth example

This is an example demonstrating Logto integration with Astro.

Since Logto doesn't have an SDK for Astro, this example will be using Lucia Auth as the middleman between Astro and Logto.

## Instructions

Install the dependencies.

```sh copy
pnpm install
```

Create a `.env` file in the root of the project by copying the `.env.example` file.

```sh copy
cp .env.example .env
```

Open the `.env` file and update the `DATABASE_URL` environment variable with your database's connection string.

```env filename=".env" {2} copy
# Database
DATABASE_URL=postgresql://user:password@host:port/database
...
```

Migrate your database.

```sh copy
pnpm drizzle-kit push
```

Now if you check your database, you should see the `user` and `session` tables.

Run the following command in your terminal to start the development server.

```sh copy
pnpm dev
```

Open http://localhost:4321 in your browser to see your app.

Now, follow the instructions in the **Logto Authentication Setup** section of [these docs](https://docs.ryzekit.com/authentication/#logto-authentication-setup) to get Logto set up. No need to follow the other sections, because those aren't relevant to this example.

## License

This Astro + Logto auth example is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Pro Starter Kit

If you're looking for something that already includes this auth setup, along with payments, blog, analytics, and other features all ready to go, check out [RyzeKit](https://ryzekit.com/astro), a fully-featured Astro SaaS boilerplate/starter kit.

Link: https://ryzekit.com/astro
