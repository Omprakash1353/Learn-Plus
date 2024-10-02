"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Briefcase,
  GraduationCap,
  LoaderCircle,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUserProfile } from "@/actions/user.action";
import { ToastMessage } from "@/components/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/contexts/query-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfileAction } from "../_actions";

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name is required" })
    .refine((val) => val.trim() !== "", { message: "Name cannot be empty." }),
  email: z.string().email({ message: "Invalid email" }).optional(),
  bio: z.string().optional(),
  expertize: z
    .string({ message: "Expertize must be at least 5 characters long" })
    .optional(),
  qualification: z.string().optional(),
  linkedin: z.string({ message: "Invalid URL" }).optional(),
  experience: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Experience must be a valid number.",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Experience must be greater than or equal to 0.",
    }),
  profilePictureUrl: z.any().optional(),
});

export function ProfileFormSkeleton() {
  return (
    <div className="space-y-8">
      <CardHeader className="relative z-10 -mt-24 px-6 pt-0">
        <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="ml-auto h-8 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load profile data. Please try again later.
        {error.message && (
          <span className="mt-2 block">Error: {error.message}</span>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function ProfileForm() {
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const {
    data: user,
    isFetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await getUserProfileAction();
      console.debug(res);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      expertize: user?.expertize || "",
      qualification: user?.qualification || "",
      linkedin: user?.linkedin || "",
      experience: user?.instructor?.experience?.toString() || "0",
      profilePictureUrl: user?.profilePictureUrl || "",
    },
  });

  const { mutateAsync: updateProfileMutation } = useMutation({
    mutationFn: async (values: z.infer<typeof profileFormSchema>) => {
      const res = await updateUserProfile(values);
      return res;
    },
    onSuccess: (data) => {
      form.reset();
      ToastMessage({ message: data.message, type: "success" });
      setIsFormChanged(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const { reset, watch } = form;

  const watchAllFields = watch();

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        expertize: user?.expertize || "",
        qualification: user?.qualification || "",
        linkedin: user?.linkedin || "",
        experience: user?.instructor?.experience?.toString() || "0",
        profilePictureUrl: user?.profilePictureUrl || "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    const subscription = watch((value, { type }) => {
      if (type === "change") {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (user) {
      const filteredFields = { ...watchAllFields };

      const progress = Object.values(filteredFields).filter(Boolean).length;
      const totalFields = Object.keys(filteredFields).length;

      setCompletionPercentage((progress / totalFields) * 100);
    }
  }, [watchAllFields, user]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    const res = await updateUserProfile(values);
    if (res.success) {
      await updateProfileMutation(values);
    } else {
      ToastMessage({ message: res.error || res.message, type: "error" });
    }
  };

  const handleCancel = () => {
    reset();
    setIsFormChanged(false);
  };

  if (isFetching || isLoading) {
    return <ProfileFormSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error as Error} />;
  }

  if (!user) {
    return <ErrorState error={new Error("User data not found")} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="relative z-10 -mt-24 px-6 pt-0">
          <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Avatar className="h-32 w-32 rounded-full border-4 shadow-lg">
              <AvatarImage
                src={user?.profilePictureUrl || ""}
                alt={user?.name}
              />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
              <p className="text-xl">{user.expertize}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
              {user.role === "INSTRUCTOR" && (
                <>
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">
                    {user.instructor?.rating}
                  </span>
                </>
              )}
              <span>
                {user.role} {user.role === "INSTRUCTOR" && "Rating"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor="bio"
                      className="mb-2 block text-lg font-semibold"
                    >
                      About Me
                    </Label>
                    <Textarea
                      {...field}
                      id="bio"
                      className="w-full resize-none rounded-md"
                      rows={4}
                      autoComplete="off"
                      placeholder="Tell us about yourself"
                    />
                    <FormMessage />
                  </div>
                )}
              />
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="name" className="w-20">
                          Name
                        </Label>
                        <Input
                          {...field}
                          id="name"
                          type="text"
                          autoComplete="off"
                          className="flex-grow rounded-md"
                        />
                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="email" className="w-20">
                          Email
                        </Label>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          autoComplete="off"
                          className="flex-grow rounded-md"
                        />
                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="linkedin" className="w-20">
                          Linkedin
                        </Label>
                        <Input
                          {...field}
                          id="linkedin"
                          type="text"
                          autoComplete="off"
                          className="flex-grow rounded-md"
                        />
                        <FormMessage />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <div className="flex items-start space-x-3">
                        <GraduationCap className="h-6 w-6" />
                        <div className="flex-grow">
                          <Label
                            htmlFor="qualification"
                            className="text-sm font-medium"
                          >
                            Qualification
                          </Label>
                          <Input
                            {...field}
                            id="qualification"
                            type="text"
                            autoComplete="off"
                            className="mt-1 w-full rounded-md"
                          />
                          <FormMessage />
                        </div>
                      </div>
                    )}
                  />
                  {user.role === "INSTRUCTOR" && (
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <div className="flex items-start space-x-3">
                          <Briefcase className="h-6 w-6" />
                          <div className="flex-grow">
                            <Label
                              htmlFor="experience"
                              className="text-sm font-medium"
                            >
                              Experience
                            </Label>
                            <Input
                              {...field}
                              id="experience"
                              autoComplete="off"
                              type="number"
                              max={15}
                              min={0}
                              className="mt-1 w-full rounded-md"
                            />
                            <FormMessage />
                          </div>
                        </div>
                      )}
                    />
                  )}
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="expertize"
                  render={({ field }) => (
                    <div>
                      <Label
                        htmlFor="expertize"
                        className="mb-2 block text-lg font-semibold"
                      >
                        Skills & Expertise
                      </Label>
                      <Textarea
                        {...field}
                        id="expertize"
                        autoComplete="off"
                        className="w-full resize-none rounded-md"
                        rows={4}
                        placeholder="List your key skills and areas of expertise"
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Profile Completion</h3>
            <Progress
              value={completionPercentage}
              className="h-2 w-full rounded-full"
            />
            <p className="mt-2 text-sm text-gray-600">
              Your profile is {completionPercentage.toFixed(0)}% complete. Add
              more details to increase visibility.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-md"
            disabled={!isFormChanged || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
