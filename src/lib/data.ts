export const data: Info[] = [
    {
      id: "0001201633",
      amount: 316,
      name: "Samueli, Henry",
      CIK: "0001201633",
      forms: "4",
      formlink: "https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml"
    },
    {
      id: "0000000001",
      amount: 242,
      name: "A",
      CIK: "0000000001",
      forms: "4",
      formlink: "https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml"
    },
    {
      id: "0000000002",
      amount: 837,
      name: "B",
      CIK: "0000000002",
      forms: "4",
      formlink: "https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml"
    },
    {
      id: "0000000003",
      amount: 874,
      name: "C",
      CIK: "0000000003",
      forms: "4",
      formlink: "https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml"
    },
    {
      id: "0000000004",
      amount: 721,
      name: "D",
      CIK: "0000000004",
      forms: "4",
      formlink: "https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml"
    },
  ]
  
  export type Info = {
    id: string;
    amount: number;
    name: string;
    CIK: string;
    forms: string;
    formlink: string;
  };
  