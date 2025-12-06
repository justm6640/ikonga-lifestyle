
export class UserProfileDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    sexe?: string;
    paysOrigine?: string;
    paysResidence?: string;
    villeResidence?: string;
    dateNaissance?: Date;
    contact?: string;
    tailleCm?: number;
    createdAt: Date;
    role: string;
}
