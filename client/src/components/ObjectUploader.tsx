import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  X, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";

interface ObjectUploaderProps {
  onUploadComplete?: (url: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // en MB
  className?: string;
  multiple?: boolean;
}

interface UploadedFile {
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export function ObjectUploader({ 
  onUploadComplete, 
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 50, // 50MB por defecto
  className = "",
  multiple = false
}: ObjectUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    
    Array.from(selectedFiles).forEach((file) => {
      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: `${file.name} excede el límite de ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }

      // Validar tipo
      const isValidType = acceptedTypes.some(type => 
        file.type.match(type.replace('*', '.*'))
      );
      
      if (!isValidType) {
        toast({
          title: "Tipo no permitido",
          description: `${file.name} no es un tipo de archivo válido`,
          variant: "destructive"
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      newFiles.push({
        file,
        preview,
        status: 'uploading',
        progress: 0
      });
    });

    if (!multiple) {
      setFiles(newFiles.slice(0, 1));
    } else {
      setFiles(prev => [...prev, ...newFiles]);
    }

    // Iniciar upload para cada archivo
    newFiles.forEach((fileData, index) => {
      uploadFile(fileData, multiple ? files.length + index : 0);
    });
  };

  const uploadFile = async (fileData: UploadedFile, index: number) => {
    try {
      // 1. Obtener URL de upload
      const uploadResponse = await apiRequest("POST", "/api/objects/upload") as any;
      const uploadURL = uploadResponse.uploadURL;

      // 2. Subir archivo directamente al storage
      const uploadRequest = new XMLHttpRequest();
      
      uploadRequest.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress } : f
          ));
        }
      });

      uploadRequest.onload = async () => {
        if (uploadRequest.status === 200) {
          // 3. Obtener la URL final del objeto
          const objectPath = `/objects/uploads/${uploadURL.split('/').pop()?.split('?')[0]}`;
          
          setFiles(prev => prev.map((f, i) => 
            i === index ? { 
              ...f, 
              status: 'success', 
              progress: 100,
              url: objectPath
            } : f
          ));

          onUploadComplete?.(objectPath);
          
          toast({
            title: "Archivo subido",
            description: "El archivo se ha subido correctamente"
          });
        } else {
          throw new Error('Error en la subida');
        }
      };

      uploadRequest.onerror = () => {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { 
            ...f, 
            status: 'error',
            error: 'Error en la subida'
          } : f
        ));
      };

      uploadRequest.open('PUT', uploadURL);
      uploadRequest.setRequestHeader('Content-Type', fileData.file.type);
      uploadRequest.send(fileData.file);

    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error',
          error: 'Error al obtener URL de subida'
        } : f
      ));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zona de Drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-lg font-medium">
              Arrastra archivos aquí o{" "}
              <span className="text-primary underline">haz clic para seleccionar</span>
            </div>
          </Label>
          <p className="text-sm text-gray-500">
            {acceptedTypes.includes('image/*') && acceptedTypes.includes('video/*') 
              ? 'Imágenes y videos'
              : acceptedTypes.includes('image/*') 
                ? 'Solo imágenes'
                : 'Solo videos'
            } hasta {maxSize}MB
          </p>
        </div>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((fileData, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {fileData.file.type.startsWith('image/') ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={fileData.preview} 
                          alt={fileData.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">
                        {fileData.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {fileData.status === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {fileData.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      {formatFileSize(fileData.file.size)}
                    </p>

                    {/* Progress bar */}
                    {fileData.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={fileData.progress} className="h-2" />
                        <p className="text-xs text-gray-500">
                          Subiendo... {fileData.progress}%
                        </p>
                      </div>
                    )}

                    {fileData.status === 'error' && (
                      <p className="text-xs text-red-500">
                        {fileData.error}
                      </p>
                    )}

                    {fileData.status === 'success' && (
                      <p className="text-xs text-green-500">
                        ¡Subido correctamente!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}