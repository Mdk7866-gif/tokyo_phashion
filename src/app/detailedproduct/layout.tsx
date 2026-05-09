import { Metadata, ResolvingMetadata } from 'next'
import { fetchShareProduct } from '@/app/admin/shareproduct/route'
import { headers } from 'next/headers'

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
      title: "Tokyo Fashion | Urban Streetwear",
    };
  }

  try {
    const { data: product, error } = await fetchShareProduct(productId);

    if (error || !product || !product.product_variants || product.product_variants.length === 0) {
      return {
        title: "Tokyo Fashion | Urban Streetwear",
      };
    }

    // Use the variant/size from URL if available, otherwise default to first
    let selectedVariant = product.product_variants.find((v: any) => v.id === variantId) || product.product_variants[0];
    if (!selectedVariant) {
      return { title: product.name + " | Tokyo Fashion" };
    }

    let selectedSize = selectedVariant.variant_sizes?.find((s: any) => s.id === sizeId) || selectedVariant.variant_sizes?.[0];
    
    // Sort images to get the main one
    const sortedImages = [...(selectedVariant.product_images || [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
    let mainImage = sortedImages[0]?.image_url;

    // Ensure absolute URL for social crawlers
    if (mainImage && !mainImage.startsWith('http')) {
      const headerList = await headers();
      const host = headerList.get('host') || process.env.DOMAIN_NAME || 'tokyofashion.syp3.com';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      mainImage = `${protocol}://${host}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
    }

    const price = selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0;
    const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
    
    // Optimized for WhatsApp Card
    const title = `${product.name} | Tokyo Fashion`;
    const description = `Price: ${formattedPrice}. Premium streetwear designed for the modern lifestyle. Shop ${product.name} at Tokyo Fashion.`;

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
      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': 'INR',
      }
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
