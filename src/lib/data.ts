  export type Info = {
    id: string;
    amount: number;
    name: string;
    CIK: string;
    Company: string;
    forms: string;
    date: string;
    CompanyCIK: string;
    Bio: string;
    formList: Form[];
  };

  export type Form = {
    id: string;
    type: string;
    URL: string;
    filingDate: string;
  };