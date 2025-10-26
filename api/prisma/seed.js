const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.cliente.deleteMany();
  console.log('🗑️  Dados antigos removidos');

  // Criar clientes iniciais
  const clientes = await prisma.cliente.createMany({
    data: [
      {
        nome: 'Ana Souza',
        email: 'ana@email.com',
        telefone: '85999999999',
        cidade: 'Fortaleza'
      },
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '85988888888',
        cidade: 'Fortaleza'
      },
      {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '85977777777',
        cidade: 'Caucaia'
      }
    ]
  });

  console.log(`✅ ${clientes.count} clientes criados com sucesso!`);

  // Buscar e exibir todos os clientes
  const todosClientes = await prisma.cliente.findMany();
  console.log('\n📋 Clientes cadastrados:');
  todosClientes.forEach(cliente => {
    console.log(`  ${cliente.id} - ${cliente.nome} (${cliente.email})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
