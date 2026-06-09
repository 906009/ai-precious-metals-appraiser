import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload?.name || !payload?.phone) {
      return NextResponse.json(
        { error: "Имя и телефон обязательны." },
        { status: 400 }
      );
    }

    // Map frontend payload to FastAPI LeadCreateRequest schema
    const backendPayload = {
      name: payload.name,
      phone: payload.phone,
      branch_id: payload.branch || null,
      client_data: {
        item_type: payload.questionnaire.type,
        purity: payload.questionnaire.purity,
        has_inserts: payload.questionnaire.inserts === "yes",
        condition: payload.questionnaire.condition,
        weight: payload.questionnaire.weight ? Number(payload.questionnaire.weight) : null
      },
      ai_results: payload.estimate.ai_report,
      calculation: {
        loan_amount: payload.estimate.loan_amount,
        buyout_amount: payload.estimate.buyout_amount,
        probability: payload.estimate.probability
      },
      // We'll handle photos if they were passed, though current frontend sends them via FormData in Step 1
      // For MVP, if frontend adds base64 photos to this payload, they will be sent.
      photos_base64: payload.photos_base64 || []
    };

    const response = await fetch("http://localhost:8000/api/v1/create-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Ошибка при создании лида" },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Lead proxy error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку на сервер." },
      { status: 500 }
    );
  }
}
