import { publicProcedure, router } from "@/lib/trpc/init";

export const catalogRouter = router({
  listCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        coverUrl: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }),
});
