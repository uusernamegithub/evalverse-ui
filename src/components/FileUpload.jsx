
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

const FileUpload = ({ label, accept = '.pdf', onChange }) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error(`Please select a PDF file for ${label}`);
      return;
    }
    
    setFileName(file.name);
    if (onChange) onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <Card className="p-6 border border-dashed hover:border-theme-blue-400 transition-colors cursor-pointer" onClick={handleClick}>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-3 bg-theme-blue-100 rounded-full">
            {fileName ? <FileText className="h-8 w-8 text-theme-blue-500" /> : <Upload className="h-8 w-8 text-theme-blue-500" />}
          </div>
          <div className="text-center">
            <Label className="font-medium text-lg">{label}</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {fileName || 'Click to upload or drag and drop PDF file'}
            </p>
            {fileName && (
              <p className="text-sm font-semibold text-theme-blue-600 mt-2">
                {fileName}
              </p>
            )}
          </div>
        </div>
      </Card>
      <Input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label={`Upload ${label}`}
      />
    </div>
  );
};

export default FileUpload;
