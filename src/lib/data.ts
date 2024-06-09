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
    status: string;
    formList: Form[];
  };

  export type Form = {
    id: string;
    type: string;
    URL: string;
    filingDate: string;
  };

  export type BadInfo = {
    id: string;
    name: string;
    bio: string;
    URL: string;
    form: string;
  };
