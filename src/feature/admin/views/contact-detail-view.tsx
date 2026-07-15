"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ContactReplySheet } from "@/feature/admin/components/contact/contact-reply-sheet";

export function ContactDetailView({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [replyOpen, setReplyOpen] = useState(false);
  const { data, isLoading, isError } = trpc.admin.contacts.getById.useQuery({
    id: contactId,
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Skeleton className="h-4 w-28 rounded-none" />
        <Skeleton className="h-10 w-1/2 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl">
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyTitle>Message not found</EmptyTitle>
            <EmptyDescription>
              This contact inquiry may have been removed.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            className="mt-4 rounded-none"
            variant="outline"
            onClick={() => router.push("/admin/contacts")}
          >
            Back to contacts
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <Link
        href="/admin/contacts"
        className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#707065] hover:text-[#1a1a1a]"
      >
        <ArrowLeft className="size-3.5" />
        Contacts
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl text-[#1a1a1a] md:text-4xl">
            {data.name}
          </h1>
          <p className="mt-2 truncate text-sm text-[#707065]">{data.email}</p>
          <p className="mt-1 text-sm text-[#707065]">
            {format(new Date(data.createdAt), "d MMM yyyy · HH:mm")}
            {data.repliedAt
              ? ` · Replied ${format(new Date(data.repliedAt), "d MMM yyyy")}`
              : ""}
          </p>
          <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#707065]">
            {data.status}
          </div>
        </div>
        <Button
          type="button"
          className="rounded-none"
          onClick={() => setReplyOpen(true)}
        >
          Reply
        </Button>
      </div>

      <section>
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Message</h2>
        <div className="mt-4 whitespace-pre-wrap border border-[#e5e5e0] bg-white px-4 py-5 text-sm leading-relaxed text-[#4a4a40]">
          {data.message}
        </div>
      </section>

      <ContactReplySheet
        open={replyOpen}
        onOpenChange={setReplyOpen}
        contact={data}
      />
    </div>
  );
}
