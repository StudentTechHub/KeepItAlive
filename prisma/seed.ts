import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed service types
  const mongodbType = await prisma.serviceType.upsert({
    where: { type: "MongoDB" },
    update: {},
    create: {
      type: "MongoDB",
      displayName: "MongoDB",
      defaultPort: 27017,
      category: "Database",
      iconUrl: "/icons/mongodb.svg"
    }
  });

  console.log("Created service type:", mongodbType);

  // Seed service icons
  const mongodbIcon = await prisma.serviceIcon.upsert({
    where: { name: "mongodb" },
    update: {},
    create: {
      name: "mongodb",
      iconPath: "/icons/mongodb.svg"
    }
  });

  console.log("Created service icon:", mongodbIcon);

  // Seed some service colors
  const colors = [
    { name: "Green", hexValue: "#10B981" },
    { name: "Blue", hexValue: "#3B82F6" },
    { name: "Purple", hexValue: "#8B5CF6" },
    { name: "Red", hexValue: "#EF4444" },
    { name: "Orange", hexValue: "#F97316" },
    { name: "Amber", hexValue: "#F59E0B" },
    { name: "Teal", hexValue: "#14B8A6" },
    { name: "Indigo", hexValue: "#6366F1" }
  ];

  for (const color of colors) {
    await prisma.serviceColor.upsert({
      where: { name: color.name },
      update: {},
      create: color
    });
  }

  console.log(`Created ${colors.length} service colors`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
