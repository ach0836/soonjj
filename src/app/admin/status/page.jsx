"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const columns = [
  {
    accessorKey: "name",
    header: "대표자",
  },
  {
    accessorKey: "contact",
    header: "전화번호",
  },
  {
    accessorKey: "reason",
    header: "사유",
  },
  {
    accessorKey: "count",
    header: "총인원",
  },
];

export default function RequestsPage() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm();

  const table1 = useReactTable({
    data: data1,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const table2 = useReactTable({
    data: data2,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const table3 = useReactTable({
    data: data3,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/requests");
      const result = await response.json();
      console.log("클라이언트에서 받아온 데이터:", result.requests);

      const approvedData = result.requests.filter((request) => request.isApproved);

      const dataByTime = {
        1: [],
        2: [],
        3: [],
      };

      approvedData.forEach((request) => {
        if (request.time >= 1 && request.time <= 3) {
          dataByTime[request.time].push({
            ...request,
            name: request.applicant.length > 0 ? request.applicant[0].name : "N/A",
            count: `${request.applicant.length}명`,
          });
        }
      });

      setData1(dataByTime[1]);
      setData2(dataByTime[2]);
      setData3(dataByTime[3]);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setData1([]);
      setData2([]);
      setData3([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <FormProvider {...methods}>
      <main className="flex flex-col justify-center items-center w-screen h-screen">
        <Card className="w-5/6 grid justify-items-center items-center p-8 m-4">
          <Label className="text-2xl mb-4">1교시 신청 목록</Label>
          <div className="rounded-md border mb-4 w-full">
            {isLoading ? (
              <p>로딩 중...</p>
            ) : !data1 || data1.length === 0 ? (
              <p>신청 목록이 없습니다</p>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  {table1.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table1.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
        <Card className="w-5/6 grid justify-items-center items-center p-8 m-4">
          <Label className="text-2xl mb-4">2교시 신청 목록</Label>
          <div className="rounded-md border mb-4 w-full">
            {isLoading ? (
              <p>로딩 중...</p>
            ) : !data2 || data2.length === 0 ? (
              <p>신청 목록이 없습니다</p>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  {table2.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table2.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
        <Card className="w-5/6 grid justify-items-center items-center p-8 m-4">
          <Label className="text-2xl mb-4">3교시 신청 목록</Label>
          <div className="rounded-md border mb-4 w-full">
            {isLoading ? (
              <p>로딩 중...</p>
            ) : !data3 || data3.length === 0 ? (
              <p>신청 목록이 없습니다</p>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  {table3.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table3.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
        <Button type="button" onClick={handleButtonClick} className="mt-4">
          뒤로
        </Button>
      </main>
    </FormProvider>
  );
}
