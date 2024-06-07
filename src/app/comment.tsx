"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, {useState} from "react";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  comment: z
    .string()
    .max(160, {
      message: "Comment must not be longer than 30 characters.",
    }),
})

export function TextareaForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    } 
// 在这里要改成让他留在页面上，或许重新想想怎么设计界面吧


  const [displayComment, setDisplayComment] = useState(false);

  function handleClick() {
    setDisplayComment(true);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                {displayComment ? (
                  <div>
                    {field.value}
                  </div>
                ) : (
                  <Textarea
                    placeholder="You can input your comments for this person here"
                    className="resize-none"
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onClick={handleClick}>
          Save
        </Button>
        <Button onClick={() => setDisplayComment(false)}>Edit</Button>
      </form>
    </Form>
  )
}
