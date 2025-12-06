export class MenuDuJourDto {
    petitDejeuner: string | null;
    dejeuner: string | null;
    diner: string | null;
    collation: string | null;
}

export class DashboardKpiDto {
    poidsActuel: number | null;
    poidsTotalPerdu: number | null;
    phaseActuelle: string | null;
    jourDansLaPhase: number | null;
    menuDuJour: MenuDuJourDto | null;
}
