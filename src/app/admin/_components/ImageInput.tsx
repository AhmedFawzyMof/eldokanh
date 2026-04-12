import { UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChangeEvent } from "react";

export function ImageInput({
  selectedFile,
  setSelectedFile,
  image,
}: {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  image?: string;
}) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  return (
    <div className="space-y-3 text-right border-b pb-6">
      <Label className="text-base font-bold text-slate-900 px-1">الصورة</Label>

      <div className="flex flex-col items-center sm:flex-row-reverse gap-6">
        <div className="relative group w-32 h-32 border-2 border-dashed rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border-slate-200">
          {selectedFile || image ? (
            <>
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : image}
                alt="Preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <div className="text-center p-2 text-slate-300">
              <UploadCloud className="mx-auto h-8 w-8 mb-1" />
              <span className="text-[10px]">لا توجد صورة</span>
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <div className="relative">
            <Label htmlFor="admin-image-upload" className="cursor-pointer">
              <div className="border border-slate-200 rounded-xl p-3 text-center text-sm hover:bg-slate-50 transition-colors bg-white shadow-sm font-medium text-slate-600">
                {selectedFile ? selectedFile.name : "اختر ملف الصورة"}
              </div>
            </Label>
            <Input
              id="admin-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right px-1">
            {selectedFile
              ? "سيتم استخدام هذه الصورة عند الحفظ"
              : "يمكنك تغيير الصورة الحالية باختيار ملف جديد"}
          </p>
        </div>
      </div>
    </div>
  );
}
