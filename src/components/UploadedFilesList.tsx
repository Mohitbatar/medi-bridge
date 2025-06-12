
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";

interface UserFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
}

export default function UploadedFilesList() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ["user-files", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_files")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data as UserFile[];
    },
    enabled: !!user,
  });

  const handleDownload = async (file: UserFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("user_files")
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: UserFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("user_files")
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("user_files")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;

      toast({
        title: "File Deleted",
        description: "Your file has been deleted successfully.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Uploaded Files</h3>
        <p className="text-sm text-gray-600">Loading your files...</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Uploaded Files</h3>
        <div className="p-6 text-center bg-gray-100 rounded-lg">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">No files uploaded yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Upload files using the form above to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Uploaded Files</h3>
      <div className="space-y-3">
        {files.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">{file.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.file_size)} • {formatDate(file.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(file)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
