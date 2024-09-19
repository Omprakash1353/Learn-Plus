"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateId } from "lucia";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addTag, deleteTag, updateTag, fetchTags } from "../_actions";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export type Tag = {
  id: string;
  name: string;
};

type TagQueryResult = {
  success: boolean;
  data?: Tag[];
  message: string;
  error?: string;
};

type UseTagsResult = {
  data: Tag[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
};

const useTags = (): UseTagsResult => {
  const { data, isLoading, isFetching } = useQuery<TagQueryResult["data"]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetchTags();
      if (!response.success)
        throw new Error(response.error || "Failed to fetch tags");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isFetching };
};

const useTagMutations = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addAsyncMutate, isPending: isAdding } = useMutation({
    mutationFn: async (tag: Tag) => {
      const res = await addTag(tag);
      if (!res.success) throw new Error(res.error || "Failed to add tag");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const { mutateAsync: updateAsyncMutate, isPending: isUpdating } = useMutation(
    {
      mutationFn: async (tag: Tag) => {
        const res = await updateTag(tag);
        if (!res.success) throw new Error(res.error || "Failed to update tag");
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      },
    },
  );

  const { mutateAsync: deleteAsyncMutate, isPending: isDeleting } = useMutation(
    {
      mutationFn: async (id: string) => {
        const res = await deleteTag(id);
        if (!res.success) throw new Error(res.error || "Failed to delete tag");
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      },
    },
  );

  return {
    addAsyncMutate,
    updateAsyncMutate,
    deleteAsyncMutate,
    isAdding,
    isUpdating,
    isDeleting,
  };
};

export function TagManage() {
  const { data: tags = [], isLoading: isFetching } = useTags();
  const [newTag, setNewTag] = useState<string>("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [popoverState, setPopoverState] = useState<{
    add: boolean;
    save: string | null;
    delete: string | null;
  }>({ add: false, save: null, delete: null });

  const {
    addAsyncMutate,
    updateAsyncMutate,
    deleteAsyncMutate,
    isAdding,
    isUpdating,
    isDeleting,
  } = useTagMutations();

  const handleAddTag = useCallback(async () => {
    if (newTag.trim() === "") return;

    const newTagObject: Tag = {
      id: generateId(15),
      name: newTag.trim(),
    };

    setNewTag("");
    setPopoverState((prevState) => ({ ...prevState, add: false }));

    await addAsyncMutate(newTagObject);
  }, [newTag, addAsyncMutate]);

  const handleSaveEdit = useCallback(async () => {
    if (editingTag) {
      setEditingTag(null);
      setPopoverState((prevState) => ({ ...prevState, save: null }));

      await updateAsyncMutate(editingTag);
    }
  }, [editingTag, updateAsyncMutate]);

  const handleDeleteTag = useCallback(
    async (id: string) => {
      setPopoverState((prevState) => ({ ...prevState, delete: null }));

      await deleteAsyncMutate(id);
    },
    [deleteAsyncMutate],
  );

  if (isFetching) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-lg p-4 shadow-md">
        <Skeleton className="mb-4 h-8 w-3/4" />
        <Skeleton className="mb-4 h-10 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-6 w-1/2" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg p-4 shadow-md">
      <h2 className="mb-2 text-lg font-semibold">Manage Tags</h2>

      <div className="mb-2 flex">
        <Popover
          open={popoverState.add}
          onOpenChange={(open) =>
            setPopoverState((prevState) => ({ ...prevState, add: open }))
          }
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <PlusIcon className="mr-2 h-4 w-4" />
              {isAdding ? "Adding..." : "Add Tag"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid gap-2">
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter new tag"
              />
              <Button size="sm" onClick={handleAddTag} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className="h-64 w-full rounded-md border p-2">
        <div className="p-2">
          {tags.map((tag) => (
            <div key={tag.id}>
              <div
                key={tag.id}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm">{tag.name}</span>
                <div className="flex space-x-1">
                  <Popover
                    open={popoverState.save === tag.id}
                    onOpenChange={(open) =>
                      setPopoverState((prevState) => ({
                        ...prevState,
                        save: open ? tag.id : null,
                      }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingTag(tag)}
                        disabled={isUpdating}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="grid gap-2">
                        <Input
                          type="text"
                          value={editingTag?.name || tag.name}
                          onChange={(e) =>
                            setEditingTag({ ...tag, name: e.target.value })
                          }
                        />
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover
                    open={popoverState.delete === tag.id}
                    onOpenChange={(open) =>
                      setPopoverState((prevState) => ({
                        ...prevState,
                        delete: open ? tag.id : null,
                      }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isDeleting}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="grid gap-2">
                        <p className="text-sm">Delete this tag?</p>
                        <div className="flex justify-between">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPopoverState((prevState) => ({
                                ...prevState,
                                delete: null,
                              }))
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
