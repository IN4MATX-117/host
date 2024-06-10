import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
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
import {CommentBox} from './comment.tsx';
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
  accessorKey: "status",  // Make sure to use the correct key
  enableSorting: false,
  enableHiding: false,
  cell: ({ row }) => {
    const [status, setStatus] = useState<string>(row.getValue<string>("status"));

    const handleChange = async (newStatus: string) => {
      setStatus(newStatus);

      // Send update request to the server
      const response = await fetch(`http://localhost:5000/api/update-status/${row.original.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        console.error('Failed to update status');
      }
    };

    return (
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{status}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Confirmed">Confirmed</SelectItem>
          <SelectItem value="Misidentified">Misidentified</SelectItem>
          <SelectItem value="Unconfirmed">Unconfirmed</SelectItem>
        </SelectContent>
      </Select>
    );
  },
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
            <SheetTitle>{row.getValue("name")}<Badge variant="outline">{row.getValue("status")}</Badge></SheetTitle>
            <SheetDescription>
              <p>{row.original.Bio}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Filed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {row.original.formList.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell><a href={form.URL}>{form.type}</a></TableCell>
                      <TableCell>{form.filingDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <CommentBox personId={row.original.id} />
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
            <TooltipTrigger><Button variant="link" onClick={() => navigator.clipboard.writeText(row.original.CompanyCIK)}>{row.getValue("Company")}</Button></TooltipTrigger>
            <TooltipContent>
              <p>{row.original.CompanyCIK}</p>
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
