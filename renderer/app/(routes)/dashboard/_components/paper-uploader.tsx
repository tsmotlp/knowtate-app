"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Dropzone from "react-dropzone"
import { FileIcon, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import { toast } from "sonner"
import { Paper } from "@prisma/client"
import { DashboardItem, DashboardItemType } from "@/types/types"

const formSchema = z.object({
  title: z.string().min(1, { message: "标题不能为空" }).max(200),
  paper: z.custom<File>((val) => val instanceof File, "请选择文件"),
}).required()

interface PaperUploaderProps {
  setItems: Dispatch<SetStateAction<DashboardItem[]>>
  categoryId: string
}

export const PaperUploader = ({
  categoryId,
  setItems
}: PaperUploaderProps) => {
  const [isPaperDialogOpen, setIsPaperDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      paper: undefined
    }
  })

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((preProgress) => {
        if (preProgress >= 95) {
          clearInterval(interval);
          return preProgress;
        }
        return preProgress + 5;
      });
    }, 500);
    return interval;
  };

  const onSubmit = async () => {
    try {
      setIsUploading(true)
      const progressInterval = startSimulatedProgress();
      const formData = new FormData()
      const paperData = form.getValues()
      formData.append("paper", paperData.paper);
      formData.append("title", paperData.title);
      if (categoryId && categoryId !== "recents") {
        formData.append("categoryId", categoryId)
      } else {
        formData.append("categoryId", "library")
      }
      const response = await axios.post("/api/paper", formData);
      const paperInfo: Paper = response.data;

      if (!paperInfo) {
        throw new Error("No paper info returned");
      }

      setItems((current) => [...current, {
        id: paperInfo.id,
        label: paperInfo.title,
        type: DashboardItemType.Paper,
        archived: paperInfo.archived,
        favorited: paperInfo.favorited,
        url: paperInfo.url,
        authors: paperInfo.authors,
        publication: paperInfo.publication,
        publicationDate: paperInfo.publicateDate,
        paperTile: null,
        paperId: null,
        lastEdit: paperInfo.updatedAt,
      }])

      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsPaperDialogOpen(false)
    } catch (error) {
      toast("上传文献失败", {
        description: error instanceof Error ? error.message : "请稍后重试",
      });
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog
      open={isPaperDialogOpen}
      onOpenChange={(isOpen) => {
        setIsPaperDialogOpen(isOpen)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
        >
          <Upload className="size-4 mr-1" />
          上传文献
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2 text-center">Upload Your Paper Here</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Use the default title or type to rename the paper</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paper"
                render={() => (
                  <Dropzone
                    noClick
                    multiple={false}
                    onDropAccepted={(acceptedFiles) => {
                      if (acceptedFiles && acceptedFiles.length > 0) {
                        form.setValue("paper", acceptedFiles[0])
                        if (form.getValues().title === "") {
                          form.setValue("title", acceptedFiles[0].name)
                        }
                      }
                    }}
                  >
                    {({ getRootProps, getInputProps, acceptedFiles }) => (
                      <div
                        {...getRootProps()}
                        className="border h-64 border-dashed rounded-lg"
                      >
                        <div className="size-full flex items-center justify-center">
                          <div className="size-full flex flex-col items-center justify-center">
                            <FileIcon className="size-4" />
                            <p className="mt-2 mb-2 text-sm">
                              <span className="font-semibold">Click to choose</span> or drag
                              and drop a paper
                            </p>
                            <p className="text-xs">(only support PDF file currently)</p>
                          </div>
                        </div>
                        {acceptedFiles && acceptedFiles[0] && (
                          <div className="max-w-xs flex items-center rounded-md overflow-hidden outline outline-[1px] divide-x">
                            <div className="px-3 py-2 h-full grid place-items-center">
                              <FileIcon className="h-4 w-4" />
                            </div>
                            <div className="px-3 py-2 h-full text-sm truncate">
                              {acceptedFiles[0].name}
                            </div>
                          </div>
                        )}
                        <input
                          {...getInputProps()}
                          type="file"
                          accept=".pdf"
                          id="dropzone-file"
                          className="hidden"
                        />
                      </div>
                    )}
                  </Dropzone>
                )}
              />
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-1 w-full" />
                </div>
              ) : (
                <div className="flex w-full items-center justify-center gap-x-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    variant="secondary"
                    size="sm"
                  >
                    上传
                  </Button>
                  <Button
                    onClick={() => { setIsPaperDialogOpen(false) }}
                    variant="secondary"
                    size="sm"
                  >
                    取消
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>

    </Dialog>
  )
}