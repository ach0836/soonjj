"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const columns = [
  {
    accessorKey: "representative",
    header: "신청자 이름",
  },
  {
    accessorKey: "phone",
    header: "전화번호",
  },
  {
    accessorKey: "count",
    header: "총인원",
  },
  {
    accessorKey: "period",
    header: "신청 교시",
  },
  {
    accessorKey: "status",
    header: "상태",
  },
  {
    id: "details",
    header: "총 신청자",
    cell: ({ row }) => (
      <Button
        onClick={() => {
          alert(
            row.original.applicants
              .map((applicant) => `${applicant.name} (${applicant.number})`)
              .join("\n")
          );
        }}
      >
        더보기
      </Button>
    ),
  },
  {
    id: "approve",
    header: "확인",
    cell: ({ row, table }) => (
      <Button
        onClick={async () => {
          try {
            const isApproved = row.original.status === "승인";
            const newStatus = isApproved ? "승인 취소" : "승인";

            // 서버에 승인 상태 변경 요청
            const response = await fetch(
              `/api/requests?id=${row.original.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: newStatus,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Status update failed");
            }

            // 로컬 상태 업데이트
            const updatedData = table.options.data.map((d) =>
              d.id === row.original.id ? { ...d, status: newStatus } : d
            );
            table.setOptions((prev) => ({ ...prev, data: updatedData }));
          } catch (error) {
            console.error("Error updating status:", error);
          }
        }}
      >
        {row.original.status === "승인" ? "승인 취소" : "승인"}
      </Button>
    ),
  },
  {
    id: "reject",
    header: "거부",
    cell: ({ row, table }) => (
      <Button
        onClick={async () => {
          try {
            const newStatus = "거부";

            // 서버에 거부 상태 변경 요청
            const response = await fetch(
              `/api/requests?id=${row.original.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: newStatus,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Status update failed");
            }

            // 로컬 상태 업데이트
            const updatedData = table.options.data.map((d) =>
              d.id === row.original.id ? { ...d, status: newStatus } : d
            );
            table.setOptions((prev) => ({ ...prev, data: updatedData }));
          } catch (error) {
            console.error("Error updating status:", error);
          }
        }}
      >
        거부
      </Button>
    ),
  },
];

export default function Home() {
  const [password, setPassword] = React.useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const methods = useForm();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "000000") {
      setIsPasswordCorrect(true);
      fetchData();
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/requests"); // 서버에서 데이터를 가져오는 API 엔드포인트
      const result = await response.json();

      // 각 request의 applicant를 그룹화하여 변환
      const groupedData = result.requests.map((request) => ({
        id: request.id,
        count: request.applicant.length,
        representative: request.applicant[0]?.name, // 첫 번째 신청자의 이름을 대표자로 설정
        phone: request.applicant[0]?.phone, // 첫 번째 신청자의 전화번호
        period: request.period, // 신청한 교시
        applicants: request.applicant,
        status: request.status || "미승인", // 상태를 기본적으로 미승인으로 설정하거나 서버에서 받아옴
      }));

      setData(groupedData); // 변환된 데이터를 상태로 설정
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // 오류 발생 시 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsPasswordCorrect(false);
    setData([]);
  };

  return (
    <FormProvider {...methods}>
      <main className="flex justify-center items-center w-full h-screen">
        {!isPasswordCorrect ? (
          <Card className="w-96 grid justify-items-center items-center p-8">
            <form
              onSubmit={handlePasswordSubmit}
              className="w-full grid justify-items-center"
            >
              <Label htmlFor="password" className="text-xl mb-4">
                Enter Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 text-lg w-full"
              />
              <Button type="submit" className="text-lg mt-4 w-full">
                로그인
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="min-w-screen grid justify-items-center items-center p-8 m-12 min-h-screen">
            <div className="rounded-md border mb-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : !data || data.length === 0 ? (
                <p>No data available</p>
              ) : (
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <Button type="button" onClick={handleBack} className="mt-4">
              뒤로
            </Button>
          </Card>
        )}
      </main>
    </FormProvider>
  );
}
