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
  validationRule: number;
  instructions: string;
  nextQuestionId?: number | null;
  prevQuestionId: number | null;
  conditions?: {
    showIf: string;
    nextQuestionId: number;
    elseQuestionId: number;
  };
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
    question: "Do you have children?",
    instructions: "Please enter Do you have children...",
    type: "single-select",
    validationRule: 7,
    options: ["Yes", "No"],
    prevQuestionId: 1,
    conditions: {
      showIf: "Yes",
      nextQuestionId: 3,
      elseQuestionId: 5,
    },
  },
  {
    id: 3,
    question: "How many children do you have?",
    instructions: "Please enter How many children do you have...",
    type: "number",
    validationRule: 1,
    nextQuestionId: 4,
    prevQuestionId: 2,
  },
  {
    id: 4,
    question: "What are their ages?",
    instructions: "Please enter children's ages?...",
    type: "text",
    validationRule: 1,
    nextQuestionId: 5,
    prevQuestionId: 2,
  },
  {
    id: 5,
    question: "Do you own a pet?",
    instructions: "Please enter Do you own a pet...",
    type: "single-select",
    options: ["Yes", "No"],
    validationRule: 7,
    prevQuestionId: 2,
    conditions: {
      showIf: "Yes",
      nextQuestionId: 6,
      elseQuestionId: 8,
    },
  },
  {
    id: 6,
    question: "What kind of pet(s) do you have?",
    instructions: "Please enter What kind of pet(s) do you have...",
    type: "multi-select",
    options: ["Dog", "Cat", "Bird", "Other"],
    validationRule: 4,
    prevQuestionId: 5,
    nextQuestionId: 7,
  },
  {
    id: 7,
    question: "How old is your pet?",
    instructions: "Please enter How old is your pet...",
    type: "number",
    validationRule: 1,
    prevQuestionId: 6,
    nextQuestionId: 8,
  },
  {
    id: 8,
    question: "Enter your email address:",
    instructions: "Please enter your email address...",
    type: "text",
    prevQuestionId: 5,
    validationRule: 8,
    nextQuestionId: 9,
  },
  {
    id: 9,
    question: "Which languages do you speak?",
    instructions: "Please select all that apply...",
    type: "multi-select",
    options: ["English", "Spanish", "French", "German", "Other"],
    validationRule: 7,
    prevQuestionId: 8,
    nextQuestionId: 10,
  },
  {
    id: 10,
    question: "Which hobbies do you enjoy?",
    instructions: "Please select all that apply...",
    type: "multi-select",
    options: ["Reading", "Sports", "Cooking", "Gardening", "Traveling"],
    validationRule: 7,
    prevQuestionId: 9,
    nextQuestionId: null,
  },
];
