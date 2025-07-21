const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  
  // Verifica se o admin já existe
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        nome: 'Admin',
        email: adminEmail,
        senhaHash: senhaHash,
        role: 'ADMIN',
      },
    });
    console.log('Usuário admin padrão criado com sucesso.');
  } else {
    console.log('Usuário admin já existe. Nenhuma ação foi tomada.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 