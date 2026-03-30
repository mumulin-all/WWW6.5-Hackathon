import { useState } from "react";

interface UploadResult {
  cid: string;
  url: string;
  name: string;
}

interface UseIPFSReturn {
  uploadFile: (file: File) => Promise<UploadResult | null>;
  uploadText: (text: string) => Promise<UploadResult | null>;
  uploading: boolean;
  error: string | null;
}

export function useIPFS(): UseIPFSReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (formData: FormData): Promise<UploadResult | null> => {
    try {
      setUploading(true);
      setError(null);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "上传失败");
      }

      return await res.json();
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    const formData = new FormData();
    formData.append("file", file);
    return upload(formData);
  };

  const uploadText = async (text: string): Promise<UploadResult | null> => {
    const formData = new FormData();
    formData.append("text", text);
    return upload(formData);
  };

  return { uploadFile, uploadText, uploading, error };
}