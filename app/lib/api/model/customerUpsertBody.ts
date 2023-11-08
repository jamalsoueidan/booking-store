/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerUpsertBodyProfessions} from './customerUpsertBodyProfessions';
import type {CustomerUpsertBodySocial} from './customerUpsertBodySocial';
import type {CustomerUpsertBodySpeaks} from './customerUpsertBodySpeaks';
import type {CustomerUpsertBodySpecialties} from './customerUpsertBodySpecialties';

export interface CustomerUpsertBody {
  aboutMe: string;
  professions: CustomerUpsertBodyProfessions;
  shortDescription: string;
  social?: CustomerUpsertBodySocial;
  speaks?: CustomerUpsertBodySpeaks;
  specialties: CustomerUpsertBodySpecialties;
  username: string;
}