# Next.js Route Caching & Redirection Bug (Vercel Production)

If you are seeing a bug where visiting a new product (e.g., Product B) from a catalog page automatically redirects/changes the URL and page state back to a previously visited product (e.g., Product A), you are facing a **Next.js static API caching issue**. 

This document explains why this happens and how to prevent it in the future.

---

## 1. The Symptom
1. You visit **Product A** `/detailedproduct?product_id=A_ID` and refresh the page.
2. You navigate back to a catalog page (e.g., `/briefproduct`).
3. You click on **Product B**.
4. The URL briefly changes to `/detailedproduct?product_id=B_ID`.
5. Within milliseconds, the URL and product details automatically revert back to `/detailedproduct?product_id=A_ID&variant_id=A_VARIANT_ID...` (Product A's details).

---

## 2. The Root Cause
The root cause is **aggressive caching of API GET Route Handlers** by Next.js in production (especially on hosting platforms like Vercel).

### How Next.js Evaluates Caching
By default, Next.js statically evaluates and caches all `GET` Route Handlers (API files in `app/api/.../route.ts`) during the build process, **unless** they explicitly use:
* Dynamic helpers like `cookies()` or `headers()`.
* The standard Request object with methods other than `GET`.
* An explicit dynamic configuration export.

### The Supabase Admin Loophole
If you use a client like `supabaseAdmin` directly in your route handlers:
```typescript
// src/app/api/user/getproductdetail/route.ts
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('product_id');
  const { data } = await supabaseAdmin.from('products').select(...).eq('id', id);
  return NextResponse.json({ data });
}
```
Because `supabaseAdmin` doesn't inspect cookies or session headers, Next.js does not recognize this route as dynamic. Even though the API accesses `request.url`, Next.js Edge Router cache on Vercel caches the API response of the **first product fetched** in production.

### The Redirection Cascade
1. When you request Product B, your React code fetches `/api/user/getproductdetail?product_id=B`.
2. Vercel's CDN cache intercepts this request and returns the **cached response for Product A**.
3. Your client-side code receives Product A's data structure inside the Product B page context.
4. Your component updates state using Product A's variant and size details.
5. An internal helper like `updateQueryParams()` is triggered to synchronize the browser URL with active React state.
6. The URL gets rewritten using Product A's IDs, causing the apparent "automatic redirection" bug.

---

## 3. The Solution
To fix this, you must explicitly opt the API routes out of static caching by exporting `force-dynamic` at the top of each GET Route Handler file.

```typescript
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// CRITICAL: Tells Next.js to disable caching and evaluate this route dynamically on every request
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // ... your fetching logic
}
```

### Applied Fixes
This configuration has been added to all data-fetching endpoints that retrieve dynamic records based on request parameters:
* `src/app/api/user/getproductdetail/route.ts` (Product Detailed view)
* `src/app/api/user/getbriefproducts/route.ts` (Product catalog page filter/sort lists)
* `src/app/api/user/getvariantsize/route.ts` (Variant/Size pricing details)
* `src/app/api/user/gethomepagethumbnail/route.ts` (Homepage categories)
* `src/app/api/user/getsidebarcategoryandsubcategory/route.ts` (Sidebar navigation list)

---

## 4. Best Practices for Next.js Route Handlers
To prevent this issue in future projects, follow these rules:

1. **If a GET Route Handler reads query parameters**, always add `export const dynamic = 'force-dynamic';` at the top of the file unless you specifically want a static response.
2. **If a GET Route Handler queries database tables** that can be updated by administrators or users (e.g., inventory counts, categories, comments), always mark it as `force-dynamic`.
3. **If a GET Route Handler uses authentication** (via cookie-based session tokens), Next.js will automatically treat it as dynamic, but it's still a good habit to explicitly configure it to prevent accidental build-time caching warnings.
