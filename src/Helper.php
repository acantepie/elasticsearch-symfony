<?php

namespace App;

class Helper
{

    public function toDate(?string $input, string $format = 'Y-m-d'): ?\DateTimeInterface
    {
        if (!$input) {
            return null;
        }

        $date = \DateTime::createFromFormat($format, $input);
        return false === $date ? null : $date;
    }

}