import {
  BookFormat,
  CommandStatus,
  PaymentMethods,
  UserRole,
} from './AttributeTypes';

export type Utilisateur = {
  id: number;
  nomUtilisateur: string;
  email: string;
  role: UserRole;
  creeLe?: Date;
};

export type UserLogin = {
  username: string;
  password: string;
};

export type UserRegister = {
  username: string;
  email: string;
  password: string;
};

export type Panier = {
  detailLivre: DetailsLivre;
  quantite: number;
  dateAjout: Date;
};

export type Paiement = {
  commandeId: number;
  montant: number;
  methodePaiement: PaymentMethods;
};

export type Livre = {
  id: number;
  titre: string;
  description: string;
  isbn: string;
  datePublication: Date;
  editeur: string;
  genre: string;
  image: string;
  nombrePages: number;
  auteurs: Auteur[];
  details: DetailsLivre[];
};

export type Inventaire = {
  detailLivre: DetailsLivre;
  quantite: number;
};

export type Favoris = {
  livre: Livre;
  dateAjout: Date;
};

export type DetailsLivre = {
  id: number;
  idLivre: number;
  format: BookFormat;
  prixUnitaire: number;
  langue: string;
};

export type DetailsCommande = {
  detailsLivre: DetailsLivre;
  quantite: number;
};

export type Commande = {
  id: number;
  utilisateur: Utilisateur;
  dateCommande: Date;
  prixTotal: number;
  status: CommandStatus;
};

export type Auteur = {
  id: number;
  nom: string;
  biographie: string;
  dateNaissance: Date;
  pays: string;
};
