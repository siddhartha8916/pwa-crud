import { Input } from "@/components/ui/input";
import {
  household_module_questions,
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
import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { I_AddSurveyBody, Option } from "@/types/user";
import AppCreateableReactSelect from "@/components/common/app-createable-react-select";
import AppFormReactSelect from "@/components/common/app-form-react-select";
import { useState } from "react";
import { modifiedResponseData } from "@/lib/validate-response";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useAddHouseholdInfo } from "@/services/app-survey";
import {
  convertToArrayOfValues,
  getCurrentPosition,
  requestGeolocationPermission,
} from "@/lib/utils";

let newMultiSelectQuestions: QuestionTypeDynamic[] = [];

type Response = {
  [key: number | string]: string | number | Option[] | Response[];
};

const HouseholdModuleDynamicQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(
    household_module_questions[0]
  );
  const [repeatQuestions, setRepeatQuestions] = useState<QuestionToRepeat[]>();
  const { mutateAsync: addHouseholdInfo } = useAddHouseholdInfo();
  const [repeatQuestionsResponse, setRepeatQuestionsResponse] =
    useState<Response>({});
  const [currentRepeatQuestion, setCurrentRepeatQuestion] =
    useState<QuestionToRepeat>();
  const [repeatCount, setRepeatCount] = useState(0);
  const [open, setOpen] = useState(false);

  const [repeatQuestionResponseArray, setRepeatQuestionResponseArray] =
    useState<Response[]>([]);
  const [questionOptions, setQuestionOptions] = useState<Option[]>();

  const [
    openMultiSelectConditionalDialog,
    setOpenMultiSelectConditionalDialog,
  ] = useState(false);
  const [
    currentMultiSelectConditionalQuestionIndex,
    setCurrentMultiSelectConditionalQuestionIndex,
  ] = useState(0);

  // console.log('repeatQuestionResponseArray', repeatQuestionResponseArray)

  // console.log("questionOptions", questionOptions);

  const getOptions = async (
    question: QuestionTypeDynamic | QuestionToRepeat,
    selectType: string
  ) => {
    if (question.options && question.options.length > 0) {
      setQuestionOptions(
        question.options?.map((item) => ({ label: item, value: item }))
      );
      return;
    } else {
      if (question.optionsResult && !question.dependentOptionsOnQuestionId) {
        const response = await fetch(question?.optionsResult);
        const data = await response.json();
        const opts: Option[] =
          data?.map((item: string) => ({ label: item, value: item })) || [];
        if (["single-select-others"].includes(selectType)) {
          opts.push({ label: "Others", value: "Others" });
        }
        setQuestionOptions(opts);
      }
      if (question.optionsResult && question.dependentOptionsOnQuestionId) {
        const response = await fetch(question?.optionsResult);
        const data = await response.json();
        const selectedPrevRespose = (
          responses[question.prevQuestionId!] as Option[]
        )?.[0].value;
        const opts: Option[] =
          data[selectedPrevRespose]?.map((item: string) => ({
            label: item,
            value: item,
          })) || [];
        if (["single-select-others"].includes(selectType)) {
          opts.push({ label: "Others", value: "Others" });
        }
        setQuestionOptions(opts);
      }
    }
  };

  const printResponse = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: I_AddSurveyBody = {};

    Object.entries(responses).forEach(([key, value]) => {
      if (
        Array.isArray(value) &&
        value.length === 1 &&
        typeof value[0] === "object" &&
        "value" in value[0]
      ) {
        updatedData[key] = value[0].value as string; // If length is 1, add as string
      } else if (
        Array.isArray(value) &&
        value.every(
          (item) =>
            typeof item === "object" && "label" in item && "value" in item
        )
      ) {
        updatedData[key] = value.map((item) => item.value as string); // If length > 1 and all items have label and value, add as string[]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updatedData[key] = value as any; // For other types of values, just copy as-is
      }
    });
    // console.log("responses", responses);
    const formattedData = convertToArrayOfValues(updatedData);
    // console.log("updatedData", updatedData);
    console.log("formattedData", formattedData);
    // console.log("modifiedResponseData", modifiedResponseData());
    const res = await addHouseholdInfo({
      body: formattedData,
    });
    console.log("res", res);
  };

  const getUserLocation = async (
    questId: string | number,
    setResponseData: React.Dispatch<React.SetStateAction<Response>>
  ) => {
    console.log("Getting User Location :>> ");
    try {
      await requestGeolocationPermission();
      const position = await getCurrentPosition();
      handleInputChange(
        questId,
        `${position.coords.latitude}, ${position.coords.longitude}`,
        setResponseData
      );
    } catch (error) {
      console.log("error :>> ", error);
      if (error instanceof GeolocationPositionError) {
        if (error.code === 1) {
          alert(error.message);
        }
      }
    }
  };

  const [responses, setResponses] = useState<Response>({});
  const [multiSelectConditionalResponses, setMultiSelectConditionalResponses] =
    useState<Response>({});
  // console.log("repeatQuestionsResponse", repeatQuestionsResponse);
  // console.log("repeatCount", repeatCount);
  console.log(
    "multiSelectConditionalResponses :>> ",
    multiSelectConditionalResponses
  );

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
          getOptions(question, "single-select");
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
          getOptions(question, "single-select-others");
        }
        // console.log('questionOptio ', questionOptions);
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
      case "multi-select":
        if (!questionOptions) {
          getOptions(question, "multi-select");
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
          getOptions(question, "multi-select-others");
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
      case "multi-select-conditional":
        if (!questionOptions) {
          getOptions(question, "multi-select-conditional");
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
      case "gps":
        return (
          <>
            <Input
              id={question.id.toString()}
              value={(responsesData[question.id] as string) || ""}
              disabled
            />
            <Button
              onClick={() => getUserLocation(question.id, setResponseData)}
            >
              Get Location
            </Button>
          </>
        );
      case "date":
        return (
          <Input
            id={question.id.toString()}
            value={(responsesData[question.id] as string) || ""}
            onChange={(event) =>
              handleInputChange(
                question.id,
                event.target.value,
                setResponseData
              )
            }
            type="date"
          />
        );

      default:
        return null;
    }
  };

  const handleInputChange = (
    id: number | string,
    value: string,
    setResponseData: React.Dispatch<React.SetStateAction<Response>>
  ) => {
    setResponseData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleNextClick = () => {
    // Increment the current question index to show the next question
    setCurrentMultiSelectConditionalQuestionIndex((prevIndex) => prevIndex + 1);
    if (
      currentMultiSelectConditionalQuestionIndex ===
      newMultiSelectQuestions.length - 1
    ) {
      setOpenMultiSelectConditionalDialog(false);
      setResponses((prevData) => ({
        ...prevData,
        ...multiSelectConditionalResponses,
      }));
      setMultiSelectConditionalResponses({});
    }
  };

  const handlePreviousClick = () => {
    // Decrement the current question index to show the previous question
    setCurrentMultiSelectConditionalQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextQuestion = (question: QuestionTypeDynamic) => {
    setQuestionOptions(undefined);

    if (question.type === "multi-select-conditional") {
      //
      const value = responses[question.id];
      const selectedOptions = (value as Option[]).map((item) => item.value);
      // console.log("selectedOptions :>> ", selectedOptions);
      const nextQuestionsBasedOnSelectedQuestions =
        household_module_questions.filter(
          (item) => item.choiceBaseQuestionId === question.id
        );
      const filteredQuestions = nextQuestionsBasedOnSelectedQuestions.filter(
        (item) => selectedOptions.includes(item.showIfMultiConditionalValue!)
      );
      // setMultiSelectQuestions(filteredQuestions);
      newMultiSelectQuestions = filteredQuestions;
      // console.log("filteredQuestions :>> ", filteredQuestions);
      setCurrentMultiSelectConditionalQuestionIndex(0);
      setOpenMultiSelectConditionalDialog(true);
      return;
    }

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

    //

    // If we have some conditions then based on that navigate to either next question or else question
    if (question.conditions) {
      if (
        question.conditions.showIf ===
        (responses[question.id] as Option[])?.[0].value
      ) {
        const next = household_module_questions.find(
          (item) => item.id === question?.conditions?.nextQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      } else {
        const next = household_module_questions.find(
          (item) => item.id === question?.conditions?.elseQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      }
      // If we donot have conditions then just set the next question id
    } else {
      const next = household_module_questions.find(
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
    const prev = household_module_questions.find(
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
          const next = household_module_questions?.find(
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
console.log('currentQuestion :>> ', currentQuestion);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Household Dynamic Questionnaire</h2>
        {household_module_questions.findIndex(
          (quest) => quest.id === currentQuestion.id
        ) + 1}{" "}
        / {household_module_questions.length}
        <Button
          variant={"outline"}
          className="p-0 w-9"
          onClick={() => {
            setResponses(modifiedResponseData());
          }}
        >
          <Pencil1Icon className="p-0" />
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

      <Dialog
        open={openMultiSelectConditionalDialog}
        onOpenChange={setOpenMultiSelectConditionalDialog}
      >
        <DialogContent
          className="sm:max-w-[425px] top-[20%]"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {
                newMultiSelectQuestions[
                  currentMultiSelectConditionalQuestionIndex
                ]?.question
              }
            </DialogTitle>
            <DialogDescription>
              {
                newMultiSelectQuestions[
                  currentMultiSelectConditionalQuestionIndex
                ]?.instructions
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {newMultiSelectQuestions[
              currentMultiSelectConditionalQuestionIndex
            ] &&
              renderQuestion(
                newMultiSelectQuestions[
                  currentMultiSelectConditionalQuestionIndex
                ],
                multiSelectConditionalResponses,
                setMultiSelectConditionalResponses
              )}
          </div>
          <div className="flex items-center justify-between w-full">
            <Button type="button" onClick={() => handlePreviousClick()}>
              Prev
            </Button>
            <Button type="button" onClick={() => handleNextClick()}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  
      {currentQuestion.nextQuestionId === "submit_survey" && (
        <Button type="submit" className="mt-5" onClick={printResponse}>
          Submit
        </Button>
      )}
    </div>
  );
};

export default HouseholdModuleDynamicQuestionnaire;
