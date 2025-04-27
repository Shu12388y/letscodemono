import { NextResponse} from "next/server";
import { db } from "@/lib/db";

db("shubham");
export const GET = async () => {
  return NextResponse.json({ message: "hello" });
};
