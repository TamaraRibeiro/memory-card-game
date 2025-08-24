import { NextRequest, NextResponse } from "next/server";
export default async function createCard(req: NextRequest) {
  const { checkout_id }: any = await req.json();
  try {
    return NextResponse.json(
      { message: "Checkout processado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "", error }, { status: 500 });
  }
}
