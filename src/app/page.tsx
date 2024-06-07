'use client'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { data } from '../lib/data.ts';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import columns from './columns';
import React, {useState} from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Info = {
  CIK: string
  status: string
  name: string
  company: string
  forms: string
  mostrecent: string
  amount: number
}

export default function Home() {
  // const [data, setData] = useState<Info[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className="grid min-h-screen w-full ">
      <div className="flex flex-col">
        <header className="flex h-40 items-center gap-4 px-4">
          <div className="w-full flex-1">
          <div className="flex h-20 items-center px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-3xl">
              <span className="">UCI SEC TOOL</span>
            </Link>
          </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Search by Name
              </CardTitle>
            </CardHeader>
            <CardContent>
            <Input
              placeholder="eg. Henry Samueli"
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Search by Form Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="eg. 4"
                value={(table.getColumn("forms")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("forms")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Search by CIK...
              </CardTitle>
            </CardHeader>
            <CardContent>
            <Input
              placeholder="eg. 0001201633"
              value={(table.getColumn("CIK")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("CIK")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filter by</CardTitle>
            </CardHeader>
            <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>  
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                    onClick={() => {
                      const filterValue = table.getColumn("Status")?.getFilterValue() === "Confirmed" ? "" : "Confirmed";
                      table.getColumn("Status")?.setFilterValue(filterValue);
                    }}
                    >
                    Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    onClick={() => {
                      const filterValue = table.getColumn("Status")?.getFilterValue() === "Unconfirmed" ? "" : "Unconfirmed";
                      table.getColumn("Status")?.setFilterValue(filterValue);
                    }}
                    >
                    Unconfirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    onClick={() => {
                      const filterValue = table.getColumn("Status")?.getFilterValue() === "Misidentified" ? "" : "Misidentified";
                      table.getColumn("Status")?.setFilterValue(filterValue);
                    }}
                    >
                    Misidentified
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
                </Card>
              </div>
                <Tabs defaultValue="Table of UCI Alumni">
                <TabsList>
                  <TabsTrigger value="Table of UCI Alumni">Table of UCI Alumni</TabsTrigger>
                  <TabsTrigger value="BadDataTable">Partial Name Table</TabsTrigger>
                </TabsList>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
                <TabsContent value="Table of UCI Alumni">
                <Table>
                  <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
              </TabsContent>
            <TabsContent value="BadDataTable">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partial Name</TableHead>
                    <TableHead>Bio Sentence</TableHead>
                    <TableHead>DEF14A URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>ABC</TableCell>
                    <TableCell>ABC is a uci alumni</TableCell>
                    <TableCell>http</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell>ABC</TableCell>
                    <TableCell>ABC is a uci alumni</TableCell>
                    <TableCell>http</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            </div>
          </Tabs>
      </main>
      </div>
     </div>
  )
}
