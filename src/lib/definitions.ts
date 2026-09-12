import { z } from "zod";

export const RoleSchema = z.enum(["CANDIDATE", "PROVIDER"]);

export type Role = z.infer<typeof RoleSchema>;

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .trim(),
    role: RoleSchema,
  charityRegistrationNumber: z
    .string()
    .trim()
    .max(32, { error: "Registration number is too long." })
    .optional(),
});

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
        charityRegistrationNumber?: string[];
      };
      message?: string;
    }
  | undefined;

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  role: Role;
  expiresAt: string;
};

export const CreateProjectSchema = z.object({
  brief: z
    .string()
    .trim()
    .min(10, { error: "Brief must be at least 10 characters." })
    .max(2000, { error: "Brief must be 2000 characters or less." }),
  industry: z
    .string()
    .trim()
    .min(1, { error: "Choose an industry." }),
});

export type CreateProjectState =
  | {
      errors?: {
        brief?: string[];
        industry?: string[];
      };
      message?: string;
    }
  | undefined;

export const CreateSubmissionSchema = z.object({
  projectId: z.string().trim().min(1, { error: "Choose a project." }),
  content: z
    .string()
    .trim()
    .min(20, { error: "Submission must be at least 20 characters." })
    .max(4000, { error: "Submission must be 4000 characters or less." }),
});

export type CreateSubmissionState =
  | {
      errors?: {
        projectId?: string[];
        content?: string[];
      };
      message?: string;
    }
  | undefined;
