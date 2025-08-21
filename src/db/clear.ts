import { db } from ".";
import { user, verification } from "./schema";

(async function clearDB() {
  await Promise.all([
    db.delete(user),
    db.delete(verification),
    db.execute(`DROP SCHEMA public CASCADE`),
  ]);
})();

