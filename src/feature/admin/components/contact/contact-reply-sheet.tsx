"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const underlineInputClassName =
  "h-auto rounded-none border-0 border-b border-foreground/30 bg-transparent px-0 py-2 text-[0.95rem] shadow-none ring-0 outline-none focus-visible:border-accent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";


function defaultReplyBody(name: string, originalMessage: string) {
  return `Dear ${name},

Thank you for writing to ArtiSun. We’ve received your message and a curator will be happy to help.

Regarding your note:
"${originalMessage.trim()}"

Please let us know if you’d like any further details about our pieces, commissions, or shipping.

Warm regards,
The ArtiSun Studio`;
}

export function ContactReplySheet({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    id: string;
    name: string;
    email: string;
    message: string;
  } | null;
}) {
  const utils = trpc.useUtils();
  const [subject, setSubject] = useState("Re: Your message to ArtiSun");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open || !contact) return;
    setSubject("Re: Your message to ArtiSun");
    setMessage(defaultReplyBody(contact.name, contact.message));
  }, [open, contact]);

  const reply = trpc.admin.contacts.reply.useMutation({
    onSuccess: async () => {
      toast.success("Reply sent");
      if (contact) {
        await utils.admin.contacts.getById.invalidate({ id: contact.id });
      }
      await utils.admin.contacts.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 rounded-none p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-[#e5e5e0] px-6 py-5 text-left">
          <SheetTitle className="font-serif text-2xl text-[#1a1a1a]">
            Reply
          </SheetTitle>
          <SheetDescription className="text-[#707065]">
            Send a branded email using the ArtiSun template.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Email
            </Label>
            <Input
              readOnly
              value={contact?.email ?? ""}
              className={underlineInputClassName}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Subject
            </Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={underlineInputClassName}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Message
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={14}
              className={`${underlineInputClassName} min-h-[280px]`}
            />
          </div>
        </div>

        <SheetFooter className="border-t border-[#e5e5e0] px-6 py-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => onOpenChange(false)}
            disabled={reply.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-none"
            disabled={!contact || reply.isPending || !subject.trim() || !message.trim()}
            onClick={() => {
              if (!contact) return;
              reply.mutate({
                id: contact.id,
                subject: subject.trim(),
                message: message.trim(),
              });
            }}
          >
            {reply.isPending ? "Sending…" : "Send"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
