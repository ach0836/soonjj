"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const handleButtonClick = (url) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <Card className="w-96 grid justify-items-center items-center p-8">
        <Label className="text-xl mb-4">선택하세요</Label>
        <Button className="text-lg mb-4 w-full" onClick={() => handleButtonClick("/admin/approve")}>
          신청 승인
        </Button>
        <Button className="text-lg mb-4 w-full" onClick={() => handleButtonClick("status")}>
          신청 현황
        </Button>
      </Card>
    </main>
  );
}
