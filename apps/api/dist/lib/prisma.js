import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/client/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
const adapter = new PrismaBetterSqlite3({
    url: process.env['DATABASE_URL'] || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });
export default prisma;
//# sourceMappingURL=prisma.js.map