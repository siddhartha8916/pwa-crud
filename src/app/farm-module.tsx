import { Input } from "@/components/ui/input";
import {
  farm_module_questions,
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
  handleKeyDown,
  requestGeolocationPermission,
} from "@/lib/utils";

let newMultiSelectQuestions: QuestionTypeDynamic[] = [];

type Response = {
  [key: number | string]: string | number | Option[] | Response[];
};

const FarmModuleDynamicQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(
    farm_module_questions[0]
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

  const handleOptions = async (
    question: QuestionTypeDynamic | QuestionToRepeat,
    selectType: string,
    responsesData: Response
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
        console.log("data :>> ", data);
        const dependentQuestion =
          farm_module_questions.find(
            (item) => item.id === question.dependentOptionsOnQuestionId
          ) ||
          currentQuestion.questionsToRepeat?.find(
            (item) => item.id === question.dependentOptionsOnQuestionId
          );

        let opts: Option[] = [];
        if (dependentQuestion) {
          const selectedPrevRespose = (
            responsesData[dependentQuestion.apiName!] as Option[]
          )?.[0].value;
          opts =
            data[selectedPrevRespose]?.map((item: string) => ({
              label: item,
              value: item,
            })) || [];
          if (["single-select-others"].includes(selectType)) {
            opts.push({ label: "Others", value: "Others" });
          }
        }
        if (opts.length === 0) {
          opts.push({ label: "NA", value: "-" });
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
    // console.log("Getting User Location :>> ");
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
  console.log("responses", responses);
  const [multiSelectConditionalResponses, setMultiSelectConditionalResponses] =
    useState<Response>({});
  // console.log("repeatQuestionsResponse", repeatQuestionsResponse);
  // console.log("repeatCount", repeatCount);
  // console.log(
  //   "multiSelectConditionalResponses :>> ",
  //   multiSelectConditionalResponses
  // );

  const renderQuestion = (
    question: QuestionTypeDynamic,
    responsesData: Response,
    setResponseData: React.Dispatch<React.SetStateAction<Response>>
  ) => {
    switch (question.type) {
      case "number":
        return (
          <Input
            id={question.apiName.toString()}
            value={(responsesData[question.apiName] as string) || ""}
            onChange={(event) =>
              handleInputChange(
                question.apiName,
                event.target.value,
                setResponseData
              )
            }
            type="number"
            onKeyDown={(event) => handleKeyDown(event, question.validationRule)}
          />
        );
      case "text":
        return (
          <Input
            id={question.apiName.toString()}
            value={(responsesData[question.apiName] as string) || ""}
            onChange={(event) =>
              handleInputChange(
                question.apiName,
                event.target.value,
                setResponseData
              )
            }
            type="text"
            onKeyDown={(event) => handleKeyDown(event, question.validationRule)}
          />
        );
      case "single-select":
        if (!questionOptions) {
          handleOptions(question, "single-select", responsesData);
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
              responsesData[question.apiName]
                ? (responsesData[question.apiName] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.apiName, value, setResponseData);
            }}
          />
        );
      case "single-select-others":
        if (!questionOptions) {
          handleOptions(question, "single-select-others", responsesData);
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
              responsesData[question.apiName]
                ? (responsesData[question.apiName] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.apiName, value, setResponseData);
            }}
          />
        );
      case "multi-select":
        if (!questionOptions) {
          handleOptions(question, "multi-select", responsesData);
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
              responsesData[question.apiName]
                ? (responsesData[question.apiName] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.apiName, value, setResponseData);
            }}
          />
        );
      case "multi-select-others":
        if (!questionOptions) {
          handleOptions(question, "multi-select-others", responsesData);
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
              responsesData[question.apiName]
                ? (responsesData[question.apiName] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.apiName, value, setResponseData);
            }}
          />
        );
      case "multi-select-conditional":
        if (!questionOptions) {
          handleOptions(question, "multi-select-conditional", responsesData);
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
              responsesData[question.apiName]
                ? (responsesData[question.apiName] as Option[])
                : null
            }
            setSelected={(value) => {
              handleInputChange(question.apiName, value, setResponseData);
            }}
          />
        );
      case "gps":
        return (
          <>
            <Input
              id={question.apiName.toString()}
              value={(responsesData[question.apiName] as string) || ""}
              disabled
            />
            <Button
              onClick={() => getUserLocation(question.apiName, setResponseData)}
            >
              Get Location
            </Button>
          </>
        );
      case "date":
        return (
          <Input
            id={question.apiName.toString()}
            value={(responsesData[question.apiName] as string) || ""}
            onChange={(event) =>
              handleInputChange(
                question.apiName,
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
    // console.log('question :>> ', question);

    // Handle those questions which are in the way like
    // If user selects some multi-options only show
    // those questions next which matches those selected options
    if (
      question.type === "multi-select-conditional" &&
      question?.conditionalQuestions
    ) {
      const value = responses[question.apiName];
      const selectedOptions = (value as Option[]).map((item) => item.value);

      const filteredQuestions = question.conditionalQuestions.filter((item) =>
        selectedOptions.includes(item.showIfMultiConditionalValue!)
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
      !responses[question.loopQuestionsResponseKey!]
    ) {
      console.log("running :>> ", question);
      setRepeatCount(responses[question.apiName] as number);
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
        (responses[question.apiName] as Option[])?.[0].value
      ) {
        const next = farm_module_questions.find(
          (item) => item.id === question?.conditions?.nextQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      } else {
        const next = farm_module_questions.find(
          (item) => item.id === question?.conditions?.elseQuestionId
        );
        if (next) {
          setCurrentQuestion(next);
        }
      }
      // If we donot have conditions then just set the next question id
    } else {
      const next = farm_module_questions.find(
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
      [question.apiName]: "",
      [(question.loopQuestionsResponseKey as keyof typeof prevData) ?? ""]: "",
      // [question.prevQuestionId!]: "",
    }));
    if (!question?.prevQuestionId) {
      return;
    }
    const prev = farm_module_questions.find(
      (item) => item.id === question.prevQuestionId
    );
    if (prev) {
      setCurrentQuestion(prev);
    }
  };

  const handleNextRepeatQuestion = (question?: QuestionToRepeat) => {
    setQuestionOptions(undefined);
    if (question) {
      if (question.conditions) {
        if (
          question.conditions.showIf ===
          (repeatQuestionsResponse[question.apiName] as Option[])?.[0].value
        ) {
          const next = repeatQuestions?.find(
            (item) => item.id === question?.conditions?.nextQuestionId
          );
          if (next) {
            setCurrentRepeatQuestion(next);
          }
        } else {
          const next = repeatQuestions?.find(
            (item) => item.id === question?.conditions?.elseQuestionId
          );
          if (next) {
            setCurrentRepeatQuestion(next);
          }
          // TODO : Duplicated Code
          if (!next && repeatQuestions?.length) {
            setRepeatCount((prevCount) => prevCount + 1);

            if (
              typeof responses[currentQuestion.apiName] === "string" &&
              repeatCount < +(responses[currentQuestion.apiName] as number)
            ) {
              setCurrentRepeatQuestion(repeatQuestions?.[0]);
              setRepeatQuestionResponseArray((prevData) => [
                ...(prevData as Response[]),
                repeatQuestionsResponse,
              ]);
              setRepeatQuestionsResponse({});
            }

            if (
              typeof responses[currentQuestion.apiName] === "object" &&
              repeatCount <
                (responses[currentQuestion.apiName] as Option[]).length
            ) {
              setCurrentRepeatQuestion(repeatQuestions?.[0]);
              setRepeatQuestionResponseArray((prevData) => [
                ...(prevData as Response[]),
                {
                  ...repeatQuestionsResponse,
                  [currentQuestion.conditionalLoopKeyName as string]: (
                    responses[currentQuestion.apiName] as Option[]
                  )[repeatCount].value as string,
                },
              ]);
              setRepeatQuestionsResponse({});
            }

            const isNumberValue =
              typeof responses[currentQuestion.apiName] === "string" &&
              repeatCount ===
                +(responses[currentQuestion.apiName] as number) - 1;

            const isObjectValue =
              typeof responses[currentQuestion.apiName] === "object" &&
              currentQuestion.type === "multi-select-conditional-loop" &&
              repeatCount ===
                (responses[currentQuestion.apiName] as Option[]).length - 1;

            if (isNumberValue || isObjectValue) {
              setCurrentRepeatQuestion(undefined);
              setRepeatCount(0);
              setOpen(false);
              const next = farm_module_questions?.find(
                (item) => item.id === currentQuestion?.nextQuestionId
              );
              if (next) {
                setCurrentQuestion(next);
              }
              if (isNumberValue) {
                setResponses((prevData) => {
                  return {
                    ...prevData,
                    [currentQuestion.loopQuestionsResponseKey!]: [
                      ...repeatQuestionResponseArray,
                      repeatQuestionsResponse,
                    ],
                  };
                });
              } else {
                setResponses((prevData) => {
                  return {
                    ...prevData,
                    [currentQuestion.loopQuestionsResponseKey!]: [
                      ...repeatQuestionResponseArray,
                      {
                        ...repeatQuestionsResponse,
                        [currentQuestion.conditionalLoopKeyName as string]: (
                          responses[currentQuestion.apiName] as Option[]
                        )[repeatCount].value as string,
                      },
                    ],
                  };
                });
              }

              setRepeatQuestionResponseArray([]);
            }
          }
        }
        // If we donot have conditions then just set the next question id
      } else {
        const next = repeatQuestions?.find(
          (item) => item.id === question?.nextQuestionId
        );

        if (next) {
          setCurrentRepeatQuestion(next);
        }
        // TODO : Duplicated Code
        if (!next && repeatQuestions?.length) {
          setRepeatCount((prevCount) => prevCount + 1);

          if (
            typeof responses[currentQuestion.apiName] === "string" &&
            repeatCount < +(responses[currentQuestion.apiName] as number)
          ) {
            setCurrentRepeatQuestion(repeatQuestions?.[0]);
            setRepeatQuestionResponseArray((prevData) => [
              ...(prevData as Response[]),
              repeatQuestionsResponse,
            ]);
            setRepeatQuestionsResponse({});
          }

          if (
            typeof responses[currentQuestion.apiName] === "object" &&
            repeatCount <
              (responses[currentQuestion.apiName] as Option[]).length
          ) {
            setCurrentRepeatQuestion(repeatQuestions?.[0]);
            setRepeatQuestionResponseArray((prevData) => [
              ...(prevData as Response[]),
              {
                ...repeatQuestionsResponse,
                [currentQuestion.conditionalLoopKeyName as string]: (
                  responses[currentQuestion.apiName] as Option[]
                )[repeatCount].value as string,
              },
            ]);
            setRepeatQuestionsResponse({});
          }

          const isNumberValue =
            typeof responses[currentQuestion.apiName] === "string" &&
            repeatCount === +(responses[currentQuestion.apiName] as number) - 1;

          const isObjectValue =
            typeof responses[currentQuestion.apiName] === "object" &&
            currentQuestion.type === "multi-select-conditional-loop" &&
            repeatCount ===
              (responses[currentQuestion.apiName] as Option[]).length - 1;

          if (isNumberValue || isObjectValue) {
            setCurrentRepeatQuestion(undefined);
            setRepeatCount(0);
            setOpen(false);
            const next = farm_module_questions?.find(
              (item) => item.id === currentQuestion?.nextQuestionId
            );
            if (next) {
              setCurrentQuestion(next);
            }
            if (isNumberValue) {
              setResponses((prevData) => {
                return {
                  ...prevData,
                  [currentQuestion.loopQuestionsResponseKey!]: [
                    ...repeatQuestionResponseArray,
                    repeatQuestionsResponse,
                  ],
                };
              });
            } else {
              setResponses((prevData) => {
                return {
                  ...prevData,
                  [currentQuestion.loopQuestionsResponseKey!]: [
                    ...repeatQuestionResponseArray,
                    {
                      ...repeatQuestionsResponse,
                      [currentQuestion.conditionalLoopKeyName as string]: (
                        responses[currentQuestion.apiName] as Option[]
                      )[repeatCount].value as string,
                    },
                  ],
                };
              });
            }

            setRepeatQuestionResponseArray([]);
          }
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

  const loopHeadingQuestion = repeatQuestions?.find(
    (item) =>
      item.loopHeadingQuestionId ===
      currentRepeatQuestion?.loopHeadingQuestionId
  );
  const loopHeadingText = repeatQuestionsResponse[
    loopHeadingQuestion?.apiName as string
  ] as string;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Farm Dynamic Questionnaire</h2>
        {farm_module_questions.findIndex(
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
        </CardHeader>
        <div className="grid w-full items-center gap-1.5 mt-5 p-3">
          {renderQuestion(currentQuestion, responses, setResponses)}
        </div>
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
            disabled={!responses[currentQuestion.apiName]}
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
              {currentRepeatQuestion?.question} - {loopHeadingText}
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
                  ? !repeatQuestionsResponse[currentRepeatQuestion?.apiName]
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
            <Button
              type="button"
              onClick={() => handlePreviousClick()}
              disabled={currentMultiSelectConditionalQuestionIndex === 0}
            >
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

export default FarmModuleDynamicQuestionnaire;
