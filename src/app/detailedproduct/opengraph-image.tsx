import { ImageResponse } from 'next/og';
import { getShareProductDetail } from '@/lib/services/shareproduct';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const productId = (searchParams.id as string) || (searchParams.product_id as string);
  const variantId = searchParams.variant_id as string;
  const sizeId = searchParams.size_id as string;

  if (!productId) return new ImageResponse(<div>Tokyo Fashion</div>, size);

  const { data: product } = await getShareProductDetail(productId);

  if (!product) return new ImageResponse(<div>Product Not Found</div>, size);

  // Get data for the specific variant/size
  const selectedVariant = product.product_variants?.find((v: any) => v.id === variantId) || product.product_variants?.[0];
  const selectedSize = selectedVariant?.variant_sizes?.find((s: any) => s.id === sizeId) || selectedVariant?.variant_sizes?.[0];
  const price = selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0;
  
  const sortedImages = [...(selectedVariant?.product_images || [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
  const mainImage = sortedImages[0]?.image_url;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Main Product Image Background (blurred or dimmed if needed, but let's keep it clean) */}
        {mainImage && (
          <img
            src={mainImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.9,
            }}
          />
        )}

        {/* Dark Gradient Overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '40px 60px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: 10 }}>
              Tokyo Fashion
            </span>
            <span style={{ fontSize: 64, fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginBottom: 10, fontStyle: 'italic' }}>
              {product.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
               <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', backgroundColor: '#000', padding: '10px 30px', transform: 'skewX(-10deg)' }}>
                ₹{price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#000', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '4px', textTransform: 'uppercase' }}>
                BUY NOW
              </span>
            </div>
          </div>
        </div>

        {/* Aesthetic Border */}
        <div style={{ position: 'absolute', inset: 20, border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
      </div>
    ),
    {
      ...size,
    }
  );
}
