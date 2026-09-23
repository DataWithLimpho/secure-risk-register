import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const risks = await db.orm.public.Risk.all();

    return NextResponse.json(risks);
  } catch (error) {
    console.error("Failed to fetch risks:", error);

    return NextResponse.json(
      { error: "Failed to fetch risks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const score = body.likelihood * body.impact;

    const rating =
      score >= 17
        ? "Critical"
        : score >= 10
          ? "High"
          : score >= 5
            ? "Medium"
            : "Low";

    const risk = await db.orm.public.Risk.create({
      riskId: body.riskId,
      title: body.title,
      category: body.category,
      owner: body.owner,
      likelihood: body.likelihood,
      impact: body.impact,
      score,
      rating,
      status: body.status ?? "Open",
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error("Failed to create risk:", error);

    return NextResponse.json(
      { error: "Failed to create risk" },
      { status: 500 }
    );
  }
}