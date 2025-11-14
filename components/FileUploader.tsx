import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploaderProps {
  onFileChange: (files: FileList | null) => void;
  fileCount: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange, fileCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      // Note: Drag-and-drop doesn't support `webkitdirectory` well.
      // This will handle dropped files, but the button is better for folders.
      onFileChange(event.dataTransfer.files);
      if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
      }
    }
  };

  return (
    <div className="w-full">
      <label 
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex justify-center w-full h-32 px-4 transition bg-gray-900/50 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
      >
        <span className="flex items-center space-x-2">
          <UploadIcon className="w-8 h-8 text-gray-400" />
          <span className="font-medium text-gray-400">
            {fileCount > 0 ? `${fileCount} files selected` : "Click to select a folder (or drop files)"}
            <span className="text-cyan-400 underline ml-1">browse</span>
          </span>
        </span>
        <input
          ref={fileInputRef}
          type="file"
          name="file_upload"
          className="hidden"
          onChange={handleFileSelect}
          // @ts-ignore: webkitdirectory is a non-standard but widely supported attribute
          webkitdirectory="true"
          multiple
        />
      </label>
    </div>
  );
};
