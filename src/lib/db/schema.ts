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

export const userTable = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").unique().notNull(),
    email: text("email").unique(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    hashedPassword: text("password"),
    role: roleEnums("role").default("STUDENT").notNull(),
    profilePictureUrl: text("profile_picture_url"),
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
    .references(() => userTable.id),
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
    .references(() => userTable.id)
    .notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const instructorTable = pgTable("instructors", {
  id: text("id").primaryKey().notNull(),
  bio: text("bio"),
  rating: real("rating").default(0),
  qualification: text("qualification"),
  experience: real("experience").default(0),
});

export const courseTable = pgTable("courses", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  discount: real("discount").default(0),
  price: integer("price").default(0),
  rating: real("rating").default(0),
  thumbnailUrl: text("thumbnail_url"),
  instructorId: text("instructor_id")
    .notNull()
    .references(() => instructorTable.id),
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

export const problemTable = pgTable("problems", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").references(() => userTable.id),
  problemQuestion: text("problem_question").notNull(),
  solution: text("solution"),
  solved: boolean("solved").notNull().default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
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

export const instructorsRelations = relations(instructorTable, ({ many }) => ({
  courses: many(courseTable),
}));

export const coursesRelations = relations(courseTable, ({ one }) => ({
  instructor: one(instructorTable, {
    fields: [courseTable.instructorId],
    references: [instructorTable.id],
  }),
}));

export const usersRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const problemsRelations = relations(problemTable, ({ one }) => ({
  user: one(userTable, {
    fields: [problemTable.userId],
    references: [userTable.id],
  }),
}));

// export const tagTable = pgTable("tags", {
//   id: text("id").primaryKey().notNull(),
//   name: text("name").notNull(),
// });

// export const moduleTable = pgTable("modules", {
//   id: text("id").primaryKey().notNull(),
//   courseId: text("course_id").references(() => courseTable.id),
//   title: text("title").notNull(),
//   description: text("description"),
//   order: integer("order").notNull(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
// });

// export const chapterTable = pgTable("chapters", {
//   id: text("id").primaryKey().notNull(),
//   moduleId: text("module_id").references(() => moduleTable.id),
//   courseId: text("course_id").references(() => courseTable.id),
//   title: text("title").notNull(),
//   description: text("description"),
//   order: integer("order").notNull(),
//   isFree: boolean("is_free").default(false),
//   thumbnailUrl: text("thumbnail_url"),
//   duration: real("duration").default(0),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
// });

// export const enrollmentTable = pgTable("enrollments", {
//   id: text("id").primaryKey().notNull(),
//   userId: text("user_id").references(() => userTable.id),
//   courseId: text("course_id").references(() => courseTable.id),
//   completed: boolean("completed").default(false),
//   grade: varchar("grade"),
//   certificateIssued: boolean("certificate_issued").default(false),
//   progress: real("progress").default(0.0),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
// });

// export const paymentTable = pgTable("payments", {
//   id: text("id").primaryKey().notNull(),
//   userId: text("user_id").references(() => userTable.id),
//   courseId: text("course_id").references(() => courseTable.id),
//   amount: real("amount").notNull(),
//   paymentMethod: varchar("payment_method"),
//   paymentStatus: paymentStatusEnums("payment_status").notNull(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
// });

// export const feedbackTable = pgTable("feedbacks", {
//   id: text("id").primaryKey().notNull(),
//   userId: text("user_id").references(() => userTable.id),
//   courseId: text("course_id").references(() => courseTable.id),
//   instructorId: text("instructor_id").references(() => instructorTable.id),
//   feedbackType: feedbackTypeEnums("feedback_type").default("PLATFORM"),
//   feedback: text("feedback").notNull(),
//   rating: integer("rating").notNull(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//     mode: "date",
//   }).defaultNow(),
// });
