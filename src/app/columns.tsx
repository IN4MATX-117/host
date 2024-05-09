import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Info } from '../lib/data.ts';

export const columns: ColumnDef<Info>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        // <Checkbox
        //   checked={row.getIsSelected()}
        //   onCheckedChange={(value) => row.toggleSelected(!!value)}
        //   aria-label="Select row"
        // />
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                {/* <SelectItem value="TBD">TBD</SelectItem> */}
                <SelectItem value="Error">Error</SelectItem>
            </SelectContent>
        </Select>

      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "CIK",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CIK
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("CIK")}</div>,
    },
    {
      accessorKey: "forms",
      header: "Forms",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{row.getValue("forms")}</AccordionTrigger>
                <AccordionContent>
                <a href="https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml" target="_blank" rel="noopener noreferrer">
                  {/* will change this to {row.getValue("formlink") later} */}
                  {row.getValue("forms")}
                </a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div className = 'text-right'>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
   
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const Info = row.original
   
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(Info.id)}
    //           >
    //             Copy Info ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View Info details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     )
    //   },
    // },
  ]

export default columns;
