/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import {
  household_eng_dynamic,
  QuestionTypeDynamic,
} from "@/data/household_module/household_eng";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppFormReactSelect from "@/components/common/app-form-react-select";
import { Option } from "@/types/user";




const DynamicQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(
    household_eng_dynamic[0]
  );
  const [responses, setResponses] = useState<{
    [key: number]: string | number | Option[];
  }>({});

  const renderQuestion = (question: QuestionTypeDynamic) => {
    switch (question.type) {
      case "number":
      case "text":
        return (
          <Input
            id={currentQuestion.id.toString()}
            value={responses[currentQuestion.id] as string || ""}
            onChange={(event) =>
              handleInputChange(currentQuestion.id, event.target.value)
            }
          />
        );
      case "single-select":
        return (
          <Select
            onValueChange={(value) =>
              handleInputChange(currentQuestion.id, value)
            }
            defaultValue={responses[currentQuestion?.id]?.toString() || ""}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={question.question} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{question.id}</SelectLabel>
                {question?.options?.map((item) => {
                  return (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "multi-select":
        return (
          <AppFormReactSelect
            options={
              question.options?.map((item) => ({ label: item, value: item })) ||
              []
            }
            label=""
            isOptionsLoading={false}
            placeholder={question.question}
            selectType="multi"
            direction="column"
            className="col-span-2 -mt-1"
            selected={
              responses[currentQuestion.id] ? responses[currentQuestion.id] as Option[] : null
            }
            setSelected={(value) => {
              handleInputChange(currentQuestion.id, value);
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleInputChange = (id: number, value: string) => {
    setResponses((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleNextQuestion = (currentQuestion: QuestionTypeDynamic) => {
    // Dont do anything if next question id is null
    if (
      !currentQuestion?.nextQuestionId &&
      !currentQuestion?.conditions?.nextQuestionId
    ) {
      return;
    }

    // If we have some conditions then based on that navigate to either next question or else question
    if (currentQuestion.conditions) {
      if (currentQuestion.conditions.showIf === responses[currentQuestion.id]) {
        const next = household_eng_dynamic.find(
          (item) => item.id === currentQuestion?.conditions?.nextQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      } else {
        const next = household_eng_dynamic.find(
          (item) => item.id === currentQuestion?.conditions?.elseQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      }
      // If we donot have conditions then just set the next question id
    } else {
      const next = household_eng_dynamic.find(
        (item) => item.id === currentQuestion?.nextQuestionId
      );
      if (next) {
        setCurrentQuestion(next);
      }
    }
  };

  const handlePrevQuestion = (currentQuestion: QuestionTypeDynamic) => {
    setResponses((prevData) => ({ ...prevData, [currentQuestion.id]: "" }));
    if (!currentQuestion?.prevQuestionId) {
      return;
    }
    const prev = household_eng_dynamic.find(
      (item) => item.id === currentQuestion.prevQuestionId
    );
    if (prev) {
      setCurrentQuestion(prev);
    }
  };

  console.log("responses", responses);

  return (
    <div>
      <h2 className="text-lg font-medium">Dynamic Questionnaire</h2>
      <Card className="max-w-[30rem] mt-5">
        <CardHeader className="pb-3">
          <CardTitle>{currentQuestion.question}</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {currentQuestion.instructions}
          </CardDescription>
          <div className="grid w-full items-center gap-1.5 mt-5">
            {renderQuestion(currentQuestion)}
          </div>
        </CardHeader>
        <CardFooter className="flex items-center justify-between mt-5">
          <Button
            type="button"
            onClick={() => handlePrevQuestion(currentQuestion)}
          >
            Prev
          </Button>
          <Button
            type="button"
            onClick={() => handleNextQuestion(currentQuestion)}
          >
            Next
          </Button>
        </CardFooter>
      </Card>

      <Button
        type="submit"
        className="mt-5"
        onClick={() => console.log(responses)}
      >
        Submit
      </Button>
    </div>
  );
};

export default DynamicQuestionnaire;
