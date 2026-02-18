
import React from 'react';
import { Service } from './types';
import { EyeIcon, SparklesIcon, FaceSmileIcon, WrenchScrewdriverIcon } from './components/icons';

export const DEFAULT_SERVICES: Service[] = [
  // Extensão de Cílios
  {
    id: 'cilios_classico',
    category: 'Extensão de Cílios',
    name: 'Fio a Fio Clássico',
    description: 'Um fio sintético colado em cada fio natural, para um look discreto e natural.',
    price: 150,
    duration: 120,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_brasileiro',
    category: 'Extensão de Cílios',
    name: 'Volume Brasileiro',
    description: 'Técnica com fios em formato de Y, proporcionando mais volume com leveza.',
    price: 180,
    duration: 150,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_russo',
    category: 'Extensão de Cílios',
    name: 'Volume Russo',
    description: 'Criação de fans com 3 a 6 fios super finos, para um volume intenso e dramático.',
    price: 220,
    duration: 180,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_egipcio',
    category: 'Extensão de Cílios',
    name: 'Volume Egípcio',
    description: 'Mix de fios com diferentes espessuras para um efeito volumoso e texturizado.',
    price: 200,
    duration: 160,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_mega',
    category: 'Extensão de Cílios',
    name: 'Mega Volume',
    description: 'O máximo de volume, com fans de 7 a 15 fios, para um olhar marcante.',
    price: 250,
    duration: 200,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_gatinho',
    category: 'Extensão de Cílios',
    name: 'Mapping Gatinho',
    description: 'Fios menores no canto interno e maiores no externo, alongando o olhar.',
    price: 180,
    duration: 150,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_boneca',
    category: 'Extensão de Cílios',
    name: 'Mapping Boneca',
    description: 'Fios maiores no centro dos olhos, abrindo e arredondando o olhar.',
    price: 180,
    duration: 150,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  {
    id: 'cilios_fox',
    category: 'Extensão de Cílios',
    name: 'Mapping Fox Eyes',
    description: 'Efeito lifting com fios alongados no canto externo, criando um olhar "puxado".',
    price: 190,
    duration: 150,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(EyeIcon),
  },
  // Manutenção de Cílios
  {
    id: 'manut_15',
    category: 'Manutenção de Cílios',
    name: 'Manutenção 15 dias',
    description: 'Manutenção para até 15 dias após a aplicação. Garante a durabilidade e beleza.',
    price: 80,
    duration: 60,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(WrenchScrewdriverIcon),
  },
  {
    id: 'manut_20',
    category: 'Manutenção de Cílios',
    name: 'Manutenção 20 dias',
    description: 'Manutenção para até 20 dias após a aplicação. Ideal para manter o volume.',
    price: 90,
    duration: 75,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(WrenchScrewdriverIcon),
  },
    {
    id: 'manut_25',
    category: 'Manutenção de Cílios',
    name: 'Manutenção 25 dias',
    description: 'Manutenção para até 25 dias. Após este período, é recomendada nova aplicação.',
    price: 100,
    duration: 90,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(WrenchScrewdriverIcon),
  },
  // Designer de Sobrancelha
  {
    id: 'sob_simples',
    category: 'Designer de Sobrancelha',
    name: 'Design Simples',
    description: 'Modelagem das sobrancelhas com pinça, respeitando o formato natural do rosto.',
    price: 40,
    duration: 30,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(SparklesIcon),
  },
  {
    id: 'sob_henna',
    category: 'Designer de Sobrancelha',
    name: 'Design com Henna',
    description: 'Modelagem com pinça e aplicação de henna para preencher e definir.',
    price: 60,
    duration: 45,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(SparklesIcon),
  },
  // Epilação
  {
    id: 'epil_buco',
    category: 'Epilação Egípcia (Facial)',
    name: 'Buço',
    description: 'Remoção de pelos do buço com a técnica da linha, suave e precisa.',
    price: 20,
    duration: 15,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(FaceSmileIcon),
  },
  {
    id: 'epil_rosto',
    category: 'Epilação Egípcia (Facial)',
    name: 'Rosto Completo',
    description: 'Epilação de todas as áreas do rosto (buço, queixo, testa, bochechas).',
    price: 70,
    duration: 40,
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(FaceSmileIcon),
  },
];
