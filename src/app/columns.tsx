import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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


export const columns = (updateStatus: (id: string, newStatus: string) => void): ColumnDef<Info>[] => [
    {
  accessorKey: "status",  // Make sure to use the correct key
  enableSorting: true,
  enableHiding: true,
  cell: ({ row }) => {
    const [status, setStatus] = useState<string>(row.getValue<string>("status"));

    const handleChange = async (newStatus: string) => {
      setStatus(newStatus);
      updateStatus(row.original.id, newStatus);

      // Send update request to the server
      const response = await fetch(`http://localhost:5001/api/update-status/${row.original.id}`, {
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
          <SelectItem value="Unverified">Unverified</SelectItem>
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
          <SheetTrigger>
        <Button variant="link" className="mb-2 mt-2 rounded-full">
          {row.getValue("name")}
        </Button>
          </SheetTrigger>
          <SheetContent className="max-h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl text-center">
            <div>{row.getValue("name")}</div>
            <div className="mt-2 mb-2">
          <Badge variant="outline">{row.getValue("status")}</Badge>
            </div>
          </SheetTitle>
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
              <Separator className="my-4" />
              <p>Note: there might be multiple company names associated with one company CIK, please identify which through reviewing forms.</p>
              <p>Company CIK: {row.original.CompanyCIK}</p>
              <p>Company Name: {row.original.Company} </p>
              <Separator className="my-4" />
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
    // {
    //   accessorKey: "Company",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Company
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     )
    //   },
    //   cell: ({ row }) => (
    //     <TooltipProvider>
    //       <Tooltip>
    //         <TooltipTrigger><Button variant="link" onClick={() => navigator.clipboard.writeText(row.original.CompanyCIK)}>{row.getValue("Company")}</Button></TooltipTrigger>
    //         <TooltipContent>
    //           <p>{row.original.CompanyCIK}</p>
    //         </TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
    //   ),
    // },
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
    {
      accessorKey: "sharePrice",
      header: ({ column }) => {
        return (
          <div className = 'text-right'>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Shares Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("sharePrice"))
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)
  
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <div className = 'text-right'>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Total Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const total = parseFloat(row.getValue("total"));
        // Format the amount as a dollar amount with two decimal points
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(total)
        
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
