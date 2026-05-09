import { Metadata, ResolvingMetadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase/admin'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  let sParams;
  try {
    sParams = await searchParams;
  } catch (e) {
    sParams = {};
  }
  
  if (!sParams) sParams = {};
  
  const productId = (sParams.id as string) || (sParams.product_id as string);
  const variantId = sParams.variant_id as string;
  const sizeId = sParams.size_id as string;

  if (!productId) {
    return {
      title: "Product Details - Tokyo Fashion",
    };
  }

  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants (
          *,
          variant_sizes (*),
          product_images (*)
        )
      `)
      .eq('id', productId)
      .is('deleted_at', null)
      .maybeSingle();

    if (error || !product || !product.product_variants || product.product_variants.length === 0) {
      return {
        title: "Product Details - Tokyo Fashion",
      };
    }

    // Use the variant/size from URL if available, otherwise default to first
    let selectedVariant = product.product_variants.find((v: any) => v.id === variantId) || product.product_variants[0];
    if (!selectedVariant) {
      return { title: product.name + " - Tokyo Fashion" };
    }

    let selectedSize = selectedVariant.variant_sizes?.find((s: any) => s.id === sizeId) || selectedVariant.variant_sizes?.[0];
    
    // Sort images to get the main one
    const sortedImages = [...(selectedVariant.product_images || [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
    const mainImage = sortedImages[0]?.image_url;

    const price = selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0;
    const title = `${product.name} - Tokyo Fashion`;
    const description = `₹${price} | ${product.description ? product.description.slice(0, 150) + '...' : 'Premium Streetwear from Tokyo Fashion'}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: mainImage ? [{ url: mainImage, width: 1200, height: 1600, alt: product.name }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: mainImage ? [mainImage] : [],
      },
    }
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Product Details - Tokyo Fashion",
    };
  }
}

export default function DetailedProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
