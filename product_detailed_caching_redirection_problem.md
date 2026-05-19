# Next.js Caching, Mount Race Conditions, & Redirection Loop Bugs

If you are seeing a bug where visiting a new product (e.g., Product B) from a catalog page automatically redirects/changes the URL and page state back to a previously visited product (e.g., Product A), you are facing a combination of **Next.js static API caching** and a **client-side router mount race condition**. 

This document explains why these happen and how they were solved.

---

## 1. Bug 1: Aggressive Static Caching (Global Redirection)
### The Symptom
Every user visiting any product is automatically redirected back to the first product that was loaded after the website was deployed.

### The Root Cause
By default, Next.js statically evaluates and caches all `GET` Route Handlers (API files in `app/api/.../route.ts`) during the build process, unless they explicitly utilize dynamic hooks like `cookies()` or `headers()`. 

Since the product details API (`/api/user/getproductdetail`) queries Supabase via `supabaseAdmin` directly, it did not trigger any dynamic markers. Next.js Edge cache on Vercel cached the JSON response of the **first product fetched** in production and returned that exact JSON response for all subsequent `GET` requests, ignoring the `product_id` query parameter entirely. The component received this wrong data, set the state, and triggered the URL updater to rewrite the URL back to Product A.

### The Solution
We added `export const dynamic = 'force-dynamic';` to the top of all user-facing GET Route Handlers that load dynamic records based on request parameters:
* `src/app/api/user/getproductdetail/route.ts`
* `src/app/api/user/getbriefproducts/route.ts`
* `src/app/api/user/getvariantsize/route.ts`
* `src/app/api/user/gethomepagethumbnail/route.ts`
* `src/app/api/user/getsidebarcategoryandsubcategory/route.ts`

---

## 2. Bug 2: Mount Race Condition after Page Refresh (Local Redirection)
### The Symptom
You visit Product A, refresh the page, navigate back to the catalog, and click Product B. The URL briefly changes to Product B but instantly reverts back to Product A.

### The Root Cause
1. Refreshing on Product A resets the client-side Next.js memory.
2. Clicking Product B mounts the detailed product component.
3. During client-side navigation transitions, Next.js's `useSearchParams()` hook initially returns the **stale cached parameters of the previous render** (Product A) before committing the new URL state.
4. The component evaluates `id` as Product A's ID and immediately fires an API request (`fetchProduct`).
5. Because the API request is fast, it returns Product A's data **before** Next.js officially updates the `useSearchParams()` hook.
6. The component accepts the response, sets Product A's state, and calls `updateQueryParams` to sync the URL.
7. This calls `router.replace` with Product A's URL, which **aborts** the pending navigation to Product B.

### The Solution
We bypassed the stale Next.js router cache on mount by checking the browser address bar directly:
```typescript
const [activeProductId, setActiveProductId] = useState<string | null>(() => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get("product_id") || params.get("id");
  }
  return null;
});
```
We then sync `activeProductId` whenever `searchParams` changes. This guarantees the component immediately targets the correct ID (`B`) on mount, preventing the stale `A` request from ever being sent.

---

## 3. Bug 3: Browser Back-Button Loop (History Trap)
### The Symptom
When the user clicks the browser Back button on the product details page, they are trapped in a loop and cannot leave the website.

### The Root Cause
Every time the user changed variants, selected a size, or when the page did auto-selection, the component called Next.js's `router.replace(...)`. 
* Next.js handles `router.replace` via asynchronous routing transitions.
* If these transitions are triggered back-to-back (especially during page load or size switches), they conflict with the browser's navigation history.
* When the user clicks "Back", they land on the catalog URL for a split second, but the pending/stale Next.js router queue redirects them right back to `/detailedproduct`, trapping them on the page.

### The Solution
We replaced `router.replace` with the native browser history API:
```typescript
const newUrl = `${pathname}?${params.toString()}`;
window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
```
Using `window.history.replaceState` updates the URL in the browser address bar silently. It does **not** trigger Next.js router re-renders or push entries into the browser history stack. The user can click "Back" and instantly exit the page to the catalog with zero latency or loops.
