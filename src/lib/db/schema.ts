import { relations, sql, SQL } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const roleEnums = pgEnum("role", ["ADMIN", "INSTRUCTOR", "STUDENT"]);

export const courseStatusEnums = pgEnum("status", ["PUBLISHED", "DRAFT"]);

export const feedbackTypeEnums = pgEnum("feedback_type", [
  "PLATFORM",
  "COURSE",
  "INSTRUCTOR",
]);

export const paymentStatusEnums = pgEnum("payment_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);

export const notificationTypeEnums = pgEnum("notification_types", [
  "ENROLLMENT",
  "ASSIGNMENT",
  "EXAMINATION",
  "ANNOUNCEMENT",
]);

// TABLES

export const userTable = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").unique().notNull(),
    email: text("email").unique(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    hashedPassword: text("password"),
    role: roleEnums("role").default("STUDENT").notNull(),
    profilePictureUrl: text("profile_picture_url").references(
      () => imageTable.id,
    ),
    bio: text("bio"),
    expertize: text("expertize"),
    qualification: text("qualification"),
    linkedin: text("linkedin"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
  }),
);

export const oauthAccountTable = pgTable("oauth_accounts", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refersh_token"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const emailVerificationTable = pgTable("email_verifications", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  code: text("code").notNull(),
  sentAt: timestamp("sent_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const instructorTable = pgTable("instructors", {
  id: text("id")
    .primaryKey()
    .notNull()
    .references(() => userTable.id),
  rating: real("rating").default(0),
  experience: real("experience").default(0),
});

export const courseTable = pgTable("courses", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  discount: real("discount").default(0),
  price: integer("price").default(0),
  status: courseStatusEnums("status").default("DRAFT").notNull(),
  rating: real("rating").default(0),
  thumbnailUrl: text("thumbnail_url").references(() => imageTable.id, {
    onDelete: "set null",
  }),
  instructorId: text("instructor_id").references(() => instructorTable.id),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const enrollmentTable = pgTable("enrollments", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").references(() => userTable.id),
  courseId: text("course_id").references(() => courseTable.id),
  certificateIssued: boolean("certificate_issued").default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const problemTable = pgTable("problems", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  problemQuestion: text("problem_question").notNull(),
  solution: text("solution"),
  solved: boolean("solved").notNull().default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  resolvedAt: timestamp("resolved_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const notificationTable = pgTable("notifications", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").references(() => userTable.id),
  notificationType: notificationTypeEnums("notification_type").notNull(),
  notification: text("notification").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const tagTable = pgTable("tags", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const chapterTable = pgTable("chapters", {
  id: text("id").primaryKey().notNull(),
  courseId: text("course_id").references(() => courseTable.id),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  isFree: boolean("is_free").default(false),
  duration: real("duration").default(0),
  videoId: text("video_id").references(() => videoTable.id),
  status: courseStatusEnums("status").default("DRAFT").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const videoTable = pgTable("mux_data", {
  id: text("id").primaryKey().notNull(),
  asset_id: text("asset_id").notNull(),
  playbackId: text("playback_id"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const userProgressTable = pgTable("user_progress", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").references(() => userTable.id),
  chapterId: text("chapter_id").references(() => chapterTable.id),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const paymentTable = pgTable("payments", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").references(() => userTable.id),
  courseId: text("course_id").references(() => courseTable.id),
  amount: real("amount").notNull(),
  paymentMethod: text("payment_method"),
  paymentStatus: paymentStatusEnums("payment_status").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const feedbackTable = pgTable("feedbacks", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").references(() => userTable.id),
  courseId: text("course_id").references(() => courseTable.id),
  instructorId: text("instructor_id").references(() => instructorTable.id),
  feedbackType: feedbackTypeEnums("feedback_type").default("PLATFORM"),
  feedback: text("feedback").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const courseTagsTable = pgTable("course_tags", {
  courseId: text("course_id")
    .references(() => courseTable.id, { onDelete: "cascade" })
    .notNull(),
  tagId: text("tag_id")
    .references(() => tagTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const imageTable = pgTable("images", {
  id: text("id").primaryKey().notNull(),
  secure_url: text("secure_url").notNull(),
  public_id: text("public_id"),
  asset_id: text("asset_id"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

// RELATIONS

export const usersRelations = relations(userTable, ({ one, many }) => ({
  sessions: many(sessionTable),
  enrollments: many(enrollmentTable),
  oauthAccounts: one(oauthAccountTable, {
    fields: [userTable.id],
    references: [oauthAccountTable.userId],
  }),
  instructor: one(instructorTable, {
    fields: [userTable.id],
    references: [instructorTable.id],
  }),
  images: one(imageTable, {
    fields: [userTable.profilePictureUrl],
    references: [imageTable.id],
  }),
  progress: one(userProgressTable, {
    fields: [userTable.id],
    references: [userProgressTable.userId],
  }),
}));

export const oauthAccountsRelations = relations(
  oauthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oauthAccountTable.userId],
      references: [userTable.id],
    }),
  }),
);

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const instructorsRelations = relations(
  instructorTable,
  ({ one, many }) => ({
    courses: many(courseTable),
    user: one(userTable, {
      fields: [instructorTable.id],
      references: [userTable.id],
    }),
  }),
);

export const coursesRelations = relations(courseTable, ({ one, many }) => ({
  instructor: one(instructorTable, {
    fields: [courseTable.instructorId],
    references: [instructorTable.id],
  }),
  enrollments: many(enrollmentTable),
  tags: many(courseTagsTable),
  images: one(imageTable, {
    fields: [courseTable.thumbnailUrl],
    references: [imageTable.id],
  }),
  chapters: many(chapterTable),
}));

export const chaptersRelations = relations(chapterTable, ({ one }) => ({
  course: one(courseTable, {
    fields: [chapterTable.courseId],
    references: [courseTable.id],
  }),
  video: one(videoTable, {
    fields: [chapterTable.videoId],
    references: [videoTable.id],
  }),
}));

export const tagsRelations = relations(tagTable, ({ many }) => ({
  courses: many(courseTagsTable),
}));

export const courseTagsRelations = relations(courseTagsTable, ({ one }) => ({
  course: one(courseTable, {
    fields: [courseTagsTable.courseId],
    references: [courseTable.id],
  }),
  tag: one(tagTable, {
    fields: [courseTagsTable.tagId],
    references: [tagTable.id],
  }),
}));

export const enrollmentsRelations = relations(enrollmentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [enrollmentTable.userId],
    references: [userTable.id],
  }),
  course: one(courseTable, {
    fields: [enrollmentTable.courseId],
    references: [courseTable.id],
  }),
}));

export const imageRelations = relations(imageTable, ({ one }) => ({
  user: one(userTable, {
    fields: [imageTable.id],
    references: [userTable.profilePictureUrl],
  }),
  course: one(courseTable, {
    fields: [imageTable.id],
    references: [courseTable.thumbnailUrl],
  }),
}));

export const videoRelations = relations(videoTable, ({ one }) => ({
  chapter: one(chapterTable, {
    fields: [videoTable.id],
    references: [chapterTable.videoId],
  }),
}));

export const userProgressRelations = relations(
  userProgressTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [userProgressTable.userId],
      references: [userTable.id],
    }),
    chapter: one(chapterTable, {
      fields: [userProgressTable.chapterId],
      references: [chapterTable.id],
    }),
  }),
);
