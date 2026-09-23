import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const risks = await db.orm.public.Risk.all();

    return NextResponse.json(risks);
  } catch (error) {
    console.error("Failed to fetch risks:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch risks",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const risk = await db.orm.public.Risk.create({
      riskId: body.riskId,
      title: body.title,
      category: body.category,
      owner: body.owner,
      likelihood,
      impact,
      score,
      rating,
      status: body.status ?? "Open",
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error("Failed to create risk:", error);

    return NextResponse.json(
      {
        error: "Failed to create risk",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}