import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, board, time, message } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Elevate Tutor <info@dynastra.co.uk>",
      to: ["info@elevatetutor.co.uk"], // <-- your inbox
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Exam board: ${board || "-"}`,
        `Preferred time: ${time || "-"}`,
        "",
        `Message:`,
        `${message || "-"}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
