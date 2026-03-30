import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    let cid: string;
    let fileName: string;

    if (file && file.size > 0) {
      const upload = await pinata.upload.public.file(file);
      cid = upload.cid;
      fileName = file.name;
    } else if (text) {
      const blob = new Blob([text], { type: "text/plain" });
      const textFile = new File([blob], `note-${Date.now()}.txt`, { type: "text/plain" });
      const upload = await pinata.upload.public.file(textFile);
      cid = upload.cid;
      fileName = textFile.name;
    } else {
      return NextResponse.json({ error: "请提供文件或文字内容" }, { status: 400 });
    }

    const url = await pinata.gateways.public.convert(cid);
    return NextResponse.json({ cid, url, name: fileName });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}