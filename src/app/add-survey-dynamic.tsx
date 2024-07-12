import { Input } from "@/components/ui/input";
import {
  household_eng_dynamic,
  QuestionToRepeat,
  QuestionTypeDynamic,
} from "@/data/household_module/household_eng";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import AppFormReactSelect from "@/components/common/app-form-react-select";
import { Option } from "@/types/user";
import AppCreateableReactSelect from "@/components/common/app-createable-react-select";
import AppFormReactSelect from "@/components/common/app-form-react-select";
import { useState } from "react";
import { modifiedResponseData } from "@/lib/validate-response";
import { Pencil1Icon } from "@radix-ui/react-icons";

type Response = {
  [key: number | string]: string | number | Option[] | Response[];
};

const DynamicQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(
    household_eng_dynamic[0]
  );
  const [repeatQuestions, setRepeatQuestions] = useState<QuestionToRepeat[]>();
  const [repeatQuestionsResponse, setRepeatQuestionsResponse] =
    useState<Response>({});
  const [currentRepeatQuestion, setCurrentRepeatQuestion] =
    useState<QuestionToRepeat>();
  const [repeatCount, setRepeatCount] = useState(0);
  const [open, setOpen] = useState(false);
  
  const [repeatQuestionResponseArray, setRepeatQuestionResponseArray] =
    useState<Response[]>([]);
  const [questionOptions, setQuestionOptions] = useState<Option[]>();
  // console.log('repeatQuestionResponseArray', repeatQuestionResponseArray)

  // console.log("questionOptions", questionOptions);

  const getOptions = async (
    question: QuestionTypeDynamic | QuestionToRepeat
  ) => {
    if (question.options && question.options.length > 0) {
      setQuestionOptions(
        question.options?.map((item) => ({ label: item, value: item }))
      );
      return;
    } else {
      if (question.optionsResult && !question.dependentOnQuestionId) {
        const response = await fetch(question?.optionsResult);
        const data = await response.json();
        setQuestionOptions(
          data?.map((item: string) => ({ label: item, value: item })) || []
        );
      }
      if (question.optionsResult && question.dependentOnQuestionId) {
        const response = await fetch(question?.optionsResult);
        const data = await response.json();
        const selectedPrevRespose = (
          responses[question.prevQuestionId!] as Option[]
        )?.[0].value;
        setQuestionOptions(
          data[selectedPrevRespose]?.map((item: string) => ({
            label: item,
            value: item,
          })) || []
        );
      }
    }
  };

  const printResponse = () => {
    // const data: Response = {
    //   "1": "67",
    //   "2": [
    //     {
    //       label: "Bubanza",
    //       value: "Bubanza",
    //     },
    //   ],
    //   "3": [
    //     {
    //       label: "Gihanga",
    //       value: "Gihanga",
    //     },
    //   ],
    //   "4": [
    //     {
    //       label: "Domaine Militaire",
    //       value: "Domaine Militaire",
    //     },
    //   ],
    //   "5": [
    //     {
    //       label: "Domaine Militaire",
    //       value: "Domaine Militaire",
    //     },
    //   ],
    //   "6": [
    //     {
    //       label: "No",
    //       value: "No",
    //     },
    //   ],
    //   "9": [
    //     {
    //       label: "Yes",
    //       value: "Yes",
    //     },
    //   ],
    //   "10": [
    //     {
    //       label: "Dog",
    //       value: "Dog",
    //     },
    //     {
    //       label: "Cat",
    //       value: "Cat",
    //     },
    //     {
    //       label: "Bird",
    //       value: "Bird",
    //     },
    //   ],
    //   "11": "6",
    //   "12": "siddhartha@gmail.com",
    //   "13": [
    //     {
    //       label: "English",
    //       value: "English",
    //     },
    //   ],
    //   "14": [
    //     {
    //       label: "Reading",
    //       value: "Reading",
    //     },
    //     {
    //       label: "Sports",
    //       value: "Sports",
    //     },
    //   ],
    //   "15": [
    //     {
    //       "111": "Archana Kumari",
    //       "222": "43",
    //     },
    //     {
    //       "111": "Ratna Priya",
    //       "222": "26",
    //     },
    //     {
    //       "111": "Manoj Singh",
    //       "222": "55",
    //     },
    //   ],
    //   "16": [
    //     {
    //       label: "Comic",
    //       value: "Comic",
    //     },
    //     {
    //       label: "Horror",
    //       value: "Horror",
    //     },
    //   ],
    // };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {};

    Object.entries(responses).forEach(([key, value]) => {
      if (
        Array.isArray(value) &&
        value.length === 1 &&
        typeof value[0] === "object" &&
        "value" in value[0]
      ) {
        updatedData[key] = value[0].value; // If length is 1, add as string
      } else if (
        Array.isArray(value) &&
        value.every(
          (item) =>
            typeof item === "object" && "label" in item && "value" in item
        )
      ) {
        updatedData[key] = value.map((item) => item.value); // If length > 1 and all items have label and value, add as string[]
      } else {
        updatedData[key] = value; // For other types of values, just copy as-is
      }
    });
    console.log("responses", responses);
    console.log("updatedData", updatedData);
  };

  const [responses, setResponses] = useState<Response>({});
  // console.log("repeatQuestionsResponse", repeatQuestionsResponse);
  // console.log("repeatCount", repeatCount);
  const renderQuestion = (
    question: QuestionTypeDynamic,
    responsesData: Response,
    setResponseData: React.Dispatch<React.SetStateAction<Response>>
  ) => {
    switch (question.type) {
      case "number":
      case "text":
        return (
          <Input
            id={question.id.toString()}
            value={
              typeof responsesData[question.id] === "object" ||
              !responsesData[question.id]
                ? ""
                : (responsesData[question.id] as string)
            }
            onChange={(event) =>
              handleInputChange(
                question.id,
                event.target.value,
                setResponseData
              )
            }
          />
        );
      case "single-select":
        if (!questionOptions) {
          getOptions(question);
        }
        return (
          <AppFormReactSelect
            options={questionOptions || []}
            label=""
            isOptionsLoading={false}
            placeholder={question.question}
            selectType="single"
            direction="column"
            className="col-span-2 -mt-1"
            selected={
              responsesData[question.id]
                ? (responsesData[question.id] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.id, value, setResponseData);
            }}
          />
        );
      case "single-select-others":
        if (!questionOptions) {
          getOptions(question);
        }
        return (
          <AppCreateableReactSelect
            options={questionOptions || []}
            label=""
            isOptionsLoading={false}
            placeholder={question.question}
            selectType="single"
            direction="column"
            className="col-span-2 -mt-1"
            selected={
              responsesData[question.id]
                ? (responsesData[question.id] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.id, value, setResponseData);
            }}
          />
        );
      case "multi-select":
        if (!questionOptions) {
          getOptions(question);
        }

        return (
          <AppFormReactSelect
            options={questionOptions || []}
            label=""
            isOptionsLoading={false}
            placeholder={question.question}
            selectType="multi"
            direction="column"
            className="col-span-2 -mt-1"
            selected={
              responsesData[question.id]
                ? (responsesData[question.id] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.id, value, setResponseData);
            }}
          />
        );
      case "multi-select-others":
        if (!questionOptions) {
          getOptions(question);
        }

        return (
          <AppCreateableReactSelect
            options={questionOptions || []}
            label=""
            isOptionsLoading={false}
            placeholder={question.question}
            selectType="multi"
            direction="column"
            className="col-span-2 -mt-1"
            selected={
              responsesData[question.id]
                ? (responsesData[question.id] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.id, value, setResponseData);
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleInputChange = (
    id: number,
    value: string,
    setResponseData: React.Dispatch<React.SetStateAction<Response>>
  ) => {
    setResponseData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleNextQuestion = (question: QuestionTypeDynamic) => {
    setQuestionOptions(undefined);
    // Dont do anything if next question id is null
    if (!question?.nextQuestionId && !question?.conditions?.nextQuestionId) {
      return;
    }

    if (
      question.questionsToRepeat &&
      typeof responses[question.id] !== "object"
    ) {
      setRepeatCount(responses[question.id] as number);
      setRepeatQuestions(question?.questionsToRepeat);
      setCurrentRepeatQuestion(question?.questionsToRepeat?.[0]);
      setOpen(true);
      return;
    }

    // If we have some conditions then based on that navigate to either next question or else question
    if (question.conditions) {
      if (
        question.conditions.showIf ===
        (responses[question.id] as Option[])?.[0].value
      ) {
        const next = household_eng_dynamic.find(
          (item) => item.id === question?.conditions?.nextQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      } else {
        const next = household_eng_dynamic.find(
          (item) => item.id === question?.conditions?.elseQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      }
      // If we donot have conditions then just set the next question id
    } else {
      const next = household_eng_dynamic.find(
        (item) => item.id === question?.nextQuestionId
      );
      if (next) {
        setCurrentQuestion(next);
      }
    }
  };

  const handlePrevQuestion = (question: QuestionTypeDynamic) => {
    setQuestionOptions(undefined);
    setResponses((prevData) => ({
      ...prevData,
      [question.id]: "",
      // [question.prevQuestionId!]: "",
    }));
    if (!question?.prevQuestionId) {
      return;
    }
    const prev = household_eng_dynamic.find(
      (item) => item.id === question.prevQuestionId
    );
    if (prev) {
      setCurrentQuestion(prev);
    }
  };

  const handleNextRepeatQuestion = (question?: QuestionToRepeat) => {
    setQuestionOptions(undefined);
    if (question) {
      const next = repeatQuestions?.find(
        (item) => item.id === question?.nextQuestionId
      );
      if (next) {
        setCurrentRepeatQuestion(next);
      }

      if (!next && repeatQuestions?.length) {
        setRepeatCount((prevCount) => prevCount - 1);

        if (repeatCount <= (responses[currentQuestion.id] as number)) {
          setCurrentRepeatQuestion(repeatQuestions?.[0]);
          setRepeatQuestionResponseArray((prevData) => [
            ...(prevData as Response[]),
            repeatQuestionsResponse,
          ]);
          setRepeatQuestionsResponse({});
        }

        if (repeatCount === 1) {
          setCurrentRepeatQuestion(undefined);
          setRepeatCount(0);
          setOpen(false);
          const next = household_eng_dynamic?.find(
            (item) => item.id === currentQuestion?.nextQuestionId
          );
          if (next) {
            setCurrentQuestion(next);
          }
          setResponses((prevData) => {
            return {
              ...prevData,
              [currentQuestion.id]: [
                ...repeatQuestionResponseArray,
                repeatQuestionsResponse,
              ],
            };
          });
          setRepeatQuestionResponseArray([]);
        }
      }
    }
  };

  const handlePrevRepeatQuestion = (question?: QuestionToRepeat) => {
    setQuestionOptions(undefined);
    if (question) {
      //
      const prev = repeatQuestions?.find(
        (item) => item.id === question?.prevQuestionId
      );
      if (prev) {
        setCurrentRepeatQuestion(prev);
      }
    }
  };

  // console.log("responses", responses);

  return (
    <div>
      <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">Dynamic Questionnaire</h2>
      {household_eng_dynamic.findIndex(quest => quest.id === currentQuestion.id) + 1} / {household_eng_dynamic.length}
      <Button variant={'outline'} className="p-0 w-9" onClick={() => {
        setResponses(modifiedResponseData)
      }}>
        <Pencil1Icon className="p-0"/>
      </Button>
      </div>
      <Card className="max-w-[30rem] mt-5">
        <CardHeader className="pb-3">
          <CardTitle>{currentQuestion.question}</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {currentQuestion.instructions}
          </CardDescription>
          <div className="grid w-full items-center gap-1.5 mt-5">
            {renderQuestion(currentQuestion, responses, setResponses)}
          </div>
        </CardHeader>
        <CardFooter className="flex items-center justify-between mt-5">
          <Button
            type="button"
            onClick={() => handlePrevQuestion(currentQuestion)}
            disabled={!currentQuestion.prevQuestionId}
          >
            Prev
          </Button>
          <Button
            type="button"
            onClick={() => handleNextQuestion(currentQuestion)}
            disabled={!responses[currentQuestion.id]}
          >
            Next
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px] top-[20%]"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {currentRepeatQuestion?.question} -{" "}
              {
                repeatQuestionsResponse[
                  currentRepeatQuestion?.loopHeadingQuestionId as number
                ] as string
              }
            </DialogTitle>
            <DialogDescription>
              {currentRepeatQuestion?.instructions} for{" "}
              {
                repeatQuestionsResponse[
                  currentRepeatQuestion?.loopHeadingQuestionId as number
                ] as string
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {currentRepeatQuestion &&
              renderQuestion(
                currentRepeatQuestion,
                repeatQuestionsResponse,
                setRepeatQuestionsResponse
              )}
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              onClick={() => handlePrevRepeatQuestion(currentRepeatQuestion)}
              disabled={!currentRepeatQuestion?.prevQuestionId}
            >
              Prev
            </Button>
            <Button
              type="button"
              onClick={() => handleNextRepeatQuestion(currentRepeatQuestion)}
              disabled={
                currentRepeatQuestion?.id
                  ? !repeatQuestionsResponse[currentRepeatQuestion?.id]
                  : false
              }
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button type="submit" className="mt-5" onClick={printResponse}>
        Submit
      </Button>
    </div>
  );
};

export default DynamicQuestionnaire;
