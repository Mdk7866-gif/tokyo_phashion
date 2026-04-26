import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

export async function GET() {
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);

    // 1. Total Customers
    const totalCustomers = await db.collection('userdata').countDocuments();

    // 2. Orders Stats
    const orderedCollection = db.collection('ordereddata');
    
    const receivedOrders = await orderedCollection.countDocuments({ status: 'in progress' });
    const deliveredOrders = await orderedCollection.countDocuments({ status: 'delivered' });
    const cancelledOrders = await orderedCollection.countDocuments({ status: 'cancelled' });

    // 3. Forms Stats
    const totalForms = await db.collection('usercontactformdata').countDocuments();

    return NextResponse.json({
      success: true,
      stats: {
        customers: totalCustomers,
        received: receivedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        forms: totalForms,
      }
    });
  } catch (error: any) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
