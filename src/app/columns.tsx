import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {TextareaForm} from './comment.tsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export const columns: ColumnDef<Info>[] = [
    {
      accessorKey: "Status",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="Misidentified">Misidentified</SelectItem>
                <SelectItem value="Unconfirmed">Unconfirmed</SelectItem>
            </SelectContent>
        </Select>

      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Sheet>
        <SheetTrigger><Button variant="link">{row.getValue("name")}</Button></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Henry Samueli<Badge variant="outline">Confirmed</Badge></SheetTitle>
            <SheetDescription>
              Here is the bio for Henry Samueli
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Filed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>4</TableCell>
                    <TableCell>2023-03-01</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>8-K</TableCell>
                    <TableCell>2023-03-01</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>10-K</TableCell>
                    <TableCell>2023-03-01</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <TextareaForm />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
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
      cell: ({ row }) => 
        <div className="lowercase">
          <Popover>
            <PopoverTrigger><Button variant="link" 
          onClick={() => navigator.clipboard.writeText(row.getValue("CIK"))}>{row.getValue("CIK")}</Button></PopoverTrigger>
            <PopoverContent>CIK copied</PopoverContent>
          </Popover>
            </div>
    },
    {
      accessorKey: "Company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><Button variant="link">{row.getValue("Company")}</Button></TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue("CompanyCIK")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "forms",
      header: "Forms",
      cell: ({ row }) => {
        return (
          <div className="capitalize">{row.getValue("forms")}</div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Most Recent Filing Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("date")}</div>,
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
              Shares Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        // Format the amount as a dollar amount
        // const formatted = new Intl.NumberFormat("en-US", {
        //   style: "currency",
        //   currency: "USD",
        // }).format(amount)
  
        return <div className="text-right font-medium">{amount}</div>
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
