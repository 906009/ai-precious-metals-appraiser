import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Map frontend fields to backend expected fields
    const backendFormData = new FormData();
    backendFormData.append("item_type", formData.get("type"));
    backendFormData.append("purity", formData.get("purity"));
    backendFormData.append("has_inserts", formData.get("inserts") === "yes" ? "true" : "false");
    backendFormData.append("condition", formData.get("condition"));
    
    const weight = formData.get("weight");
    if (weight) {
      backendFormData.append("weight", weight);
    }
    
    const photos = formData.getAll("photos");
    photos.forEach(photo => {
      backendFormData.append("photos", photo);
    });

    // Proxy request to FastAPI backend
    const response = await fetch("http://localhost:8000/api/v1/estimate", {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Ошибка на стороне бэкенда" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Не удалось связаться с сервером оценки." },
      { status: 500 }
    );
  }
}
