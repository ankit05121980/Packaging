import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

interface CartItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isSample: boolean;
  dimensions: { length: number; width: number; depth: number };
  material: string;
}

interface CheckoutBody {
  items: CartItem[];
  walletCreditsApplied: number;
  currency: string;
  customerEmail?: string;
  vatId?: string;
}

function calculateVAT(subtotal: number, vatId?: string, country?: string): number {
  const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'SE', 'DK', 'PL', 'CZ', 'RO', 'HU', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'CY', 'LU', 'MT', 'GR'];
  if (!country || !euCountries.includes(country)) return 0;
  if (vatId && vatId.length > 0) return 0;
  return subtotal * 0.20;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();
    const { items, walletCreditsApplied, currency, customerEmail, vatId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxAmount = calculateVAT(subtotal, vatId);
    const total = subtotal + taxAmount - (walletCreditsApplied || 0);

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({
        sessionId: 'demo_session_' + Date.now(),
        url: '/checkout/success',
        subtotal,
        taxAmount,
        walletCreditsApplied: walletCreditsApplied || 0,
        total: Math.max(0, total),
        cashbackEarned: subtotal * 0.05,
        currency: currency || 'USD',
        demo: true,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: (currency || 'USD').toLowerCase(),
        product_data: {
          name: item.productName,
          metadata: {
            dimensions: `${item.dimensions.length}x${item.dimensions.width}x${item.dimensions.depth}mm`,
            material: item.material,
            is_sample: String(item.isSample),
          },
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail,
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata: {
        wallet_credits_applied: String(walletCreditsApplied || 0),
        cashback_earned: String(subtotal * 0.05),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    console.error('Checkout session error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
