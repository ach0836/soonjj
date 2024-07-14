"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    accessorKey: "contact",
    header: "전화번호",
  },
  {
    accessorKey: "count",
    header: "총인원",
  },
  {
    accessorKey: "time",
    header: "신청 교시",
  },
  {
    accessorKey: "reason",
    header: "사유",
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
            row.original.applicant
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
            const newStatus = isApproved ? "미승인" : "승인";

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
            const response = await fetch(
              `/api/requests?id=${row.original.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Request deletion failed");
            }

            const updatedData = table.options.data.filter(
              (d) => d.id !== row.original.id
            );
            table.setOptions((prev) => ({ ...prev, data: updatedData }));
          } catch (error) {
            console.error("Error deleting request:", error);
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
      alert("비밀번호가 틀렸습니다. 다시 시도해주세요.");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/requests");
      const result = await response.json();

      const groupedData = result.requests.map((request) => ({
        id: request.id,
        count: request.applicant.length,
        representative: request.applicant[0]?.name,
        contact: request.contact,
        time: request.time,
        reason: request.reason,
        applicant: request.applicant,
        status:
          request.isApproved === true
            ? "승인"
            : request.isApproved === false
            ? "미승인"
            : "거부",
      }));

      setData(groupedData);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.location.reload();
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
                비밀번호 입력
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
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
                <p>로딩 중...</p>
              ) : !data || data.length === 0 ? (
                <p>데이터가 없습니다</p>
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
