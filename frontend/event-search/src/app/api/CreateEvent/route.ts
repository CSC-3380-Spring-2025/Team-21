import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Grab the JSON payload
    console.log("Received event data:", data);

    // ✅ Forward the event data to Flask
    const flaskResponse = await fetch("http://127.0.0.1:5000/api/CreateEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const flaskData = await flaskResponse.json();
    console.log("Flask responded:", flaskData);

    return NextResponse.json(flaskData, { status: flaskResponse.status });

  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Error creating event." }, { status: 500 });
  }
}