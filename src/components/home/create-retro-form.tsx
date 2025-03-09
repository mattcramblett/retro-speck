"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreateRetro } from "@/hooks/retros/use-create-retro";
import { RATE_LIMIT_ERROR } from "@/lib/errors/retro-errors";

const formSchema = z.object({
  title: z.string().min(3).max(80).trim(),
});

export function CreateRetroForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutateAsync, isPending } = useCreateRetro({
    onSuccess: (data) => {
      router.push(`/retro/${data}`);
    },
    onError: (e: Error) => {
      const isRateLimitError = e.message === RATE_LIMIT_ERROR;
      const description = isRateLimitError ? e.message :  "Please refresh the page or try again later.";
      toast({
        variant: isRateLimitError ? "default" : "destructive",
        title: "Could not create a retro.",
        description,
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) =>
    mutateAsync(values.title);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex items-end justify-start gap-4 p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-72">
              <FormLabel>Start a new retro</FormLabel>
              <FormControl>
                <Input placeholder="Title" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button disabled={isPending} type="submit">
          {isPending ? "Creating..." : "Start"}
          {!isPending && <ArrowRight />}
        </Button>
      </form>
    </Form>
  );
}
