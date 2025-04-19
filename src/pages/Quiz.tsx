import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const navigate = useNavigate();
  const n = 2;
  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = async () => {
    setIsLoading(true);
    setSelectedAnswer(null);

    try {
      const response = await fetch('http://localhost:5000/evalverse/mcq');
      if (!response.ok) throw new Error("Failed to fetch question");
      
      const questionData = await response.json();
      console.log(questionData);
      if (!questionData || !questionData.question_text || !questionData.options) {
        throw new Error("Invalid MCQ format received");
      }

      setCurrentQuestion(questionData);
    } catch (error) {
      console.error("Error loading question:", error);
      alert("Unable to load question. Please try again later.");
      setCurrentQuestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answer) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/evalverse/mcq/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_answer: answer })
      });

      if (!response.ok) throw new Error("Failed to evaluate answer");

      const result = await response.json();
      console.log(result);

      const next = questionsAnswered + 1;
      setQuestionsAnswered(next);

      if (next >= n) {
        navigate('/hr-question');
      } else {
        loadNextQuestion();
      }

    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Error submitting answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    console.log(selectedAnswer);
    if (selectedAnswer !== null) {
      submitAnswer(selectedAnswer);
    } else {
      alert("Please select an option before submitting.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Skill Assessment</h1>
          <p className="mt-2 text-gray-600">Question {questionsAnswered + 1} of {n}</p>
        </div>

        <div className="flex justify-center">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="ml-2 text-lg">Loading question...</p>
            </div>
          ) : currentQuestion ? (
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{currentQuestion.question_text}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {currentQuestion.options.map((option, index) => {
                return (
                  <div key={index} className="flex items-start space-x-2 p-3 rounded-md hover:bg-slate-50">
                    <RadioGroupItem id={`option-${index}`} value={option} className="mt-1" />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                      {option}
                    </Label>
                  </div>
                );
              })}

                </RadioGroup>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null || isSubmitting}
                  className="bg-theme-blue-500 hover:bg-theme-blue-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <p className="text-red-600">Something went wrong. Please refresh.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
