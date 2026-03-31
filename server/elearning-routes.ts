import { Router } from "express";
import { db } from "./db";
import { eq, and, desc, asc, sql, isNull } from "drizzle-orm";
import { formations, courseModules, courseLessons, enrollments, moduleProgress, lessonProgress } from "../shared/schema";
import { quizzes, quizQuestions, quizAnswers, quizAttempts, certificates, badges, userBadges, userXp, xpEvents, forumThreads, forumReplies, notifications } from "../shared/models/elearning";

const router = Router();

// ============================================================================
// MIDDLEWARE: Auth Check
// ============================================================================

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  next();
};

// ============================================================================
// COURSES - PUBLIC ENDPOINTS
// ============================================================================

/**
 * GET /api/courses
 * List published courses with filters (category, level)
 * Includes module count for each course
 */
router.get("/api/courses", async (req, res) => {
  try {
    const { category, level, search } = req.query;

    let query = db
      .select({
        id: formations.id,
        title: formations.title,
        description: formations.description,
        category: formations.category,
        level: formations.level,
        thumbnail: formations.thumbnail,
        instructor: formations.instructor,
        duration: formations.duration,
        moduleCount: sql<number>`COUNT(DISTINCT ${courseModules.id})`.as("moduleCount"),
        enrollmentCount: sql<number>`COUNT(DISTINCT ${enrollments.id})`.as("enrollmentCount"),
      })
      .from(formations)
      .leftJoin(courseModules, eq(formations.id, courseModules.courseId))
      .leftJoin(enrollments, eq(formations.id, enrollments.courseId))
      .where(eq(formations.published, true))
      .groupBy(formations.id)
      .orderBy(desc(formations.createdAt));

    if (category && category !== "all") {
      query = query.where(eq(formations.category, category as string));
    }

    if (level && level !== "all") {
      query = query.where(eq(formations.level, level as string));
    }

    if (search && search !== "") {
      const searchTerm = `%${search}%`;
      query = query.where(
        sql`${formations.title} ILIKE ${searchTerm} OR ${formations.description} ILIKE ${searchTerm}`
      );
    }

    const courses = await query;

    res.json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des cours" });
  }
});

/**
 * GET /api/courses/:id
 * Get course detail with modules and lesson counts
 */
router.get("/api/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await db
      .select({
        id: formations.id,
        title: formations.title,
        description: formations.description,
        category: formations.category,
        level: formations.level,
        thumbnail: formations.thumbnail,
        instructor: formations.instructor,
        duration: formations.duration,
        objectives: formations.objectives,
        prerequisites: formations.prerequisites,
        published: formations.published,
        createdAt: formations.createdAt,
      })
      .from(formations)
      .where(eq(formations.id, id))
      .then((results) => results[0]);

    if (!course) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    const modules = await db
      .select({
        id: courseModules.id,
        title: courseModules.title,
        description: courseModules.description,
        order: courseModules.order,
        lessonCount: sql<number>`COUNT(DISTINCT ${courseLessons.id})`.as("lessonCount"),
      })
      .from(courseModules)
      .leftJoin(courseLessons, eq(courseModules.id, courseLessons.moduleId))
      .where(eq(courseModules.courseId, id))
      .groupBy(courseModules.id)
      .orderBy(asc(courseModules.order));

    const enrollmentCount = await db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(enrollments)
      .where(eq(enrollments.courseId, id))
      .then((results) => results[0]?.count || 0);

    res.json({
      success: true,
      data: {
        ...course,
        modules,
        enrollmentCount,
      },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du cours" });
  }
});

// ============================================================================
// ENROLLMENT - AUTH REQUIRED
// ============================================================================

/**
 * POST /api/courses/:id/enroll
 * Enroll current user in a course
 */
router.post("/api/courses/:id/enroll", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;

    // Check if course exists
    const course = await db.select().from(formations).where(eq(formations.id, id));
    if (!course.length) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, id)));

    if (existing.length) {
      return res.status(400).json({ error: "Déjà inscrit à ce cours" });
    }

    // Create enrollment
    const enrollment = await db
      .insert(enrollments)
      .values({
        userId,
        courseId: id,
        enrolledAt: new Date(),
        progress: 0,
      })
      .returning();

    // Award XP for enrollment
    await db.insert(xpEvents).values({
      userId,
      points: 10,
      action: "course_enrollment",
      courseId: id,
      createdAt: new Date(),
    });

    await db
      .update(userXp)
      .set({ totalXp: sql`totalXp + 10` })
      .where(eq(userXp.userId, userId));

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: enrollment[0],
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

/**
 * GET /api/my/enrollments
 * Get current user's enrollments with progress
 */
router.get("/api/my/enrollments", requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;

    const userEnrollments = await db
      .select({
        id: enrollments.id,
        courseId: formations.id,
        title: formations.title,
        description: formations.description,
        thumbnail: formations.thumbnail,
        level: formations.level,
        progress: enrollments.progress,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
      })
      .from(enrollments)
      .innerJoin(formations, eq(enrollments.courseId, formations.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));

    res.json({
      success: true,
      data: userEnrollments,
      count: userEnrollments.length,
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des inscriptions" });
  }
});

// ============================================================================
// LESSONS & PROGRESS - AUTH REQUIRED
// ============================================================================

/**
 * GET /api/courses/:courseId/modules
 * Get modules with lessons for enrolled user
 */
router.get("/api/courses/:courseId/modules", requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = (req.user as any).id;

    // Check if user is enrolled
    const enrollment = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    if (!enrollment.length) {
      return res.status(403).json({ error: "Non inscrit à ce cours" });
    }

    const modules = await db
      .select({
        id: courseModules.id,
        title: courseModules.title,
        description: courseModules.description,
        order: courseModules.order,
        duration: courseModules.duration,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(asc(courseModules.order));

    const lessonsWithProgress = await Promise.all(
      modules.map(async (module) => {
        const lessons = await db
          .select({
            id: courseLessons.id,
            title: courseLessons.title,
            description: courseLessons.description,
            order: courseLessons.order,
            duration: courseLessons.duration,
            videoUrl: courseLessons.videoUrl,
            completed: lessonProgress.completed,
            watchedSeconds: lessonProgress.watchedSeconds,
          })
          .from(courseLessons)
          .leftJoin(
            lessonProgress,
            and(
              eq(lessonProgress.lessonId, courseLessons.id),
              eq(lessonProgress.userId, userId)
            )
          )
          .where(eq(courseLessons.moduleId, module.id))
          .orderBy(asc(courseLessons.order));

        return { ...module, lessons };
      })
    );

    res.json({
      success: true,
      data: lessonsWithProgress,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des modules" });
  }
});

/**
 * POST /api/lessons/:lessonId/progress
 * Update lesson progress (body: { watchedSeconds, completed })
 */
router.post("/api/lessons/:lessonId/progress", requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { watchedSeconds, completed } = req.body;
    const userId = (req.user as any).id;

    // Validate input
    if (typeof watchedSeconds !== "number" || typeof completed !== "boolean") {
      return res.status(400).json({ error: "Données invalides" });
    }

    // Check if lesson exists
    const lesson = await db.select().from(courseLessons).where(eq(courseLessons.id, lessonId));
    if (!lesson.length) {
      return res.status(404).json({ error: "Leçon non trouvée" });
    }

    // Check existing progress
    const existing = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));

    let progress;
    if (existing.length) {
      // Update existing progress
      progress = await db
        .update(lessonProgress)
        .set({
          watchedSeconds,
          completed,
          updatedAt: new Date(),
        })
        .where(
          and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId))
        )
        .returning();
    } else {
      // Create new progress
      progress = await db
        .insert(lessonProgress)
        .values({
          userId,
          lessonId,
          watchedSeconds,
          completed,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }

    // Award XP if lesson completed
    if (completed && (!existing.length || !existing[0].completed)) {
      const lessonDetails = lesson[0];
      const courseModule = await db
        .select()
        .from(courseModules)
        .where(eq(courseModules.id, lessonDetails.moduleId));

      await db.insert(xpEvents).values({
        userId,
        points: 20,
        action: "lesson_completed",
        courseId: courseModule[0].courseId,
        createdAt: new Date(),
      });

      await db
        .update(userXp)
        .set({ totalXp: sql`totalXp + 20` })
        .where(eq(userXp.userId, userId));
    }

    // Update course progress
    const courseModule = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.id, lesson[0].moduleId));

    const courseId = courseModule[0].courseId;
    const totalLessons = await db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(courseLessons)
      .innerJoin(courseModules, eq(courseLessons.moduleId, courseModules.id))
      .where(eq(courseModules.courseId, courseId))
      .then((results) => results[0]?.count || 1);

    const completedLessons = await db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(lessonProgress)
      .innerJoin(courseLessons, eq(lessonProgress.lessonId, courseLessons.id))
      .innerJoin(courseModules, eq(courseLessons.moduleId, courseModules.id))
      .where(
        and(eq(courseModules.courseId, courseId), eq(lessonProgress.userId, userId), eq(lessonProgress.completed, true))
      )
      .then((results) => results[0]?.count || 0);

    const courseProgress = Math.round((completedLessons / totalLessons) * 100);

    await db
      .update(enrollments)
      .set({ progress: courseProgress })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    res.json({
      success: true,
      message: "Progression mise à jour",
      data: progress[0],
    });
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la progression" });
  }
});

/**
 * GET /api/my/progress/:courseId
 * Get detailed progress for a course
 */
router.get("/api/my/progress/:courseId", requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = (req.user as any).id;

    // Check enrollment
    const enrollment = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    if (!enrollment.length) {
      return res.status(403).json({ error: "Non inscrit à ce cours" });
    }

    // Get modules with progress
    const modules = await db
      .select({
        id: courseModules.id,
        title: courseModules.title,
        order: courseModules.order,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(asc(courseModules.order));

    const progress = await Promise.all(
      modules.map(async (module) => {
        const lessons = await db
          .select({
            id: courseLessons.id,
            title: courseLessons.title,
            completed: lessonProgress.completed,
            watchedSeconds: lessonProgress.watchedSeconds,
          })
          .from(courseLessons)
          .leftJoin(
            lessonProgress,
            and(
              eq(lessonProgress.lessonId, courseLessons.id),
              eq(lessonProgress.userId, userId)
            )
          )
          .where(eq(courseLessons.moduleId, module.id));

        const totalLessons = lessons.length;
        const completedLessons = lessons.filter((l) => l.completed).length;
        const moduleProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          ...module,
          progress: moduleProgress,
          completedLessons,
          totalLessons,
          lessons,
        };
      })
    );

    const totalLessons = progress.reduce((sum, m) => sum + m.totalLessons, 0);
    const completedLessons = progress.reduce((sum, m) => sum + m.completedLessons, 0);
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      success: true,
      data: {
        courseId,
        overallProgress,
        completedLessons,
        totalLessons,
        modules: progress,
        enrolledAt: enrollment[0].enrolledAt,
        completedAt: enrollment[0].completedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la progression" });
  }
});

// ============================================================================
// QUIZZES - AUTH REQUIRED
// ============================================================================

/**
 * GET /api/modules/:moduleId/quiz
 * Get quiz with questions (without correct answers!)
 */
router.get("/api/modules/:moduleId/quiz", requireAuth, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = (req.user as any).id;

    // Get quiz for module
    const quiz = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.moduleId, moduleId))
      .then((results) => results[0]);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz non trouvé" });
    }

    // Get questions with answers (but don't expose correct ones yet)
    const questions = await db
      .select({
        id: quizQuestions.id,
        question: quizQuestions.question,
        type: quizQuestions.type,
        order: quizQuestions.order,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quiz.id))
      .orderBy(asc(quizQuestions.order));

    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answers = await db
          .select({
            id: quizAnswers.id,
            text: quizAnswers.text,
            order: quizAnswers.order,
          })
          .from(quizAnswers)
          .where(eq(quizAnswers.questionId, q.id))
          .orderBy(asc(quizAnswers.order));

        return { ...q, answers };
      })
    );

    // Get previous attempts if any
    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quiz.id)))
      .orderBy(desc(quizAttempts.attemptedAt));

    res.json({
      success: true,
      data: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        questions: questionsWithAnswers,
        previousAttempts: attempts.map((a) => ({
          id: a.id,
          score: a.score,
          attemptedAt: a.attemptedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du quiz" });
  }
});

/**
 * POST /api/quizzes/:quizId/submit
 * Submit quiz answers, calculate score, return results with correct answers
 */
router.post("/api/quizzes/:quizId/submit", requireAuth, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // answers: { questionId: answerId }
    const userId = (req.user as any).id;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Réponses invalides" });
    }

    // Get quiz
    const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (!quiz.length) {
      return res.status(404).json({ error: "Quiz non trouvé" });
    }

    // Get all questions and correct answers
    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));

    const correctAnswers = await db.select().from(quizAnswers).where(eq(quizAnswers.isCorrect, true));

    let score = 0;
    const resultDetails: any[] = [];

    for (const question of questions) {
      const studentAnswerId = answers[question.id];
      const correctAnswer = correctAnswers.find((a) => a.questionId === question.id);

      const isCorrect = studentAnswerId === correctAnswer?.id;
      if (isCorrect) {
        score += 1;
      }

      resultDetails.push({
        questionId: question.id,
        studentAnswerId,
        correctAnswerId: correctAnswer?.id,
        isCorrect,
      });
    }

    const scorePercentage = Math.round((score / questions.length) * 100);
    const passed = scorePercentage >= (quiz[0].passingScore || 70);

    // Save attempt
    const attempt = await db
      .insert(quizAttempts)
      .values({
        userId,
        quizId,
        score: scorePercentage,
        passed,
        attemptedAt: new Date(),
        answersJson: JSON.stringify(answers),
      })
      .returning();

    // Award XP if passed
    if (passed) {
      let xpPoints = 50; // Base XP for passing

      // Award extra XP for perfect score
      if (scorePercentage === 100) {
        xpPoints = 100;
      }

      // Get course ID from module
      const module = await db
        .select()
        .from(courseModules)
        .where(eq(courseModules.id, quiz[0].moduleId));

      await db.insert(xpEvents).values({
        userId,
        points: xpPoints,
        action: scorePercentage === 100 ? "perfect_quiz_score" : "quiz_passed",
        courseId: module[0].courseId,
        createdAt: new Date(),
      });

      await db
        .update(userXp)
        .set({ totalXp: sql`totalXp + ${xpPoints}` })
        .where(eq(userXp.userId, userId));
    }

    // Check if certificate should be issued
    // (This is a placeholder - implement full certificate logic in production)

    res.json({
      success: true,
      data: {
        attemptId: attempt[0].id,
        score: scorePercentage,
        passed,
        xpEarned: passed ? (scorePercentage === 100 ? 100 : 50) : 0,
        details: resultDetails,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Erreur lors de la soumission du quiz" });
  }
});

/**
 * GET /api/my/quiz-attempts
 * Get user's quiz attempt history
 */
router.get("/api/my/quiz-attempts", requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;

    const attempts = await db
      .select({
        id: quizAttempts.id,
        quizId: quizzes.id,
        quizTitle: quizzes.title,
        score: quizAttempts.score,
        passed: quizAttempts.passed,
        attemptedAt: quizAttempts.attemptedAt,
      })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.attemptedAt));

    res.json({
      success: true,
      data: attempts,
      count: attempts.length,
    });
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'historique des quiz" });
  }
});

// ============================================================================
// CERTIFICATES - PUBLIC & AUTH
// ============================================================================

/**
 * GET /api/my/certificates
 * Get user's earned certificates
 */
router.get("/api/my/certificates", requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;

    const userCerts = await db
      .select({
        id: certificates.id,
        courseId: formations.id,
        courseName: formations.title,
        certificateCode: certificates.code,
        issuedAt: certificates.issuedAt,
        expiresAt: certificates.expiresAt,
      })
      .from(certificates)
      .innerJoin(formations, eq(certificates.courseId, formations.id))
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt));

    res.json({
      success: true,
      data: userCerts,
      count: userCerts.length,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des certificats" });
  }
});

/**
 * GET /api/verify/:code
 * Public: verify a certificate by code
 */
router.get("/api/verify/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const cert = await db
      .select({
        id: certificates.id,
        userId: certificates.userId,
        courseId: formations.id,
        courseName: formations.title,
        code: certificates.code,
        issuedAt: certificates.issuedAt,
        expiresAt: certificates.expiresAt,
        valid: sql<boolean>`${certificates.expiresAt} IS NULL OR ${certificates.expiresAt} > NOW()`.as("valid"),
      })
      .from(certificates)
      .innerJoin(formations, eq(certificates.courseId, formations.id))
      .where(eq(certificates.code, code))
      .then((results) => results[0]);

    if (!cert) {
      return res.status(404).json({ error: "Certificat non trouvé" });
    }

    res.json({
      success: true,
      data: {
        ...cert,
        valid: cert.valid || (cert.expiresAt === null || new Date(cert.expiresAt) > new Date()),
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ error: "Erreur lors de la vérification du certificat" });
  }
});

// ============================================================================
// GAMIFICATION - AUTH REQUIRED
// ============================================================================

/**
 * GET /api/my/xp
 * Get user's XP, streak, badges
 */
router.get("/api/my/xp", requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;

    // Get user XP
    const xpData = await db.select().from(userXp).where(eq(userXp.userId, userId));

    // Get badges
    const userBadgesList = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        icon: badges.icon,
        earnedAt: userBadges.earnedAt,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));

    // Calculate streak
    const recentActivity = await db
      .select({
        date: sql<string>`DATE(${xpEvents.createdAt})`.as("date"),
      })
      .from(xpEvents)
      .where(eq(xpEvents.userId, userId))
      .groupBy(sql`DATE(${xpEvents.createdAt})`)
      .orderBy(desc(sql`DATE(${xpEvents.createdAt})`))
      .limit(30);

    let streak = 0;
    if (recentActivity.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < recentActivity.length; i++) {
        const checkDate = new Date(recentActivity[i].date);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (checkDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalXp: xpData[0]?.totalXp || 0,
        level: Math.floor((xpData[0]?.totalXp || 0) / 1000) + 1,
        streak,
        badges: userBadgesList,
        badgeCount: userBadgesList.length,
      },
    });
  } catch (error) {
    console.error("Error fetching XP data:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des points XP" });
  }
});

/**
 * GET /api/leaderboard
 * Top 20 users by XP (anonymized)
 */
router.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await db
      .select({
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${userXp.totalXp} DESC)`.as("rank"),
        totalXp: userXp.totalXp,
        level: sql<number>`FLOOR(${userXp.totalXp} / 1000) + 1`.as("level"),
      })
      .from(userXp)
      .orderBy(desc(userXp.totalXp))
      .limit(20);

    res.json({
      success: true,
      data: leaderboard.map((user, index) => ({
        rank: index + 1,
        xp: user.totalXp,
        level: user.level,
      })),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du classement" });
  }
});

/**
 * GET /api/my/notifications
 * Get user's notifications
 */
router.get("/api/my/notifications", requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { unreadOnly } = req.query;

    let query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId));

    if (unreadOnly === "true") {
      query = query.where(eq(notifications.read, false));
    }

    const notifs = await query.orderBy(desc(notifications.createdAt));

    res.json({
      success: true,
      data: notifs,
      count: notifs.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
  }
});

/**
 * POST /api/my/notifications/:id/read
 * Mark notification as read
 */
router.post("/api/my/notifications/:id/read", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;

    // Verify ownership
    const notif = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));

    if (!notif.length) {
      return res.status(404).json({ error: "Notification non trouvée" });
    }

    await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(eq(notifications.id, id));

    res.json({
      success: true,
      message: "Notification marquée comme lue",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la notification" });
  }
});

// ============================================================================
// FORUM - AUTH REQUIRED
// ============================================================================

/**
 * GET /api/courses/:courseId/forum
 * List threads for a course
 */
router.get("/api/courses/:courseId/forum", requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sort = "recent" } = req.query;

    let orderBy: any = desc(forumThreads.createdAt);
    if (sort === "popular") {
      orderBy = desc(
        sql`(SELECT COUNT(*) FROM ${forumReplies} WHERE ${forumReplies.threadId} = ${forumThreads.id})`
      );
    }

    const threads = await db
      .select({
        id: forumThreads.id,
        title: forumThreads.title,
        content: forumThreads.content,
        createdAt: forumThreads.createdAt,
        replyCount: sql<number>`COUNT(${forumReplies.id})`.as("replyCount"),
      })
      .from(forumThreads)
      .leftJoin(forumReplies, eq(forumThreads.id, forumReplies.threadId))
      .where(eq(forumThreads.courseId, courseId))
      .groupBy(forumThreads.id)
      .orderBy(orderBy);

    res.json({
      success: true,
      data: threads,
      count: threads.length,
    });
  } catch (error) {
    console.error("Error fetching forum threads:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des discussions" });
  }
});

/**
 * POST /api/courses/:courseId/forum
 * Create thread
 */
router.post("/api/courses/:courseId/forum", requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    const userId = (req.user as any).id;

    if (!title || !content) {
      return res.status(400).json({ error: "Titre et contenu requis" });
    }

    const thread = await db
      .insert(forumThreads)
      .values({
        courseId,
        userId,
        title,
        content,
        createdAt: new Date(),
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Discussion créée",
      data: thread[0],
    });
  } catch (error) {
    console.error("Error creating forum thread:", error);
    res.status(500).json({ error: "Erreur lors de la création de la discussion" });
  }
});

/**
 * GET /api/forum/:threadId
 * Get thread with replies
 */
router.get("/api/forum/:threadId", requireAuth, async (req, res) => {
  try {
    const { threadId } = req.params;

    const thread = await db
      .select()
      .from(forumThreads)
      .where(eq(forumThreads.id, threadId))
      .then((results) => results[0]);

    if (!thread) {
      return res.status(404).json({ error: "Discussion non trouvée" });
    }

    const replies = await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.threadId, threadId))
      .orderBy(asc(forumReplies.createdAt));

    res.json({
      success: true,
      data: {
        thread,
        replies,
        replyCount: replies.length,
      },
    });
  } catch (error) {
    console.error("Error fetching forum thread:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la discussion" });
  }
});

/**
 * POST /api/forum/:threadId/reply
 * Add reply
 */
router.post("/api/forum/:threadId/reply", requireAuth, async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    const userId = (req.user as any).id;

    if (!content) {
      return res.status(400).json({ error: "Contenu requis" });
    }

    // Check thread exists
    const thread = await db.select().from(forumThreads).where(eq(forumThreads.id, threadId));
    if (!thread.length) {
      return res.status(404).json({ error: "Discussion non trouvée" });
    }

    const reply = await db
      .insert(forumReplies)
      .values({
        threadId,
        userId,
        content,
        createdAt: new Date(),
      })
      .returning();

    // Award XP for forum participation
    await db.insert(xpEvents).values({
      userId,
      points: 5,
      action: "forum_reply",
      createdAt: new Date(),
    });

    await db
      .update(userXp)
      .set({ totalXp: sql`totalXp + 5` })
      .where(eq(userXp.userId, userId));

    res.status(201).json({
      success: true,
      message: "Réponse ajoutée",
      data: reply[0],
    });
  } catch (error) {
    console.error("Error creating forum reply:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de la réponse" });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

export default router;
