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
    sharePrice: number;
    total: number;
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
    CompanyCIK: string;
    form: string;
  };
