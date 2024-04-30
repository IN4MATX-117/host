import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-mono font-bold">UCI Advancement</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://www.sec.gov/edgar/search/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supported by SEC.gov{" "}
          </a>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        UCI SEC TOOL
      </h1>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="CIK" id="CIK" placeholder="CIK" />
      <Input type="Name" id="Name" placeholder="Name" />
      {/* <Input type="Company" id="Company" placeholder="Company" /> */}
      <Button type="submit">Search</Button>
      </div>
      <div className="max-h-80 overflow-y-auto w-full">
      <Table>
      <TableCaption>A list of UCI wealthy alumnis.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="w-[100px]">CIK</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Forms</TableHead>
          <TableHead className="text-right">Estimated Assets</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell><Checkbox/></TableCell>
          <TableCell className="font-medium">0001835896</TableCell>
          <TableCell>Chapman, April R.</TableCell>
          <TableCell>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>10-k, 8-k, 4</AccordionTrigger>
              <AccordionContent>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://www.sec.gov/Archives/edgar/data/832480/000114036124016714/utg10k2023.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
              Form 10-k{" "}
              </a>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://www.sec.gov/Archives/edgar/data/832480/000083248023000017/utg8k06072023.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
              Form 8-k{" "}
              </a>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://www.sec.gov/Archives/edgar/data/832480/000183589623000001/xslF345X05/primary_doc.xml"
                target="_blank"
                rel="noopener noreferrer"
              >
              Form 4{" "}
              </a>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
            </TableCell>
          <TableCell className="text-right">$123,123,231.03</TableCell>
        </TableRow>

        <TableRow>
          <TableCell><Checkbox/></TableCell>
          <TableCell className="font-medium">0001201633</TableCell>
          <TableCell>Samueli, Henry</TableCell>
          <TableCell>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>4</AccordionTrigger>
              <AccordionContent>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml"
                target="_blank"
                rel="noopener noreferrer"
              >
              Form 4{" "}
              </a>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
            </TableCell>
          <TableCell className="text-right">$123,123,231.03</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </div>
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>

    </main>
  );
}
