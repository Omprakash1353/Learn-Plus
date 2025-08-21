import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Tables
export const payment = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  paymentId: uuid("payment_id").references(() => payment.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// Enums
export const courseLevel = pgEnum("course_level", [
  "Beginner",
  "Intermediate",
  "Advanced",
]);

export const courseStatus = pgEnum("course_status", [
  "Draft",
  "Published",
  "Archieved",
]);

export const enrollmentStatus = pgEnum("enrollment_status", [
  "Pending",
  "Active",
  "Cancelled",
]);

export const course = pgTable("course", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileKey: text("file_key").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  level: courseLevel("level").default("Beginner"),
  category: text("category").notNull(),
  smallDescription: text("small_description").notNull(),
  slug: text("slug").unique().notNull(),
  status: courseStatus("status").default("Draft"),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const chapter = pgTable("chapter", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  courseId: uuid("course_id")
    .references(() => course.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const lesson = pgTable("lesson", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  thumbnailKey: text("thumbnail_key"),
  videoKey: text("video_key"),
  chapterId: uuid("chapter_id")
    .references(() => chapter.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const enrollment = pgTable(
  "enrollment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    amount: integer("amount"),
    status: enrollmentStatus("status").default("Pending"),
    courseId: uuid("course_id")
      .references(() => course.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("enrollment_user_course_idx").on(table.userId, table.courseId),
  ]
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    completed: boolean("completed").default(false),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    lessonId: uuid("lesson_id")
      .references(() => lesson.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("lesson_progress_user_lesson_idx").on(
      table.userId,
      table.lessonId
    ),
  ]
);

export const quizzType = pgEnum("quizz_type", ["MCQ", "Open_Ended"]);

export const quizz = pgTable("quizz", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  timeLimit: integer("time_limit").notNull(),
  type: quizzType("type").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const quizzQuestion = pgTable("quizz_question", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizzId: uuid("quizz_id")
    .references(() => quizz.id, { onDelete: "cascade" })
    .notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  options: json("options").notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});

export const quizzUserResponse = pgTable("quizz_user_response", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizzId: uuid("quizz_id")
    .references(() => quizz.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  score: integer("score"),
});

export const quizzUserResponseQuestion = pgTable(
  "quizz_user_response_question",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizzUserResponseId: uuid("quizz_user_response_id")
      .references(() => quizzUserResponse.id, { onDelete: "cascade" })
      .notNull(),
    questionId: uuid("question_id")
      .references(() => quizzQuestion.id, { onDelete: "cascade" })
      .notNull(),
    answer: text("answer").notNull(),
  }
);

// Relations
export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, {
    fields: [payment.id],
    references: [user.paymentId],
  }),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  payment: one(payment, {
    fields: [user.paymentId],
    references: [payment.id],
  }),
  accounts: many(account),
  sessions: many(session),
  courses: many(course),
  enrollments: many(enrollment),
  lessonProgresses: many(lessonProgress),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
  user: one(user, {
    fields: [course.userId],
    references: [user.id],
  }),
  chapters: many(chapter),
  enrollments: many(enrollment),
}));

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
  lessons: many(lesson),
}));

export const lessonRelations = relations(lesson, ({ one, many }) => ({
  chapter: one(chapter, {
    fields: [lesson.chapterId],
    references: [chapter.id],
  }),
  lessonProgresses: many(lessonProgress),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  user: one(user, {
    fields: [enrollment.userId],
    references: [user.id],
  }),
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(user, {
    fields: [lessonProgress.userId],
    references: [user.id],
  }),
  lesson: one(lesson, {
    fields: [lessonProgress.lessonId],
    references: [lesson.id],
  }),
}));

export const quizzRelations = relations(quizz, ({ many }) => ({
  questions: many(quizzQuestion),
  responses: many(quizzUserResponse),
}));

export const quizzQuestionRelations = relations(quizzQuestion, ({ one }) => ({
  quizz: one(quizz, {
    fields: [quizzQuestion.quizzId],
    references: [quizz.id],
  }),
}));

export const quizzUserResponseRelations = relations(
  quizzUserResponse,
  ({ one, many }) => ({
    quizz: one(quizz, {
      fields: [quizzUserResponse.quizzId],
      references: [quizz.id],
    }),
    user: one(user, {
      fields: [quizzUserResponse.userId],
      references: [user.id],
    }),
    questions: many(quizzUserResponseQuestion),
  })
);

export const quizzUserResponseQuestionRelations = relations(
  quizzUserResponseQuestion,
  ({ one }) => ({
    response: one(quizzUserResponse, {
      fields: [quizzUserResponseQuestion.quizzUserResponseId],
      references: [quizzUserResponse.id],
    }),
    question: one(quizzQuestion, {
      fields: [quizzUserResponseQuestion.questionId],
      references: [quizzQuestion.id],
    }),
  })
);

// Type exports
export type User = InferSelectModel<typeof user>;
export type Course = InferSelectModel<typeof course>;
export type Chapter = InferSelectModel<typeof chapter>;
export type Lesson = InferSelectModel<typeof lesson>;
export type Enrollment = InferSelectModel<typeof enrollment>;
export type LessonProgress = InferSelectModel<typeof lessonProgress>;
export type Account = InferSelectModel<typeof account>;
export type Session = InferSelectModel<typeof session>;
export type Payment = InferSelectModel<typeof payment>;
export type Verification = InferSelectModel<typeof verification>;
export type Quizz = InferSelectModel<typeof quizz>;
export type QuizzQuestion = InferSelectModel<typeof quizzQuestion>;
export type QuizzUserResponse = InferSelectModel<typeof quizzUserResponse>;
export type QuizzUserResponseQuestion = InferSelectModel<typeof quizzUserResponseQuestion>;
