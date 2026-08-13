-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL,
  name text,
  email text UNIQUE,
  mobile_number text,
  google_id text UNIQUE,
  profile_image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subcategories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subcategories_pkey PRIMARY KEY (id),
  CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.category_thumbnails (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL UNIQUE,
  image_url character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT category_thumbnails_pkey PRIMARY KEY (id),
  CONSTRAINT category_thumbnails_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subcategory_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id)
);
CREATE TABLE public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  color character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.variant_sizes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_variant_id uuid NOT NULL,
  size character varying NOT NULL,
  original_price numeric NOT NULL,
  discount_price numeric NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT variant_sizes_pkey PRIMARY KEY (id),
  CONSTRAINT variant_sizes_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id)
);
CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_variant_id uuid NOT NULL,
  image_url character varying NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id)
);
CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  variant_size_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT cart_items_variant_size_id_fkey FOREIGN KEY (variant_size_id) REFERENCES public.variant_sizes(id)
);
CREATE TABLE public.wishlist_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_variant_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wishlist_items_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT wishlist_items_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id)
);
CREATE TABLE public.addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_address text NOT NULL,
  city character varying NOT NULL,
  state character varying NOT NULL,
  pincode character varying NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  snapshot_order_full_address text NOT NULL,
  snapshot_order_city character varying NOT NULL,
  snapshot_order_state character varying NOT NULL,
  snapshot_order_pincode character varying NOT NULL,
  total_amount numeric NOT NULL,
  payment_method USER-DEFINED NOT NULL,
  payment_status USER-DEFINED NOT NULL DEFAULT 'pending'::payment_status_enum,
  delivery_status USER-DEFINED NOT NULL DEFAULT 'pending'::delivery_status_enum,
  tracking_id character varying UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  parcel_image text,
  cancelled_by text CHECK (cancelled_by = ANY (ARRAY['admin'::text, 'user'::text, 'system'::text])),
  cancellation_note text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  product_variant_id uuid NOT NULL,
  variant_size_id uuid NOT NULL,
  product_name_snapshot character varying NOT NULL,
  color_snapshot character varying NOT NULL,
  size_snapshot character varying NOT NULL,
  price_snapshot numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_items_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id),
  CONSTRAINT order_items_variant_size_id_fkey FOREIGN KEY (variant_size_id) REFERENCES public.variant_sizes(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  razorpay_order_id character varying,
  razorpay_payment_id character varying,
  razorpay_signature character varying,
  amount numeric NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::payment_status_enum,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  order_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);