const prisma = require("../config/prisma");
const logAudit = require("../utils/auditLogger");

// -----------------------------
// GET CURRENT TENANT
// -----------------------------
exports.getMyTenant = async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId },
    });

    if (!tenant) {
      return res
        .status(404)
        .json({ success: false, message: "Tenant not found" });
    }

    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -----------------------------
// UPDATE CURRENT TENANT
// -----------------------------
exports.updateMyTenant = async (req, res) => {
  const { name } = req.body;

  try {
    const tenant = await prisma.tenant.update({
      where: { id: req.tenantId },
      data: {
        name,
      },
    });

    await logAudit({
      tenantId: tenant.id,
      userId: req.user.userId,
      action: "UPDATE_TENANT",
      entityType: "tenant",
      entityId: tenant.id,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: tenant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -----------------------------
// LIST ALL TENANTS (SUPER ADMIN)
// -----------------------------
exports.listTenants = async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
