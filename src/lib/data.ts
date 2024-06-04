export const data: Info[] = [
    {
      id: "0001201633",
      amount: 316,
      name: "Samueli, Henry",
      CIK: "0001201633",
      Company: "Random Company",
      forms: "4, 8-k, 10-k",
      date: "2023-03-01"
    },
    {
      id: "0000000001",
      amount: 242,
      name: "A",
      CIK: "0000000001",
      Company: "Random Company",
      forms: "4",
      date: "2023-03-01"
    },
    {
      id: "0000000002",
      amount: 837,
      name: "B",
      CIK: "0000000002",
      Company: "Random Company",
      forms: "4",
      date: "2023-03-01"
    },
    {
      id: "0000000003",
      amount: 874,
      name: "C",
      CIK: "0000000003",
      Company: "Random Company",
      forms: "4",
      date: "2023-03-01"
    },
    {
      id: "0000000004",
      amount: 721,
      name: "D",
      CIK: "0000000004",
      Company: "Random Company",
      forms: "4",
      date: "2023-03-01"
    },
  ]
  
  export type Info = {
    id: string;
    amount: number;
    name: string;
    CIK: string;
    Company: string;
    forms: string;
    date: string;
  };
  