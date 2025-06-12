
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentUploaderProps {
  documentType: string;
  description: string;
}

export default function DocumentUploader({ documentType, description }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase.from('user_files').insert({
        user_id: user.id,
        file_name: `${documentType}-${file.name}`,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size
      });

      if (dbError) throw dbError;

      toast({
        title: "Document Uploaded",
        description: `Your ${documentType} has been uploaded successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="mb-2 font-medium">{documentType}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Document"}
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </Button>
      </div>
    </div>
  );
}
