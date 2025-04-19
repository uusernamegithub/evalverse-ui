import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

const Index = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobRequirementsFile, setJobRequirementsFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!resumeFile || !jobRequirementsFile) {
      setError("Please upload both files.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file1", resumeFile);             // 🔁 renamed to match Flask
    formData.append("file2", jobRequirementsFile);    // 🔁 renamed to match Flask

    try {
      const response = await fetch('http://localhost:5000/evalverse/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to upload files');
      }

      navigate('/quiz');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 p-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Assessment</h1>
          <p className="text-gray-600 mb-8">Upload your resume and job requirements to start the assessment</p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-medium text-lg">File Uploads</h2>
            <p>Resume: <span className="font-mono">{resumeFile ? resumeFile.name : 'No file uploaded'}</span></p>
            <p>Job Requirements: <span className="font-mono">{jobRequirementsFile ? jobRequirementsFile.name : 'No file uploaded'}</span></p>
          </div>

          <FileUpload 
            label="Resume" 
            accept=".pdf" 
            onChange={(file) => setResumeFile(file)} 
          />
          
          <FileUpload 
            label="Job Requirements" 
            accept=".pdf" 
            onChange={(file) => setJobRequirementsFile(file)} 
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex justify-center">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Start Assessment (Test Mode)'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
