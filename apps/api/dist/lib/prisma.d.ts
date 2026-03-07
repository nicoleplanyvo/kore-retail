import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/client/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
declare const prisma: PrismaClient<{
    adapter: PrismaBetterSqlite3;
}, never, import("../../prisma/generated/client/runtime/client.js").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map