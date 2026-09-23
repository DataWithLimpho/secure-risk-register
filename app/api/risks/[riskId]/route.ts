import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ riskId: string }> }
) {
  try {
    const { riskId } = await params;
    const body = await request.json();

    const likelihood = Number(body.likelihood);
    const impact = Number(body.impact);
    const score = likelihood * impact;

    const rating =
      score >= 17
        ? "Critical"
        : score >= 10
          ? "High"
          : score >= 5
            ? "Medium"
            : "Low";

    const risk = await db.orm.public.Risk
  .where({ riskId })
  .update({
    title: body.title,
    category: body.category,
    owner: body.owner,
    likelihood,
    impact,
    score,
    rating,
    status: body.status,
  });

    return NextResponse.json(risk);
  } catch (error) {
    console.error("Failed to update risk:", error);

    return NextResponse.json(
      { error: "Failed to update risk" },
      { status: 500 }
    );
  }
}