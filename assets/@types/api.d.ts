declare interface SearchErrorResponse {
    error: string
    description: string
}

declare interface SearchResponse<T> {
    took: number
    timed_out: boolean
    _shards: {
        total: number
        successful: number
        skipped: number
        failed: number
    }
    hits: {
        hits: Hit<T>[]
        max_score: number
        total : {
            relation: string
            value: number
        }
    }
}

declare interface Hit<T> {
    _id: string
    _index: string
    _score: number
    _ignored: ?string[],
    _source: T
}

declare interface ImmeubleHistoriqueSource {
    adresse: string
    affectaire: string
    code_departement: string
    commune: string
    description: string
    historique: string
    insee: string
    nom: string
    ref: string
    region: string
    statut: string
}