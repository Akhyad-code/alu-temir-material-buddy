import React, { useCallback } from 'react';
import { Upload, File, Image, FileText, Trash2, Download } from 'lucide-react';
import { ProjectFile } from '@/types';

interface FileManagerProps {
  files: ProjectFile[];
  onFilesAdd: (files: ProjectFile[]) => void;
  onFileDelete: (id: number) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ files, onFilesAdd, onFileDelete }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (fileList: FileList) => {
    const newFiles: ProjectFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const data = await readFileAsBase64(file);
      
      newFiles.push({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        data,
        uploadDate: new Date().toLocaleDateString('ru-RU'),
      });
    }

    onFilesAdd(newFiles);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    return FileText;
  };

  const downloadFile = (file: ProjectFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const handleDelete = (file: ProjectFile) => {
    if (window.confirm(`Удалить файл "${file.name}"?`)) {
      onFileDelete(file.id);
    }
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-purple/50 hover:bg-purple/5 transition-colors cursor-pointer"
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-10 h-10 text-purple mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">
            Перетащите файлы сюда
          </p>
          <p className="text-sm text-muted-foreground">
            или нажмите для выбора
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg group"
              >
                {isImage(file.type) ? (
                  <img
                    src={file.data}
                    alt={file.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-purple/10 rounded-lg flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-purple" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.uploadDate}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => downloadFile(file)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
