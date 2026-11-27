import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de base de datos Textech...');

  // 1. Roles
  const rolesData = [
    { name: 'ADMIN', description: 'Administrador general de la plataforma Textech' },
    { name: 'DISTRIBUTOR', description: 'Distribuidor mayorista interesado en catálogo textil' },
    { name: 'DESIGNER', description: 'Diseñador de moda y confección' },
    { name: 'BUYER', description: 'Comprador corporativo o minorista' },
  ];

  const roles: Record<string, { id: string; name: string }> = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
    roles[r.name] = role;
  }

  // 2. Permisos
  const permissionsData = [
    { code: 'products:read', description: 'Ver productos del catálogo' },
    { code: 'products:write', description: 'Crear, editar y eliminar productos' },
    { code: 'leads:read', description: 'Consultar leads captados' },
    { code: 'leads:write', description: 'Actualizar estado de leads' },
    { code: 'catalogs:manage', description: 'Administrar catálogos digitales' },
    { code: 'users:manage', description: 'Gestionar usuarios y roles' },
  ];

  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { code: p.code },
      update: { description: p.description },
      create: p,
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.ADMIN.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roles.ADMIN.id,
        permissionId: perm.id,
      },
    });
  }

  // 3. Usuario Administrador inicial
  const adminPasswordHash = await bcrypt.hash('TextechAdmin2026!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@textech.com' },
    update: {},
    create: {
      email: 'admin@textech.com',
      fullName: 'Administrador Textech',
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: roles.ADMIN.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: roles.ADMIN.id,
    },
  });

  // 4. Categorías Textiles (con jerarquía parent_id)
  const catTelas = await prisma.category.upsert({
    where: { slug: 'telas-tecnicas' },
    update: {},
    create: {
      name: 'Telas Técnicas',
      slug: 'telas-tecnicas',
      description: 'Tejidos de alto rendimiento para confección industrial y deportiva.',
    },
  });

  const catSastreria = await prisma.category.upsert({
    where: { slug: 'sastreria-y-trajes' },
    update: {},
    create: {
      name: 'Sastrería y Trajes',
      slug: 'sastreria-y-trajes',
      description: 'Prendas ejecutivas y tejidos finos de lana fría y lino.',
    },
  });

  const catDeportiva = await prisma.category.upsert({
    where: { slug: 'ropa-deportiva-dryfit' },
    update: {},
    create: {
      name: 'Ropa Deportiva DryFit',
      slug: 'ropa-deportiva-dryfit',
      description: 'Prendas con control de humedad y protección UV.',
      parentId: catTelas.id,
    },
  });

  // 5. Atributos textiles
  const attrComposicion = await prisma.attribute.upsert({
    where: { name: 'Composición' },
    update: {},
    create: { name: 'Composición', unit: '%' },
  });

  const attrGramaje = await prisma.attribute.upsert({
    where: { name: 'Gramaje' },
    update: {},
    create: { name: 'Gramaje', unit: 'g/m²' },
  });

  // 6. Productos Textiles iniciales
  const productsSeed = [
    {
      sku: 'TXT-SAS-001',
      name: 'Traje Ejecutivo Slim Fit Lana Fría',
      description: 'Traje de dos piezas confeccionado en lana fría transpirable con acabado antiarrugas.',
      price: 420.00,
      stock: 45,
      status: 'ACTIVE',
      categoryId: catSastreria.id,
      composicion: '80% Lana Virgen, 20% Poliéster Técnico',
      gramaje: '240',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'TXT-TEC-002',
      name: 'Chaqueta Impermeable Ripstop Pro',
      description: 'Chaqueta técnica con membrana hidrofóbica y costuras termoselladas.',
      price: 185.50,
      stock: 120,
      status: 'ACTIVE',
      categoryId: catTelas.id,
      composicion: '100% Poliamida Ripstop',
      gramaje: '165',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'TXT-DEP-003',
      name: 'Camiseta Técnica Microfibra UV50+',
      description: 'Prenda ligera de secado rápido diseñada para alto desempeño deportivo.',
      price: 48.00,
      stock: 300,
      status: 'ACTIVE',
      categoryId: catDeportiva.id,
      composicion: '92% Poliéster Reciclado, 8% Elastano',
      gramaje: '135',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    },
    {
      sku: 'TXT-SAS-004',
      name: 'Blazer Corporativo Lino-Algodón',
      description: 'Blazer estructurado de corte moderno ideal para uniformes ejecutivos.',
      price: 260.00,
      stock: 75,
      status: 'ACTIVE',
      categoryId: catSastreria.id,
      composicion: '55% Lino Europeo, 45% Algodón Peinado',
      gramaje: '210',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdProductIds: string[] = [];

  for (const p of productsSeed) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        status: p.status,
        categoryId: p.categoryId,
      },
      create: {
        sku: p.sku,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        status: p.status,
        categoryId: p.categoryId,
      },
    });
    createdProductIds.push(product.id);

    await prisma.productAttribute.upsert({
      where: {
        productId_attributeId: {
          productId: product.id,
          attributeId: attrComposicion.id,
        },
      },
      update: { value: p.composicion },
      create: {
        productId: product.id,
        attributeId: attrComposicion.id,
        value: p.composicion,
      },
    });

    await prisma.productAttribute.upsert({
      where: {
        productId_attributeId: {
          productId: product.id,
          attributeId: attrGramaje.id,
        },
      },
      update: { value: p.gramaje },
      create: {
        productId: product.id,
        attributeId: attrGramaje.id,
        value: p.gramaje,
      },
    });

    const existingImages = await prisma.productImage.count({
      where: { productId: product.id },
    });
    if (existingImages === 0) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.imageUrl,
          altText: p.name,
          isPrimary: true,
          sortOrder: 1,
        },
      });
    }
  }

  // 7. Catálogo Digital Corporativo
  const catalog = await prisma.catalog.upsert({
    where: { slug: 'catalogo-textech-2026' },
    update: {},
    create: {
      title: 'Catálogo Textech Colección 2026',
      slug: 'catalogo-textech-2026',
      description: 'Portafolio oficial de prendas ejecutivas, textiles técnicos y línea deportiva.',
      season: '2026',
      pdfUrl: 'https://textech.example.com/catalogos/textech-2026.pdf',
      isActive: true,
    },
  });

  for (let i = 0; i < createdProductIds.length; i++) {
    await prisma.catalogProduct.upsert({
      where: {
        catalogId_productId: {
          catalogId: catalog.id,
          productId: createdProductIds[i],
        },
      },
      update: { sortOrder: i + 1 },
      create: {
        catalogId: catalog.id,
        productId: createdProductIds[i],
        sortOrder: i + 1,
      },
    });
  }

  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
