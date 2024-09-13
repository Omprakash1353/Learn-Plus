"use client";

import { ToastMessage } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GripVertical,
  PlusCircle,
  Save,
  Trash
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

interface Section {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  resources: string[];
  assignment: string;
}

interface Module {
  id: string;
  title: string;
  sections: Section[];
  isExpanded: boolean;
}

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
  resources: z.array(z.string().url("Invalid URL")).optional(),
  assignment: z.string().optional(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

export default function CourseManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setModules((modules) => {
        const oldIndex = modules.findIndex((m) => m.id === active.id);
        const newIndex = modules.findIndex((m) => m.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(modules, oldIndex, newIndex);
        }

        const activeModuleIndex = modules.findIndex((m) =>
          m.sections.some((s) => s.id === active.id),
        );
        const overModuleIndex = modules.findIndex((m) =>
          m.sections.some((s) => s.id === over.id),
        );

        if (activeModuleIndex !== -1 && overModuleIndex !== -1) {
          const newModules = [...modules];
          const activeModule = newModules[activeModuleIndex];
          const overModule = newModules[overModuleIndex];

          const oldSectionIndex = activeModule.sections.findIndex(
            (s) => s.id === active.id,
          );
          const newSectionIndex = overModule.sections.findIndex(
            (s) => s.id === over.id,
          );

          const [movedSection] = activeModule.sections.splice(
            oldSectionIndex,
            1,
          );
          overModule.sections.splice(newSectionIndex, 0, movedSection);

          return newModules;
        }

        return modules;
      });
    }
  }, []);

  const addModule = useCallback(() => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: "New Module",
      sections: [],
      isExpanded: true,
    };
    setModules((prevModules) => [...prevModules, newModule]);
    setSelectedModule(newModule);
    setSelectedSection(null);
  }, []);

  const addSection = useCallback((moduleId: string) => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "New Section",
      description: "",
      videoUrl: "",
      resources: [],
      assignment: "",
    };
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? { ...module, sections: [...module.sections, newSection] }
          : module,
      ),
    );
    setSelectedSection(newSection);
  }, []);

  const updateModule = useCallback((updatedModule: Module) => {
    console.log("updatedModule");
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === updatedModule.id ? updatedModule : module,
      ),
    );
    setSelectedModule(updatedModule);
  }, []);

  const removeModule = useCallback(
    (moduleId: string) => {
      setModules((prevModules) =>
        prevModules.filter((module) => module.id !== moduleId),
      );
      if (selectedModule?.id === moduleId) {
        setSelectedModule(null);
        setSelectedSection(null);
      }
    },
    [selectedModule],
  );

  const removeSection = useCallback(
    (moduleId: string, sectionId: string) => {
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === moduleId 
            ? {
                ...module,
                sections: module.sections.filter(
                  (section) => section.id !== sectionId,
                ),
              }
            : module,
        ),
      );
      if (selectedSection?.id === sectionId) {
        setSelectedSection(null);
      }
    },
    [selectedSection],
  );

  const toggleModuleExpansion = useCallback((moduleId: string) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? { ...module, isExpanded: !module.isExpanded }
          : module,
      ),
    );
  }, []);

  const handleSaveModules = useCallback(() => {
    // Simulating an API call
    setTimeout(() => {
      console.log("Saving module structure:", JSON.stringify(modules, null, 2));
      ToastMessage({
        message: "Module structure saved successfully!",
        type: "success",
      });
    }, 1000);
  }, [modules]);

  const { control, handleSubmit, reset } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: selectedSection || undefined,
  });

  const onSubmit = useCallback(
    (data: SectionFormData) => {
      if (selectedModule && selectedSection) {
        const updatedSection: Section = { ...selectedSection, ...data };
        const updatedModule = {
          ...selectedModule,
          sections: selectedModule.sections.map((section) =>
            section.id === selectedSection.id ? updatedSection : section,
          ),
        };
        updateModule(updatedModule);
        setSelectedSection(updatedSection);
        ToastMessage({
          message: "Section updated successfully!",
          type: "success",
        });
      }
    },
    [selectedModule, selectedSection, updateModule],
  );

  const moduleItems = useMemo(
    () => modules.map((module) => module.id),
    [modules],
  );

  return (
    <div className="space-y-4 bg-background p-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Course
            </a>
          </li>
          {selectedModule && (
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <a
                  href="#"
                  className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2"
                >
                  {selectedModule.title}
                </a>
              </div>
            </li>
          )}
          {selectedSection && (
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <a
                  href="#"
                  className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2"
                >
                  {selectedSection.title}
                </a>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/3">
          <Card className="bg-card">
            <CardContent className="p-4">
              <h2 className="mb-4 text-2xl font-bold">Course Modules</h2>
              <Button onClick={addModule} className="mb-4 w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Module
              </Button>
              <ScrollArea className="h-[calc(90vh-200px)]">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={moduleItems}
                    strategy={verticalListSortingStrategy}
                  >
                    {modules.map((module) => (
                      <SortableModule
                        key={module.id}
                        module={module}
                        onAddSection={() => addSection(module.id)}
                        onRemoveModule={() => removeModule(module.id)}
                        onRemoveSection={(sectionId) =>
                          removeSection(module.id, sectionId)
                        }
                        onSelectModule={() => setSelectedModule(module)}
                        onSelectSection={(section) => {
                          setSelectedModule(module);
                          setSelectedSection(section);
                          reset(section);
                        }}
                        updateModuleTitle={(title: string) => {
                          const updatedModule = { ...module, title };
                          updateModule(updatedModule);
                        }}
                        toggleExpansion={() => toggleModuleExpansion(module.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </ScrollArea>
              <Button onClick={handleSaveModules} className="mt-4 w-full">
                <Save className="mr-2 h-4 w-4" /> Save Module Structure
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-2/3">
          <Card className="bg-card">
            <CardContent className="p-4">
              <h2 className="mb-4 text-2xl font-bold">Section Details</h2>
              {selectedSection ? (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-muted-foreground"
                          >
                            Title
                          </label>
                          <Input id="title" {...field} className="mt-1" />
                          {error && (
                            <p className="mt-1 text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-muted-foreground"
                          >
                            Description
                          </label>
                          <Textarea
                            id="description"
                            {...field}
                            className="mt-1"
                          />
                        </div>
                      )}
                    />
                    <Controller
                      name="videoUrl"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <label
                            htmlFor="videoUrl"
                            className="block text-sm font-medium text-muted-foreground"
                          >
                            Video URL
                          </label>
                          <Input id="videoUrl" {...field} className="mt-1" />
                          {error && (
                            <p className="mt-1 text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name="resources"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Resources
                          </label>
                          {value?.map((resource, index) => (
                            <Input
                              key={index}
                              value={resource}
                              onChange={(e) => {
                                const newResources = [...value];
                                newResources[index] = e.target.value;
                                onChange(newResources);
                              }}
                              className="mb-2 mt-1"
                            />
                          ))}
                          {value?.length === 0 && (
                            <Button
                              type="button"
                              onClick={() => onChange([...value, ""])}
                              variant="outline"
                              size="sm"
                            >
                              Add Resource
                            </Button>
                          )}
                          {error && (
                            <p className="mt-1 text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name="assignment"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label
                            htmlFor="assignment"
                            className="block text-sm font-medium text-muted-foreground"
                          >
                            Assignment
                          </label>
                          <Textarea
                            id="assignment"
                            {...field}
                            className="mt-1"
                          />
                        </div>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Section Details
                    </Button>
                  </form>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">
                  Select a section to view and edit details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface SortableModuleProps {
  module: Module;
  onAddSection: () => void;
  onRemoveModule: () => void;
  onRemoveSection: (sectionId: string) => void;
  onSelectModule: () => void;
  onSelectSection: (section: Section) => void;
  updateModuleTitle: (title: string) => void;
  toggleExpansion: () => void;
}

function SortableModule({
  module,
  onAddSection,
  onRemoveModule,
  onRemoveSection,
  onSelectModule,
  onSelectSection,
  updateModuleTitle,
  toggleExpansion,
}: SortableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-4 bg-card">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center">
          <div {...attributes} {...listeners}>
            <GripVertical className="mr-2 h-4 w-4 cursor-move text-muted-foreground" />
          </div>
          <Input
            value={module.title}
            onChange={(e) => updateModuleTitle(e.target.value)}
            className="mr-2 flex-grow border-none outline-none"
          />
          <Button variant="ghost" size="icon" onClick={toggleExpansion}>
            {module.isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 hover:text-red-500" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this module?
                </DialogTitle>
              </DialogHeader>
              <Button onClick={onRemoveModule}>Confirm Delete</Button>
            </DialogContent>
          </Dialog>
        </div>
        {module.isExpanded && (
          <div className="ml-4">
            <SortableContext
              items={module.sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              {module.sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  onSelectSection={() => onSelectSection(section)}
                  onRemoveSection={() => onRemoveSection(section.id)}
                />
              ))}
            </SortableContext>
            <Button
              onClick={onAddSection}
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SortableSectionProps {
  section: Section;
  onSelectSection: () => void;
  onRemoveSection: () => void;
}

function SortableSection({
  section,
  onSelectSection,
  onRemoveSection,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-2 transition-colors duration-200 hover:bg-muted"
    >
      <CardContent className="mx-2 flex items-center p-0">
        <div {...attributes} {...listeners}>
          <GripVertical className="mr-2 h-4 w-4 cursor-move" />
        </div>
        <Button
          variant={"ghost"}
          onChange={(e) => onSelectSection()}
          className="mr-1 flex flex-grow justify-start hover:bg-transparent"
          onClick={onSelectSection}
        >
          {section.title}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-transparent"
            >
              <Trash className="h-4 w-4 hover:text-red-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this section?
              </DialogTitle>
            </DialogHeader>
            <Button onClick={onRemoveSection}>Confirm Delete</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
