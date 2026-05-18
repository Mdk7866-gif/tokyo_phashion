import { Metadata } from 'next'
import { headers } from 'next/headers'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  let sParams;
  try {
    sParams = await searchParams;
  } catch {
    sParams = {};
  }
  
  if (!sParams) sParams = {};
  
  const productId = (sParams.id as string) || (sParams.product_id as string);
  const variantId = sParams.variant_id as string;
  const sizeId = sParams.size_id as string;

  if (!productId) {
    return {
      title: "Tokyo Fashion | Urban Streetwear",
    };
  }

  try {
    const headerList = await headers();
    const host = headerList.get('host') || process.env.DOMAIN_NAME || 'tokyofashion.syp3.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Calling the API endpoint as requested instead of the service directly
    const res = await fetch(`${baseUrl}/api/admin/shareproduct?product_id=${productId}`, {
      cache: 'no-store' // Ensure we get fresh data for sharing
    });
    
    if (!res.ok) throw new Error('Failed to fetch sharing data');
    
    interface VariantSize {
      id: string;
      discount_price?: number;
      original_price: number;
    }

    interface ProductImage {
      image_url: string;
      sort_order: number;
    }

    interface ProductVariant {
      id: string;
      variant_sizes?: VariantSize[];
      product_images?: ProductImage[];
    }

    interface ProductData {
      name: string;
      description?: string;
      product_variants: ProductVariant[];
    }

    const { data: product } = (await res.json()) as { data: ProductData };

    if (!product || !product.product_variants || product.product_variants.length === 0) {
      return {
        title: "Tokyo Fashion | Urban Streetwear",
      };
    }

    // Use the variant/size from URL if available, otherwise default to first
    const selectedVariant = product.product_variants.find((v: ProductVariant) => v.id === variantId) || product.product_variants[0];
    if (!selectedVariant) {
      return { title: product.name + " | Tokyo Fashion" };
    }

    const selectedSize = selectedVariant.variant_sizes?.find((s: VariantSize) => s.id === sizeId) || selectedVariant.variant_sizes?.[0];
    
    // Sort images to get the main one
    const sortedImages = [...(selectedVariant.product_images || [])].sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order);
    let mainImage = sortedImages[0]?.image_url;

    // Ensure absolute URL for social crawlers and optimize for OpenGraph (1200x630)
    if (mainImage) {
      if (!mainImage.startsWith('http')) {
        const headerList = await headers();
        const host = headerList.get('host') || process.env.DOMAIN_NAME || 'tokyofashion.syp3.com';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        mainImage = `${protocol}://${host}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
      } else if (mainImage.includes('res.cloudinary.com')) {
        // Optimize Cloudinary image for Social Previews (OpenGraph standard size 1200x630, fast WebP delivery)
        if (!mainImage.includes('w_1200,h_630')) {
          mainImage = mainImage.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_auto/');
        }
      }
    }

    const price = selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0;
    const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
    
    // Highly visible Title & Description for WhatsApp/Social Cards
    const title = `${formattedPrice} - ${product.name} | Tokyo Fashion`;
    const description = `Get this ${product.name} for only ${formattedPrice}. Premium urban streetwear, available now at Tokyo Fashion. ${product.description ? product.description.slice(0, 100) : ''}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: mainImage ? [{ url: mainImage, width: 1200, height: 1600, alt: product.name }] : [],
        type: 'website',
        siteName: 'Tokyo Fashion',
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
      title: "Tokyo Fashion | Urban Streetwear",
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
