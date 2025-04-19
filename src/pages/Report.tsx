// src/pages/Report.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("http://localhost:5000/evalverse/candidate/report", {
          method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch report");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Could not load report.");
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleReset = async () => {
    try {
      const response = await fetch("http://localhost:5000/evalverse/mcq/reset", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.Success);
        navigate("/"); // Go back to home or wherever makes sense
      } else {
        throw new Error(result.error || "Reset failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset difficulty.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Candidate Evaluation Report</h1>

      {loading ? (
        <div className="flex items-center text-indigo-600">
          <Loader2 className="mr-2 animate-spin" />
          Loading report...
        </div>
      ) : pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full max-w-4xl h-[80vh] border shadow-md rounded-lg mb-6"
          title="Evaluation Report"
        />
      ) : (
        <p className="text-red-600">Report not available</p>
      )}

      <Button onClick={handleReset} className="bg-indigo-600 hover:bg-indigo-700 text-white">
        Finish Test
      </Button>
    </div>
  );
};

export default Report;
