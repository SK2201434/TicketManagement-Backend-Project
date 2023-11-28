const router = require("express").Router();
const userRouter = require("../userRouter");
const projectRoutes = require("../projectRoutes");
const taskRoutes = require("../taskRoute");
const reviewRoutes = require("../reviewRouter");
const invoicedRoutes = require("../invoiceRoutes");
const assetsRoutes = require("../uploadAssetsRoutes");
const clientRoutes = require("../clientRoutes");
const validateToken = require("../../middleware/validateToken")

router.use("/user", userRouter);
router.use(validateToken);//do this for using validations for all routes
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use("/invoices", invoicedRoutes);
router.use("/review", reviewRoutes);
router.use("/assets", assetsRoutes);
router.use("/client", clientRoutes);


module.exports = router;
