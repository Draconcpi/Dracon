import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🐉 Seeding Dracon database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('dracon2024', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dracon.art' },
    update: {},
    create: {
      email: 'admin@dracon.art',
      name: 'Dracon Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ilustracao' },
      update: {},
      create: {
        name: 'Ilustração',
        slug: 'ilustracao',
        description: 'Ilustrações originais com temas de fantasia e magia',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'concept-art' },
      update: {},
      create: {
        name: 'Concept Art',
        slug: 'concept-art',
        description: 'Arte conceitual para jogos, filmes e projetos criativos',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'animacao' },
      update: {},
      create: {
        name: 'Animação',
        slug: 'animacao',
        description: 'Animações 2D e motion graphics com temática mística',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'arte-digital-mistica' },
      update: {},
      create: {
        name: 'Arte Digital Mística',
        slug: 'arte-digital-mistica',
        description: 'Arte digital com elementos de astrologia, constelações e magia',
      },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create portfolio items
  const portfolioItems = [
    {
      title: 'O Guardião das Estrelas',
      slug: 'o-guardiao-das-estrelas',
      description: 'Uma criatura ancestral que vela pelos segredos das constelações. Esta ilustração foi inspirada nas lendas sobre seres que protegem o equilíbrio entre os mundos terrestre e celeste.',
      imageUrl: '/images/portfolio/guardian-stars.jpg',
      categoryId: categories[0].id,
      tags: ['fantasia', 'estrelas', 'guardião', 'noite'],
      featured: true,
      order: 1,
    },
    {
      title: 'Dragão Arcano',
      slug: 'dragao-arcano',
      description: 'Um dragão nascido das forças primordiais da magia, envolvido em runas e energia arcana. Concept art para projeto pessoal de worldbuilding.',
      imageUrl: '/images/portfolio/arcane-dragon.jpg',
      categoryId: categories[1].id,
      tags: ['dragão', 'arcano', 'magia', 'runas'],
      featured: true,
      order: 2,
    },
    {
      title: 'Ritual da Lua Crescente',
      slug: 'ritual-da-lua-crescente',
      description: 'Animação loop de um ritual mágico sob a luz da lua crescente, com partículas de energia fluindo entre símbolos antigos.',
      imageUrl: '/images/portfolio/moon-ritual.jpg',
      categoryId: categories[2].id,
      tags: ['animação', 'lua', 'ritual', 'magia'],
      featured: true,
      order: 3,
    },
    {
      title: 'Constelação do Fênix',
      slug: 'constelacao-do-fenix',
      description: 'Mapa estelar místico representando a constelação perdida do Fênix, desenhada com técnicas de arte digital e elementos de astrologia antiga.',
      imageUrl: '/images/portfolio/phoenix-constellation.jpg',
      categoryId: categories[3].id,
      tags: ['constelação', 'fênix', 'astrologia', 'estrelas'],
      featured: true,
      order: 4,
    },
    {
      title: 'A Feiticeira das Sombras',
      slug: 'a-feiticeira-das-sombras',
      description: 'Personagem mística que manipula as sombras como extensão de sua vontade. Ilustração com paleta profunda de roxos e acentos em laranja.',
      imageUrl: '/images/portfolio/shadow-sorceress.jpg',
      categoryId: categories[0].id,
      tags: ['feiticeira', 'sombras', 'personagem', 'fantasia'],
      featured: false,
      order: 5,
    },
    {
      title: 'Fortaleza nas Nuvens',
      slug: 'fortaleza-nas-nuvens',
      description: 'Concept art de uma fortaleza flutuante entre as nuvens, lar de uma ordem antiga de magos astrais.',
      imageUrl: '/images/portfolio/cloud-fortress.jpg',
      categoryId: categories[1].id,
      tags: ['fortaleza', 'nuvens', 'concept', 'ambiente'],
      featured: false,
      order: 6,
    },
    {
      title: 'Olho do Cosmos',
      slug: 'olho-do-cosmos',
      description: 'Arte digital mística representando o Olho do Cosmos — um portal entre dimensões, cercado por runas celestiais e energia primordial.',
      imageUrl: '/images/portfolio/cosmic-eye.jpg',
      categoryId: categories[3].id,
      tags: ['cosmos', 'portal', 'runas', 'místico'],
      featured: false,
      order: 7,
    },
    {
      title: 'Espírito da Floresta',
      slug: 'espirito-da-floresta',
      description: 'Animação de um espírito da floresta emergindo das raízes de uma árvore ancestral, com partículas de energia natural.',
      imageUrl: '/images/portfolio/forest-spirit.jpg',
      categoryId: categories[2].id,
      tags: ['espírito', 'floresta', 'animação', 'natureza'],
      featured: false,
      order: 8,
    },
  ];

  for (const item of portfolioItems) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }
  console.log('✅ Portfolio items created:', portfolioItems.length);

  // Create services
  const services = [
    {
      title: 'Ilustração Personalizada',
      slug: 'ilustracao-personalizada',
      description: 'Criação de ilustrações únicas e personalizadas com temática de fantasia, magia e elementos místicos. Cada peça é criada do zero, desde o esboço até a arte final em alta resolução.',
      shortDescription: 'Ilustrações originais de fantasia e magia sob encomenda.',
      price: 'A partir de R$ 350',
      priceNote: 'Preço varia conforme complexidade e tamanho',
      features: ['Esboço + 2 revisões', 'Arte final em alta resolução', 'Arquivo PNG e PSD', 'Comercial ou pessoal', 'Prazo: 7-14 dias'],
      icon: '🎨',
      order: 1,
      active: true,
    },
    {
      title: 'Concept Art',
      slug: 'concept-art',
      description: 'Desenvolvimento visual de conceitos para jogos, filmes, livros e projetos criativos. Inclui design de personagens, ambientes e criaturas com estética arcana.',
      shortDescription: 'Design visual de personagens, criaturas e ambientes.',
      price: 'A partir de R$ 500',
      priceNote: 'Pacotes disponíveis para projetos maiores',
      features: ['Múltiplos conceitos iniciais', 'Turnaround sheet', 'Detalhes de design', 'Style guide', 'Prazo: 10-21 dias'],
      icon: '✏️',
      order: 2,
      active: true,
    },
    {
      title: 'Animação 2D',
      slug: 'animacao-2d',
      description: 'Animações curtas, loops e motion graphics com estética mística e fantástica. Ideal para redes sociais, intros de vídeo e projetos artísticos.',
      shortDescription: 'Animações curtas e loops com temática mística.',
      price: 'A partir de R$ 800',
      priceNote: 'Consulte para projetos mais longos',
      features: ['Storyboard incluído', 'Até 15 segundos', 'Formato MP4/GIF', 'Trilha sonora opcional', 'Prazo: 14-30 dias'],
      icon: '🎬',
      order: 3,
      active: true,
    },
    {
      title: 'Design de Personagem',
      slug: 'design-de-personagem',
      description: 'Criação completa de personagens originais com ficha de referência, poses, expressões e detalhes de equipamento/vestimenta.',
      shortDescription: 'Personagens originais com ficha completa de referência.',
      price: 'A partir de R$ 600',
      priceNote: 'Inclui ficha de referência completa',
      features: ['Design original completo', 'Vista frontal e traseira', 'Expressões faciais', 'Detalhes de equipamento', 'Prazo: 10-18 dias'],
      icon: '🐉',
      order: 4,
      active: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('✅ Services created:', services.length);

  // Create settings
  const settings = [
    { key: 'site_title', value: 'Dracon' },
    { key: 'site_description', value: 'Portfólio de ilustração e animação — arte mística, fantasia e mundos arcanos.' },
    { key: 'artist_name', value: 'Dracon' },
    { key: 'artist_bio', value: 'Artista digital especializado em ilustração de fantasia, concept art e animação. Inspirado por mundos arcanos, constelações e a magia que existe entre o visível e o invisível.' },
    { key: 'contact_email', value: 'contato@dracon.art' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Settings created:', settings.length);

  console.log('🐉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
