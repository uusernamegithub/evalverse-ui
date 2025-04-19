
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";

const QuizQuestion = ({ question, onSubmit, isLoading }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onSubmit(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  if (!question) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-theme-blue-500" />
            <p className="ml-2 text-lg">Loading question...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 rounded-md hover:bg-slate-50">
              <RadioGroupItem id={`option-${index}`} value={option} className="mt-1" />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={selectedAnswer === null || isLoading}
          className="bg-theme-blue-500 hover:bg-theme-blue-600"
        >
          {isLoading ? (
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
  );
};

export default QuizQuestion;
