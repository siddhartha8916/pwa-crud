/* eslint-disable @typescript-eslint/no-explicit-any */
export type OptionMapping = {
  [key: string]: string[];
};

export type QuestionType = {
  [key: string]: {
    id: string;
    type: string;
    label: string;
    instructions: string;
    referenceFile?: string[] | OptionMapping;
    postAction?: any;
  };
};

import { all_province } from "./all-province";
import { province_commune_mapping } from "./province-commune-mapping";

export const household_eng: QuestionType = {
  gps: {
    id: "gps",
    type: "gps",
    label: "GPS location",
    instructions: "Please take GPS location of the house by clicking...",
  },
  province: {
    id: "province",
    type: "select",
    label: "Province",
    instructions: "Select the province where the household is located.",
    referenceFile: all_province,
    postAction: {
      id: "commune",
    },
  },
  commune: {
    id: "commune",
    type: "select",
    label: "Commune",
    instructions: "Select the commune within the chosen province.",
    referenceFile: province_commune_mapping,
  },
  hill_coline: {
    id: "hill_coline",
    type: "select",
    label: "Hill - Coline",
    instructions: "Select the hill_coline within the chosen commune.",
  },
  hill_coline_other: {
    id: "hill_coline_other",
    type: "text",
    label: "Other, specify",
    instructions: "Specify the Hill - Coline if 'Other' is selected.",
  },
  subhill: {
    id: "subhill",
    type: "select",
    label: "Subhill",
    instructions: "Select the subhill within the chosen hill_coline.",
  },
  subhill_other: {
    id: "subhill_other",
    type: "text",
    label: "Other, specify",
    instructions: "Specify the Subhill if 'Other' is selected.",
  },
};

export const householdMembersQuestion = {
  quantity: {
    id: "hh_members_quantity",
    type: "number",
    label: "Number of household members",
    note: "Specify how many members are in the household.",
  },
  members: [
    {
      name: {
        id: "hh_name",
        type: "text",
        label: "Name of household member",
        note: "Enter the name of household member.",
      },
      surname: {
        id: "hh_surname",
        type: "text",
        label: "Surname of household member",
        note: "Enter the surname of household member.",
      },
      sex: {
        id: "sex",
        type: "select",
        label: "Gender of household member #1",
        options: ["Male", "Female"],
        note: "Enter the gender of household member.",
      },
      dob: {
        id: "dob",
        type: "date",
        label: "Date of Birth of household member",
        note: "Enter the Date of Birth of household member.",
      },
      literacy: {
        id: "literacy",
        type: "select",
        options: ["Read only", "Write only", "Both read and write", "No"],
        label: "Can household member read and write",
        note: "Enter the literacy of household member.",
      },
      education: {
        id: "education",
        type: "select",
        options: [
          "Ecole primaire (1-6)",
          "Enseignement fondamental (1-9)",
          "Collège (7-10)",
          "Lycée général (11–13)",
          "Études postfondamentales générales (10–12)",
          "Collège- Lycée technique (7–13)",
          "Enseignement secondaire technique (10–12)",
          "University",
          "None",
        ],
        label: "Education level of household member",
        note: "Enter the education level of household member.",
      },
      hh_relationship: {
        id: "hh_relationship",
        type: "select",
        options: ["Self", "Spouse", "Son/ daughter", "Father/mother"],
        label: "Relation of household member with Household Head",
        note: "Enter the hh_relationship of household member.",
      },
      hh_relationship_other: {
        id: "hh_relationship_other",
        type: "text",
        label: "Enter the household relationship other than specified above",
        note: "Enter the hh_relationship of household member.",
      },
    },
    // Repeat for each household member up to the maximum defined in hh_members_quantity
  ],
};

export type QuestionTypeDynamic = {
  id: number;
  question: string;
  type: string;
  options?: string[];
  optionsResult?: string;
  dependentOnQuestionId?: number;
  validationRule: number;
  instructions: string;
  nextQuestionId?: number | null;
  prevQuestionId: number | null;
  conditions?: {
    showIf: string;
    nextQuestionId: number;
    elseQuestionId: number;
  };
  repeatFlag?: boolean;
  questionsToRepeat?: QuestionToRepeat[];
};

export type QuestionToRepeat = {
  id: number;
  question: string;
  type: string;
  options?: string[];
  optionsResult?: string;
  dependentOnQuestionId?:number
  validationRule: number;
  instructions: string;
  nextQuestionId?: number | null;
  prevQuestionId: number | null;
  loopHeadingQuestionId: number;
};

export const validationRule = {
  1: "Only Numbers without Decimal",
  2: "Only Numbers with Decimal",
  3: "Only Alphabets",
  4: "Only Alphabets With Spaces",
  5: "Only Alphabets and Numbers",
  6: "Only Alphabets and Numbers With Spaces",
  7: "Any Charcter Input",
  8: "Email Validation",
};

export const household_eng_dynamic: QuestionTypeDynamic[] = [
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
    prevQuestionId: 1,
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
