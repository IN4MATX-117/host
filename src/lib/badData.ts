export const badData: BadInfo[] = [
    {
      id: "0001201633",
      name: "ABC",
      bio: "Here is the bio for Henry Samueli",
      form: "DEF 14A",
      URL: "https://www.sec.gov/Archives/edgar/data/0001201633/000120163322000002/0001201633-22-000002-index.htm"
    }
  ]
  
  export type BadInfo = {
    id: string;
    name: string;
    bio: string;
    URL: string;
    form: string;
  };
  