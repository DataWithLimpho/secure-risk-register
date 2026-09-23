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
  console.error("Failed to delete risk:", error);

  return NextResponse.json(
    {
      error: "Failed to delete risk",
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ riskId: string }> }
) {
  try {
    const { riskId } = await params;

    const deletedRisk = await db.orm.public.Risk
      .where({ riskId })
      .delete();

    if (!deletedRisk) {
      return NextResponse.json(
        { error: "Risk not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Risk deleted successfully",
      riskId,
    });
  } catch (error) {
    console.error("Failed to delete risk:", error);

    return NextResponse.json(
      { error: "Failed to delete risk" },
      { status: 500 }
    );
  }
}