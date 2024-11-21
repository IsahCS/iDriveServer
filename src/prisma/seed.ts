import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.driver.createMany({
    data: [
      {
        name: 'Homer Simpson',
        description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        car: 'Plymouth Valiant 1973 rosa e enferrujado',
        rating: 2,
        ratePerKm: 2.5,
        minKm: 1,
        review: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.'
      },
      {
        name: 'Dominic Toretto',
        description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
        car: 'Dodge Charger R/T 1970 modificado',
        rating: 4,
        ratePerKm: 5.0,
        minKm: 5,
        review: 'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!'
      },
      {
        name: 'James Bond',
        description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
        car: 'Aston Martin DB5 clássico',
        rating: 5,
        ratePerKm: 10.0,
        minKm: 10,
        review: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.'
      }
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });