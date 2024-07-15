import { QuestionTypeDynamic } from "@/data/household_module/household_eng";
import { z, ZodError } from "zod";

const apiJSONQuestions: QuestionTypeDynamic[] = [
  {
    id: 1,
    question: "What is your age?",
    type: "number",
    validationRule: 1,
    instructions: "Please enter your age in numbers...",
    nextQuestionId: 2,
    prevQuestionId: null,
  },
  {
    id: 2,
    question: "Please select province",
    instructions: "Please select the province that apply...",
    type: "single-select",
    options: [],
    optionsResult: "https://pwa-api.brainstacktechnologies.com/api/v1/province",
    validationRule: 7,
    prevQuestionId: 1,
    nextQuestionId: 3,
  },
  {
    id: 3,
    question: "Please select commune",
    instructions: "Select the commune within the chosen province.",
    type: "single-select",
    options: [],
    optionsResult:
      "https://pwa-api.brainstacktechnologies.com/api/v1/province-commune",
    validationRule: 7,
    dependentOnQuestionId: 2,
    prevQuestionId: 2,
    nextQuestionId: 4,
  },
  {
    id: 4,
    question: "Please select Hill - Coline",
    instructions: "Select the hill_coline within the chosen commune.",
    type: "single-select-others",
    options: [],
    optionsResult:
      "https://pwa-api.brainstacktechnologies.com/api/v1/commune-hill",
    dependentOnQuestionId: 3,
    validationRule: 7,
    prevQuestionId: 3,
    nextQuestionId: 5,
  },
  {
    id: 5,
    question: "Please select Subhill",
    instructions: "Select the subhill within the chosen hill_coline.",
    type: "single-select-others",
    options: [],
    optionsResult:
      "https://pwa-api.brainstacktechnologies.com/api/v1/hill-subhill",
    dependentOnQuestionId: 4,
    validationRule: 7,
    prevQuestionId: 4,
    nextQuestionId: 6,
  },
  {
    id: 6,
    question: "Do you have children?",
    instructions: "Please enter Do you have children...",
    type: "single-select",
    validationRule: 7,
    options: ["Yes", "No"],
    prevQuestionId: 5,
    conditions: {
      showIf: "Yes",
      nextQuestionId: 7,
      elseQuestionId: 9,
    },
  },
  {
    id: 7,
    question: "What are the sum of their ages?",
    instructions: "Please enter sum of their ages...",
    type: "number",
    validationRule: 1,
    prevQuestionId: 6,
    nextQuestionId: 8,
  },
  {
    id: 8,
    question: "Do they like mangoes?",
    instructions: "Please select...",
    type: "single-select",
    validationRule: 7,
    options: ["Yes", "No"],
    prevQuestionId: 7,
    nextQuestionId: 9,
  },
  {
    id: 9,
    question: "Do you own a pet?",
    instructions: "Please enter Do you own a pet...",
    type: "single-select",
    options: ["Yes", "No"],
    validationRule: 7,
    prevQuestionId: 2,
    conditions: {
      showIf: "Yes",
      nextQuestionId: 10,
      elseQuestionId: 12,
    },
  },
  {
    id: 10,
    question: "What kind of pet(s) do you have?",
    instructions: "Please enter What kind of pet(s) do you have...",
    type: "multi-select-others",
    options: ["Dog", "Cat", "Bird"],
    validationRule: 4,
    prevQuestionId: 9,
    nextQuestionId: 11,
  },
  {
    id: 11,
    question: "How old is your pet?",
    instructions: "Please enter How old is your pet...",
    type: "number",
    validationRule: 1,
    prevQuestionId: 10,
    nextQuestionId: 12,
  },
  {
    id: 12,
    question: "Enter your email address:",
    instructions: "Please enter your email address...",
    type: "text",
    validationRule: 8,
    prevQuestionId: 11,
    nextQuestionId: 13,
  },
  {
    id: 13,
    question: "Which language do you speak?",
    instructions:
      "Please select all that apply... Please enter if no values found",
    type: "single-select-others",
    options: ["English", "Spanish", "French", "German"],
    validationRule: 7,
    prevQuestionId: 12,
    nextQuestionId: 14,
  },
  {
    id: 14,
    question: "Which hobbies do you enjoy?",
    instructions: "Please select all that apply...",
    type: "multi-select",
    options: ["Reading", "Sports", "Cooking", "Gardening", "Traveling"],
    validationRule: 7,
    prevQuestionId: 13,
    nextQuestionId: 15,
  },
  {
    id: 15,
    question: "How many household members are there?",
    instructions: "Please enter household members number...",
    type: "number",
    validationRule: 1,
    prevQuestionId: 14,
    nextQuestionId: 16,
    questionsToRepeat: [
      {
        id: 111,
        question: "What is the name?",
        type: "text",
        validationRule: 1,
        instructions: "Please enter the member name...",
        loopHeadingQuestionId: 111,
        prevQuestionId: null,
        nextQuestionId: 222,
      },
      {
        id: 222,
        question: "What is the age?",
        type: "number",
        validationRule: 1,
        instructions: "Please enter the member age...",
        loopHeadingQuestionId: 111,
        prevQuestionId: 111,
        nextQuestionId: null,
      },
    ],
  },
  {
    id: 16,
    question: "Which books do you read?",
    instructions: "Please select all that apply...",
    type: "multi-select",
    options: ["Comic", "Horror", "Thriller", "Sci-Fi", "Others"],
    validationRule: 7,
    prevQuestionId: 15,
    nextQuestionId: null,
  },
];

export const QuestionToRepeatSchema = z.object({
  id: z.union([z.number(), z.string()]),
  question: z.string(),
  type: z.string(),
  options: z.array(z.string()).optional(),
  optionsResult: z.string().optional(),
  dependentOnQuestionId: z.number().optional(),
  validationRule: z.number(),
  instructions: z.string(),
  nextQuestionId: z.number().nullable().optional(),
  prevQuestionId: z.number().nullable(),
  loopHeadingQuestionId: z.number(),
});

export const QuestionTypeDynamicSchema = z.object({
  id: z.union([z.number(), z.string()]),
  question: z.string(),
  type: z.string(),
  options: z.array(z.string()).optional(),
  optionsResult: z.string().optional(),
  dependentOnQuestionId: z.number().optional(),
  validationRule: z.number(),
  instructions: z.string(),
  nextQuestionId: z.number().nullable().optional(),
  prevQuestionId: z.number().nullable(),
  conditions: z
    .object({
      showIf: z.string(),
      nextQuestionId: z.number(),
      elseQuestionId: z.number(),
    })
    .optional(),
  repeatFlag: z.boolean().optional(),
  questionsToRepeat: z.array(QuestionToRepeatSchema).optional(),
});

export const validateJSONSchema = () => {
  try {
    // Validate each object in the apiJSONQuestions array against QuestionTypeDynamicSchema
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    apiJSONQuestions.forEach((obj, _index) => {
      //   const validatedData = QuestionTypeDynamicSchema.parse(obj);
      //   console.log(`Object at index ${index} is valid:`, validatedData);
      QuestionTypeDynamicSchema.parse(obj);
    });
  } catch (error) {
    // If validation fails for any object, handle the error
    if (error instanceof ZodError) {
      console.error("Validation error:", error.errors);
    } else {
      console.error("Unexpected error during validation:", error);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiResponseData: any = {
  "1": "67",
  "2": "Bubanza",
  "3": "Gihanga",
  "4": "Domaine Militaire",
  "5": "Domaine Militaire",
  "6": "No",
  "9": "Yes",
  "10": ["Dog", "Cat", "Bird"],
  "11": "6",
  "12": "siddhartha@gmail.com",
  "13": "English",
  "14": ["Reading", "Sports"],
  "15": [
    {
      "111": "Archana Kumari",
      "222": "43",
    },
    {
      "111": "Ratna Priya",
      "222": "26",
    },
    {
      "111": "Manoj Singh",
      "222": "55",
    },
  ],
  "16": ["Comic", "Horror"],
};

export const modifiedResponseData = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modifiedData: Record<string, any> = {};

  Object.entries(apiResponseData).forEach(([key, value]) => {
    const currentQuestionResponse = apiJSONQuestions.find(
      (item) => item.id === Number(key)
    );
    if (currentQuestionResponse) {
      if (
        [
          "single-select",
          "single-select-others",
          "multi-select",
          "multi-select-others",
        ].includes(currentQuestionResponse?.type) &&
        typeof value === "string"
      ) {
        // console.log('apiResponseData[key]', apiResponseData[key])
        modifiedData[key] = [
          {
            label: apiResponseData[key],
            value: apiResponseData[key],
          },
        ];
      } else if (
        [
          "single-select",
          "single-select-others",
          "multi-select",
          "multi-select-others",
        ].includes(currentQuestionResponse?.type) &&
        Array.isArray(value) &&
        value.length > 1
      ) {
        modifiedData[key] = value.map((item) => ({ label: item, value: item }));
      } else {
        modifiedData[key] = apiResponseData[key];
      }
    }
  });

  return modifiedData;
};
