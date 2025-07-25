// src/app/types/pet.type.ts

export type PetSize = 'Pequeno' | 'Médio' | 'Grande' | string;

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: PetSize;
  color: string;
  description: string;
  imageUrls: string[];
  ownerId?: number;
  adoptionStatus?: string;
  createdAt?: Date;
}
