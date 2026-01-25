import express from 'express';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';

const router = express.Router();
router.get("/admin", auth, role("ADMIN", "SUPER_ADMIN"), (req, res) => {
  res.json({ message: "Admin access granted" });
});
export default router;