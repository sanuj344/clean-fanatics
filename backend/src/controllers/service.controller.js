import prisma from "../config/db.js";

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
      },
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const listServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};


export const getServices = async (req, res) => {
  const services = await prisma.service.findMany();
  res.json(services);
};