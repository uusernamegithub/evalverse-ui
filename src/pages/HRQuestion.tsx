// src/pages/HRQuestion.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, MicOff, Send, Loader2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { convertWebmToWav } from "../../utils/webmToWav";

const HRQuestion = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [hrQuestion, setHrQuestion] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('http://localhost:5000/evalverse/interview');
        const data = await response.json();
        setHrQuestion(data.question_text);
      } catch (error) {
        console.error("Failed to fetch HR question:", error);
        toast.error("Could not load question. Try again later.");
      }
    };
    fetchQuestion();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingDuration(seconds);
        if (seconds >= 120) {
          stopRecording();
          toast.info("Recording stopped automatically (2 minute limit)");
        }
      }, 1000);
    } catch (error) {
      console.error("Microphone access error:", error);
      toast.error("Microphone not accessible. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      toast.error("Please record your answer before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const wavBlob = await convertWebmToWav(audioBlob);
      const formData = new FormData();
      formData.append('audio', wavBlob, 'candidate_audio.wav');

      const response = await fetch('http://localhost:5000/evalverse/interview/eval', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Submitted! Score: ${data.score}/10 - ${data.feedback}`);
        navigate('/report');
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit recording.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <Card className="w-full max-w-2xl border-none shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardTitle className="text-2xl font-bold">HR Interview Question</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-medium text-gray-800 mb-2">Question:</h3>
            <p className="text-gray-700 text-lg">{hrQuestion}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Record Your Answer</h3>

            {isRecording ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-red-600">
                    <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    Recording
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(recordingDuration)}
                  </div>
                </div>

                <Progress value={(recordingDuration / 120) * 100} className="h-1 mt-2" />

                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="w-full mt-4 border-red-200 hover:bg-red-50 text-red-600"
                >
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              </>
            ) : (
              <>
                {audioURL ? (
                  <div className="space-y-4">
                    <audio src={audioURL} controls className="w-full" />
                    <div className="flex gap-2">
                      <Button onClick={startRecording} variant="outline" className="flex-1">
                        <Mic className="mr-2 h-4 w-4" />
                        Record Again
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={startRecording} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 p-4 border-t">
          <p className="text-sm text-gray-500">
            Please speak clearly and provide a detailed response. You have up to 2 minutes.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HRQuestion;
