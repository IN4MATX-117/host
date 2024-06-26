'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Info, BadInfo } from '../lib/data.ts';
import {
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
import React, {useEffect, useState} from "react";
import { ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Home() {
  const [data, setData] = useState<Info[]>([]);
  const [badData, setBadData] = useState<BadInfo[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [badDataPagination, setBadDataPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const updateStatus = (id: string, newStatus: string) => {
  setData((prevData) => prevData.map(item =>
    item.id === id ? { ...item, status: newStatus } : item
  ));
};

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:5001/api/data');
      const result = await response.json();

      // Format dates and parse formList
      const formattedData = result.map((item: Info) => ({
        ...item,
        date: formatDate(item.date),
        status: item.status || "Unverified",
        formList: Array.isArray(item.formList) ? item.formList.map((form) => ({
          ...form,
          filingDate: formatDate(form.filingDate),
        })) : [],
      }));

      setData(formattedData);
    }
    fetchData();
  }, []);

  // Fetch bad data
  useEffect(() => {
    async function fetchBadData() {
      const response = await fetch('http://localhost:5001/api/partial-names');
      const result = await response.json();
      setBadData(result);
    }
    fetchBadData();
  }, []);

  const table = useReactTable({
    data,
    columns: columns(updateStatus),
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
      pagination,
    },

    onPaginationChange: setPagination,
  });

  const badDataTable = useReactTable({
    data: badData,
    columns: [
      {
        accessorKey: 'name',
        header: 'Partial Name',
      },
      {
        accessorKey: 'bio',
        header: 'Bio',
        cell: info => info.getValue(),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: badDataPagination,
    },
    onPaginationChange: setBadDataPagination,
  });

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
                    <DropdownMenuRadioGroup value={table.getColumn("status")?.getFilterValue() as string} onValueChange={(value) => table.getColumn("status")?.setFilterValue(value)}>
                      <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Misidentified">Misidentified</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Confirmed">Confirmed</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Unverified">Unverified</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
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
                    <div className="flex items-center justify-end py-2">
                      <Button onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}>
                        Previous
                      </Button>
                      <span className="mx-2">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                      <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                      </Button>
                      <select
                          className="ml-4"
                          value={table.getState().pagination.pageSize}
                          onChange={e => {
                            table.setPageSize(Number(e.target.value));
                          }}
                      >
                        {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                              Show {size}
                            </option>
                        ))}
                      </select>
                    </div>
                  </TabsContent>
                  <TabsContent value="BadDataTable">
                    <Table>
                      <TableCaption>A list of partial names.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Partial Name</TableHead>
                          <TableHead>Company CIK</TableHead>
                          <TableHead className="text-right">Bio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {badDataTable.getRowModel().rows?.length ? (
                          badDataTable.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell><a href={row.original.URL}>{row.getValue("name")}</a></TableCell>
                              <TableCell>{row.original.CompanyCIK}</TableCell>
                              <TableCell className="text-right">{row.getValue("bio")}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center">
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-end py-2">
                      <Button onClick={() => badDataTable.previousPage()}
                              disabled={!badDataTable.getCanPreviousPage()}>
                        Previous
                      </Button>
                      <span className="mx-2">
                    Page {badDataTable.getState().pagination.pageIndex + 1} of {badDataTable.getPageCount()}
                  </span>
                      <Button onClick={() => badDataTable.nextPage()} disabled={!badDataTable.getCanNextPage()}>
                        Next
                      </Button>
                      <select
                          className="ml-4"
                          value={badDataTable.getState().pagination.pageSize}
                          onChange={e => {
                            badDataTable.setPageSize(Number(e.target.value));
                          }}
                      >
                        {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                              Show {size}
                            </option>
                        ))}
                      </select>
                    </div>
                  </TabsContent>
                </div>
                </Tabs>
        </main>
      </div>
    </div>
  )
}
