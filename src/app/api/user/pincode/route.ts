import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pin");

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    const data = await res.json();

    if (!Array.isArray(data) || data[0]?.Status === "Error" || !data[0]?.PostOffice) {
      return NextResponse.json({ error: "Invalid pincode or no records found" }, { status: 404 });
    }

    const postOffice = data[0].PostOffice?.[0];
    if (!postOffice) {
      return NextResponse.json({ error: "No data for this pincode" }, { status: 404 });
    }

    return NextResponse.json({
      city: postOffice.District,
      state: postOffice.State,
    });
  } catch (e) {
    console.error("[pincode]", e);
    return NextResponse.json({ error: "Failed to lookup pincode" }, { status: 500 });
  }
}
