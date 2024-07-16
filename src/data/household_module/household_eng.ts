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
  // ID of the question
  id: number | string;
  // Question Text
  question: string;
  // Type of the questions, like number, text, select, etc
  type: string;
  // Only add this is the type is select. Populate with string[].
  // If options are to be fetched from backend provide empty array
  // Add the api URL value to optionsResult string property next to fetch data as string[]
  options?: string[];
  optionsResult?: string;
  // Add this in case you want the question options to be dependent on some other question value
  dependentOptionsOnQuestionId?: number | string;
  // Validation rules for the question defined in Validation Rules property
  validationRule: number;
  // Simple text description or some hint to be displayed below the question
  instructions: string;
  // Provide next question id to jump If next button is clicked
  // Next Question id to be null if the question contains some conditions based on selection
  nextQuestionId?: number | string | null;
  // Provide previous question id to jump if prev button is clicked
  prevQuestionId: number | string | null;
  // Add conditions if the next question is based on some selected value
  conditions?: {
    // Value to match the condition
    showIf: string;
    // Next question if value matches
    nextQuestionId: number | string;
    // Else question if value not matches
    elseQuestionId: number | string;
  };
  // Enable Some question to be used as loop
  repeatFlag?: boolean;
  // What all questions to loop at
  questionsToRepeat?: QuestionToRepeat[];

  showIfMultiConditionalValue?: string | number;
  choiceBaseQuestionId?: string | number;
};

export type QuestionToRepeat = {
  // Instructions similar to that of QuestionTypeDynamic
  id: number | string;
  question: string;
  type: string;
  options?: string[];
  optionsResult?: string;
  dependentOptionsOnQuestionId?: number | string;
  validationRule: number;
  instructions: string;
  nextQuestionId?: number | string | null;
  prevQuestionId: number | string | null;
  // Loop's main question id to provide some info about which question user is filling information
  // The value for loop's main question will be populated
  loopHeadingQuestionId: number | string;
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
    dependentOptionsOnQuestionId: 2,
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
    dependentOptionsOnQuestionId: 3,
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
    dependentOptionsOnQuestionId: 4,
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

export const household_module_questions: QuestionTypeDynamic[] = [
  {
    id: "gps",
    question: "GPS location",
    type: "gps",
    validationRule: 1,
    instructions: "Please select your GPS location...",
    nextQuestionId: "province",
    prevQuestionId: null,
  },
  {
    id: "province",
    question: "Please select province",
    instructions: "Please select the province that apply...",
    type: "single-select",
    options: [],
    optionsResult: "https://pwa-api.brainstacktechnologies.com/api/v1/province",
    validationRule: 7,
    prevQuestionId: "gps",
    nextQuestionId: "commune",
  },
  {
    id: "commune",
    question: "Please select commune",
    instructions: "Select the commune within the chosen province.",
    type: "single-select",
    options: [],
    optionsResult:
      "https://pwa-api.brainstacktechnologies.com/api/v1/province-commune",
    validationRule: 7,
    dependentOptionsOnQuestionId: "province",
    prevQuestionId: "province",
    nextQuestionId: "hill_coline",
  },
  {
    id: "hill_coline",
    question: "Please select Hill - Coline",
    instructions: "Select the hill_coline within the chosen commune.",
    type: "single-select-others",
    options: [],
    optionsResult:
      "https://pwa-api.brainstacktechnologies.com/api/v1/commune-hill",
    dependentOptionsOnQuestionId: "commune",
    validationRule: 7,
    prevQuestionId: "commune",
    conditions: {
      showIf: "Others",
      nextQuestionId: 'hill_coline_others',
      elseQuestionId: "subhill",
    },
  },
  {
    id: 'hill_coline_others',
    question: "Enter your hill",
    instructions: "Please enter your hill...",
    type: "text",
    validationRule: 8,
    prevQuestionId: 'commune',
    nextQuestionId: 'subhill',
  },
  {
    id: "subhill",
    question: "Please select Subhill",
    instructions: "Select the subhill within the chosen hill_coline.",
    type: "single-select-others",
    options: [],
    optionsResult:
      "https://pwa-api.brainstacktechnologies.com/api/v1/hill-subhill",
    dependentOptionsOnQuestionId: 4,
    validationRule: 7,
    prevQuestionId: "hill_coline",
    conditions: {
      showIf: "Others",
      nextQuestionId: 'subhill_others',
      elseQuestionId: "hh_members_quantity",
    },

  },
  {
    id: 'subhill_others',
    question: "Enter your subhill",
    instructions: "Please enter your subhill...",
    type: "text",
    validationRule: 8,
    prevQuestionId: 'subhill',
    nextQuestionId: 'hh_members_quantity',
  },
  {
    id: "hh_members_quantity",
    question: "How many members make up your household ?",
    instructions: "Please enter the count of household members...",
    type: "number",
    validationRule: 1,
    prevQuestionId: "subhill",
    nextQuestionId: "hh_perm_workers",
    questionsToRepeat: [
      {
        id: "hh_name",
        question: "Name of household member - ",
        type: "text",
        validationRule: 1,
        instructions: "Please enter the member name...",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: null,
        nextQuestionId: "hh_surname",
      },
      {
        id: "hh_surname",
        question: "Surname of household member?",
        type: "number",
        validationRule: 1,
        instructions: "Please enter the member age...",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "hh_name",
        nextQuestionId: "sex",
      },
      {
        id: "sex",
        question: "Gender of household member?",
        type: "single-select",
        options: ["Male", "Female"],
        validationRule: 1,
        instructions: "Please enter the gender for",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "hh_surname",
        nextQuestionId: "dob",
      },
      {
        id: "dob",
        question: "Date of Birth of household member?",
        type: "date",
        validationRule: 1,
        instructions: "Please enter the date of birth for",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "sex",
        nextQuestionId: "literacy",
      },
      {
        id: "literacy",
        question: "Can household member read and write?",
        type: "single-select",
        options: ["Yes", "No"],
        validationRule: 1,
        instructions: "Please enter the date of birth for",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "dob",
        nextQuestionId: "education",
      },
      {
        id: "education",
        question: "Household member education level",
        type: "single-select",
        options: [
          "None",
          "Ecole primaire (1-6)",
          "Enseignement fondamental (1-9)",
          "Collège (7-10)",
          "Lycée général (11–13)",
          "Études postfondamentales générales (10–12)",
          "Collège- Lycée technique (7–13)",
          "Enseignement secondaire technique (10–12)",
          "University",
        ],
        validationRule: 1,
        instructions: "Please enter the education level for",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "literacy",
        nextQuestionId: "hh_relationship",
      },
      {
        id: "hh_relationship",
        question: "Relation of household member with HH head",
        type: "single-select-others",
        options: [
          "Self (I am the hh head)",
          "Spouse",
          "Son/ daughter",
          "Father/mother",
        ],
        validationRule: 1,
        instructions:
          "Please select the relation. If not found enter and press create",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "education",
        nextQuestionId: "hh_activities",
      },
      {
        id: "hh_activities",
        question: "What economic activities are performed by - ",
        type: "multi-select-others",
        options: [
          "Coffee production and sales",
          "Other crop production and sales",
          "Livestock raising and sales",
          "Livestock by-product production and sale",
          "Business outside farm",
          "Employment outside farm",
          "Temporary labor outside farm",
          "None",
        ],
        validationRule: 1,
        instructions:
          "Please select the activities performed by the member. If not found enter and press create",
        loopHeadingQuestionId: "hh_name",
        prevQuestionId: "hh_relationship",
        nextQuestionId: null,
      },
    ],
  },
  {
    id: "hh_perm_workers",
    question: "Does the household have permanent workers for the farm?",
    instructions:
      "Permanent hired labor refers to employees contracted for long-term or indefinite work with consistent wages and benefits",
    type: "single-select",
    options: ["Yes", "No"],
    prevQuestionId: "hh_members_quantity",
    conditions: {
      showIf: "Yes",
      nextQuestionId: "hh_perm_workers_salary",
      elseQuestionId: "hh_assets",
    },
    validationRule: 7,
  },
  {
    id: "hh_perm_workers_salary",
    question: "Monthly salary for one permanent worker?",
    instructions:
      "Average monthly salary paid to a permanent worker who works in any farm activity.",
    type: "text",
    validationRule: 7,
    prevQuestionId: "hh_perm_workers",
    nextQuestionId: "hh_perm_workers_days_week",
  },
  {
    id: "hh_perm_workers_days_week",
    question: "Total days per week worked by one permanent worker",
    instructions:
      "Average number of days worked per week by a permanent worker on the farm for all activities.",
    type: "single-select",
    options: ["1", "2", "3", "4", "5", "6", "7"],
    validationRule: 7,
    prevQuestionId: "hh_perm_workers_salary",
    nextQuestionId: "hh_perm_workers_hr_day",
  },
  {
    id: "hh_perm_workers_hr_day",
    question: "Total hours per day worked by one permanent worker",
    instructions:
      "Average number of hours worked per day by a permanent worker on the farm for all activities.",
    type: "single-select",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    validationRule: 7,
    prevQuestionId: "hh_perm_workers_days_week",
    nextQuestionId: "hh_assets",
  },
  {
    id: "hh_assets",
    question: "Select items currently owned by the household",
    instructions:
      "Average number of hours worked per day by a permanent worker on the farm for all activities.",
    type: "multi-select-conditional",
    options: [
      "None",
      "Bed or drying mat",
      "Bicycles",
      "Car",
      "Concrete patios (useful life of approximately 10 years)",
      "Domestic scale processing equipment",
      "Fermentation boxes",
      "Harvest baskets",
      "Harvest hooks",
      "Hoes, machetes",
      "Irrigation equipment (pumps, pipes, etc.)",
      "Power generation equipment",
      "Storage or processing structures",
      "Motorcycles",
      "Office equipment (for example, computers)",
      "Pruning implements",
      "Spray equipment",
      "Telephone",
      "Tractors",
      "Vans",
      "Wheelbarrows or wagons",
      "Others",
    ],
    validationRule: 7,
    prevQuestionId: "hh_perm_workers_hr_day",
    nextQuestionId: 'submit_survey',
  },
  {
    id: "hh_assets_bed_num",
    choiceBaseQuestionId: "hh_assets",
    showIfMultiConditionalValue: "Bed or drying mat",
    question: "How many beds or drying mats?",
    type: "text",
    validationRule: 1,
    instructions: "Please enter the number of beds or drying mats",
    prevQuestionId: null,
    nextQuestionId: null,
  },
  {
    id: "hh_assets_bed_value",
    choiceBaseQuestionId: "hh_assets",
    showIfMultiConditionalValue: "Bed or drying mat",
    question: "Value beds or drying mats?",
    type: "text",
    validationRule: 1,
    instructions: "Please enter the Value beds or drying mats",
    prevQuestionId: null,
    nextQuestionId: null,
  },
  {
    id: "hh_assets_bicycles_num",
    choiceBaseQuestionId: "hh_assets",
    showIfMultiConditionalValue: "Bicycles",
    question: "How many bicycles?",
    type: "text",
    validationRule: 1,
    instructions: "Please enter the number of bicycles",
    prevQuestionId: null,
    nextQuestionId: null,
  },
  {
    id: "hh_assets_bicycles_value",
    choiceBaseQuestionId: "hh_assets",
    showIfMultiConditionalValue: "Bicycles",
    question: "Value bicycles?",
    type: "text",
    validationRule: 1,
    instructions: "Please enter the value of bicycles",
    prevQuestionId: null,
    nextQuestionId: null,
  },
  {
    id: "hh_assets_cars_num",
    choiceBaseQuestionId: "hh_assets",
    showIfMultiConditionalValue: "Car",
    question: "How many cars?",
    type: "text",
    validationRule: 1,
    instructions: "Please enter the number of cars",
    prevQuestionId: null,
    nextQuestionId: null,
  },
  {
    id: "hh_assets_cars_value",
    choiceBaseQuestionId: "hh_assets",
    showIfMultiConditionalValue: "Car",
    question: "Value cars?",
    type: "text",
    validationRule: 1,
    instructions: "Please enter the value of cars",
    prevQuestionId: null,
    nextQuestionId: null,
  },
];
