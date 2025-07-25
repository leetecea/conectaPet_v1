export interface User {
  id: number;
  name: string;
  email: string;
  userType: 'adotante' | 'ong';
  cnpj?: string;
  description?: string;
  createdAt: Date;
  profileImage?: string;
}

export interface UserProfile extends User {
  favoritesPets: number[];
  adoptedPets?: number[];
  registeredPets?: number[];
}