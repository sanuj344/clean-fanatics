import prisma from "../config/db.js";

// Admin creates service (legacy - can be removed if not needed)
export const createService = async (req, res) => {
  try {
    const { title, category, description, creditCost } = req.body;

    if (!title || !category || !creditCost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await prisma.service.create({
      data: {
        title,
        category,
        description,
        creditCost,
        providerId: req.user.userId, // Admin can also own services
      },
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// Provider creates service
export const createProviderService = async (req, res) => {
  try {
    const { title, category, description, creditCost } = req.body;
    const providerId = req.user.userId;

    if (!title || !category || !creditCost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await prisma.service.create({
      data: {
        title,
        category,
        description,
        creditCost,
        providerId, // Automatically set to logged-in provider
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// Get provider's own services
export const getProviderServices = async (req, res) => {
  try {
    const providerId = req.user.userId;

    const services = await prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
    });

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const listServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};


export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};