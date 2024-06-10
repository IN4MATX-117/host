"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  comment: z
    .string()
    .max(160, {
      message: "Comment must not be longer than 160 characters.",
    }),
})

export function CommentBox({ personId }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [commentId, setCommentId] = useState(null);

  useEffect(() => {
    // Fetch the existing comment for the person
    async function fetchComment() {
      try {
        const response = await fetch(`http://localhost:5001/api/comments/${personId}`);
        const result = await response.json();
        if (result.length > 0) {
          form.setValue("comment", result[0].Comment);
          setCommentId(result[0].CommentID);
        }
      } catch (error) {
        console.error('Error fetching comment:', error);
      }
    }
    fetchComment();
  }, [personId, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (commentId) {
        // Update existing comment
        await fetch(`http://localhost:5001/api/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: data.comment }),
        });
      } else {
        // Add new comment
        const response = await fetch('http://localhost:5001/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ personId, comment: data.comment }),
        });
        const result = await response.json();
        setCommentId(result.commentId);
      }
      toast({
        title: "Comment saved",
        description: "Your comment has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        title: "Error",
        description: "There was an error saving your comment.",
      });
    }
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
                <Textarea
                  placeholder="You can input your comments for this person here"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}
