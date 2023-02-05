<?php

namespace App\DTO;

class ImmeubleHistorique
{

    public ?string $commune = null;

    public ?string $codeDepartement = null;


    public ?\DateTimeInterface $dateMaj = null;

    public ?string $insee = null;

    public ?string $region = null;

    public ?string $departement = null;

    public ?string $appellationCourante = null;

    public ?string $siecle = null;

    public ?\DateTimeInterface $dateDeProtection = null;

    public ?string $precisionProtection = null;

    public ?string $auteur = null;

    public ?string $statut = null;

    public ?string $description = null;

    public ?string $historique = null;

    public ?string $affectaire = null;

    public ?string $adresse = null;

    public ?string $precisionLocalisation = null;

    public ?string $reference = null;

    public ?string $contact = null;

    public ?string $geolocX = null;

    public ?string $geolocY = null;


}