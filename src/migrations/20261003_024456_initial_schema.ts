import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sectors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sectors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_trainings_format" AS ENUM('in_person', 'remote', 'hybrid');
  CREATE TYPE "public"."enum_trainings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__trainings_v_version_format" AS ENUM('in_person', 'remote', 'hybrid');
  CREATE TYPE "public"."enum__trainings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_publications_type" AS ENUM('article', 'analysis', 'technical_note', 'news', 'opinion', 'regulatory_study');
  CREATE TYPE "public"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_version_type" AS ENUM('article', 'analysis', 'technical_note', 'news', 'opinion', 'regulatory_study');
  CREATE TYPE "public"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_client_disclosure" AS ENUM('named', 'anonymous');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_client_disclosure" AS ENUM('named', 'anonymous');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_references_type" AS ENUM('client', 'partner', 'institution');
  CREATE TYPE "public"."enum_references_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__references_v_version_type" AS ENUM('client', 'partner', 'institution');
  CREATE TYPE "public"."enum__references_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_resources_type" AS ENUM('brochure', 'catalogue', 'report', 'note', 'institutional');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_version_type" AS ENUM('brochure', 'catalogue', 'report', 'note', 'institutional');
  CREATE TYPE "public"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_requests_status" AS ENUM('new', 'qualified', 'in_progress', 'converted', 'rejected', 'archived');
  CREATE TYPE "public"."enum_contact_requests_source" AS ENUM('website', 'admin', 'import', 'integration');
  CREATE TYPE "public"."enum_contact_requests_notification_status" AS ENUM('pending', 'failed', 'sent');
  CREATE TYPE "public"."enum_service_requests_status" AS ENUM('new', 'qualified', 'in_progress', 'converted', 'rejected', 'archived');
  CREATE TYPE "public"."enum_service_requests_source" AS ENUM('website', 'admin', 'import', 'integration');
  CREATE TYPE "public"."enum_service_requests_notification_status" AS ENUM('pending', 'failed', 'sent');
  CREATE TYPE "public"."enum_training_requests_preferred_format" AS ENUM('in_person', 'remote', 'hybrid', 'undecided');
  CREATE TYPE "public"."enum_training_requests_status" AS ENUM('new', 'qualified', 'in_progress', 'converted', 'rejected', 'archived');
  CREATE TYPE "public"."enum_training_requests_source" AS ENUM('website', 'admin', 'import', 'integration');
  CREATE TYPE "public"."enum_training_requests_notification_status" AS ENUM('pending', 'failed', 'sent');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'commercial');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_search_content_type" AS ENUM('services', 'sectors', 'trainings', 'publications', 'case-studies', 'resources');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'notifySubmission', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'notifySubmission', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_header_primary_c_t_a_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_header_primary_c_t_a_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_footer_nav_items_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_footer_navigation_columns_links_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_footer_navigation_columns_links_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_footer_legal_links_link_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_site_settings_social_networks_platform" AS ENUM('linkedin', 'facebook', 'x', 'youtube', 'instagram');
  CREATE TYPE "public"."enum_home_settings_hero_primary_c_t_a_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_home_settings_hero_primary_c_t_a_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_home_settings_hero_secondary_c_t_a_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_home_settings_hero_secondary_c_t_a_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_home_settings_final_c_t_a_cta_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_home_settings_final_c_t_a_cta_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TYPE "public"."enum_about_settings_cta_type" AS ENUM('reference', 'route', 'custom');
  CREATE TYPE "public"."enum_about_settings_cta_route" AS ENUM('/', '/a-propos', '/contact', '/recherche', '/expertises', '/secteurs', '/formations', '/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_pages_hero_links_link_route",
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_pages_blocks_cta_links_link_route",
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_pages_blocks_content_columns_link_route",
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"team_members_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum__pages_v_version_hero_links_link_route",
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum__pages_v_blocks_cta_links_link_route",
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum__pages_v_blocks_content_columns_link_route",
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"team_members_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "services_key_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar
  );
  
  CREATE TABLE "services_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"deliverable" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"short_description" varchar,
  	"hero_image_id" integer,
  	"introduction" jsonb,
  	"body" jsonb,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer
  );
  
  CREATE TABLE "_services_v_version_key_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"benefit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"deliverable" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_hero_image_id" integer,
  	"version_introduction" jsonb,
  	"version_body" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer
  );
  
  CREATE TABLE "sectors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"short_description" varchar,
  	"hero_image_id" integer,
  	"introduction" jsonb,
  	"body" jsonb,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sectors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sectors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_hero_image_id" integer,
  	"version_introduction" jsonb,
  	"version_body" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sectors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "trainings_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"objective" varchar
  );
  
  CREATE TABLE "trainings_target_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"audience" varchar
  );
  
  CREATE TABLE "trainings_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "trainings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"code" varchar,
  	"summary" varchar,
  	"hero_image_id" integer,
  	"description" jsonb,
  	"prerequisites" varchar,
  	"duration" varchar,
  	"format" "enum_trainings_format",
  	"location" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_trainings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "trainings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "_trainings_v_version_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"objective" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trainings_v_version_target_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"audience" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trainings_v_version_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trainings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_code" varchar,
  	"version_summary" varchar,
  	"version_hero_image_id" integer,
  	"version_description" jsonb,
  	"version_prerequisites" varchar,
  	"version_duration" varchar,
  	"version_format" "enum__trainings_v_version_format",
  	"version_location" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__trainings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_trainings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "publications_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"excerpt" varchar,
  	"type" "enum_publications_type",
  	"cover_image_id" integer,
  	"content" jsonb,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_publications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "publications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"team_members_id" integer,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "_publications_v_version_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_publications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_type" "enum__publications_v_version_type",
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_publications_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"team_members_id" integer,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "case_studies_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"unit" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"short_description" varchar,
  	"cover_image_id" integer,
  	"client_disclosure" "enum_case_studies_client_disclosure",
  	"client_reference_id" integer,
  	"anonymous_client_label" varchar,
  	"context" jsonb,
  	"challenge" jsonb,
  	"approach" jsonb,
  	"results" jsonb,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "_case_studies_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"unit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_cover_image_id" integer,
  	"version_client_disclosure" "enum__case_studies_v_version_client_disclosure",
  	"version_client_reference_id" integer,
  	"version_anonymous_client_label" varchar,
  	"version_context" jsonb,
  	"version_challenge" jsonb,
  	"version_approach" jsonb,
  	"version_results" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"job_title" varchar,
  	"short_bio" varchar,
  	"bio" jsonb,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"public_email" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "team_members_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_job_title" varchar,
  	"version_short_bio" varchar,
  	"version_bio" jsonb,
  	"version_photo_id" integer,
  	"version_linkedin" varchar,
  	"version_public_email" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_team_members_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "references" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"logo_id" integer,
  	"website" varchar,
  	"short_description" varchar,
  	"type" "enum_references_type",
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_references_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "references_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer
  );
  
  CREATE TABLE "_references_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_logo_id" integer,
  	"version_website" varchar,
  	"version_short_description" varchar,
  	"version_type" "enum__references_v_version_type",
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__references_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_references_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"type" "enum_resources_type",
  	"short_description" varchar,
  	"file_id" integer,
  	"cover_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_type" "enum__resources_v_version_type",
  	"version_short_description" varchar,
  	"version_file_id" integer,
  	"version_cover_image_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_resources_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer
  );
  
  CREATE TABLE "contact_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"organization" varchar,
  	"job_title" varchar,
  	"country" varchar,
  	"privacy_consent" boolean,
  	"privacy_consent_at" timestamp(3) with time zone,
  	"privacy_notice_version" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_requests_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"source" "enum_contact_requests_source" DEFAULT 'admin' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"idempotency_key" varchar,
  	"notification_status" "enum_contact_requests_notification_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"organization" varchar NOT NULL,
  	"job_title" varchar,
  	"country" varchar,
  	"privacy_consent" boolean,
  	"privacy_consent_at" timestamp(3) with time zone,
  	"privacy_notice_version" varchar,
  	"service_id" integer NOT NULL,
  	"sector_id" integer,
  	"need" varchar NOT NULL,
  	"wanted_period" varchar,
  	"budget" varchar,
  	"status" "enum_service_requests_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"source" "enum_service_requests_source" DEFAULT 'admin' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"idempotency_key" varchar,
  	"notification_status" "enum_service_requests_notification_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "training_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"organization" varchar NOT NULL,
  	"job_title" varchar,
  	"country" varchar,
  	"privacy_consent" boolean,
  	"privacy_consent_at" timestamp(3) with time zone,
  	"privacy_notice_version" varchar,
  	"training_id" integer,
  	"custom_training_need" varchar,
  	"participant_count" numeric,
  	"preferred_format" "enum_training_requests_preferred_format",
  	"wanted_period" varchar,
  	"location" varchar,
  	"message" varchar,
  	"status" "enum_training_requests_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"source" "enum_training_requests_source" DEFAULT 'admin' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"idempotency_key" varchar,
  	"notification_status" "enum_training_requests_notification_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"team_members_id" integer,
  	"resources_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"content_type" "enum_search_content_type" NOT NULL,
  	"slug" varchar,
  	"url" varchar NOT NULL,
  	"excerpt" varchar,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"team_members_id" integer,
  	"references_id" integer,
  	"resources_id" integer,
  	"contact_requests_id" integer,
  	"service_requests_id" integer,
  	"training_requests_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_header_nav_items_link_route",
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_c_t_a_type" "enum_header_primary_c_t_a_type" DEFAULT 'reference',
  	"primary_c_t_a_new_tab" boolean,
  	"primary_c_t_a_route" "enum_header_primary_c_t_a_route",
  	"primary_c_t_a_url" varchar,
  	"primary_c_t_a_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"team_members_id" integer
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_footer_nav_items_link_route",
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_navigation_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_navigation_columns_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_footer_navigation_columns_links_link_route",
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_navigation_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_legal_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_route" "enum_footer_legal_links_link_route",
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_contact_information" boolean DEFAULT true,
  	"show_social_networks" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"team_members_id" integer
  );
  
  CREATE TABLE "site_settings_social_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_networks_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar,
  	"legal_name" varchar,
  	"short_name" varchar,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"favicon_id" integer,
  	"default_social_image_id" integer,
  	"copyright_name" varchar,
  	"default_meta_title" varchar,
  	"title_suffix" varchar,
  	"default_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_information" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"general_email" varchar,
  	"primary_phone" varchar,
  	"secondary_phone" varchar,
  	"street_address" varchar,
  	"address_complement" varchar,
  	"po_box" varchar,
  	"postal_code" varchar,
  	"city" varchar,
  	"region" varchar,
  	"country" varchar,
  	"map_url" varchar,
  	"hours" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_settings_key_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" varchar NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"hero_image_id" integer,
  	"hero_primary_c_t_a_type" "enum_home_settings_hero_primary_c_t_a_type" DEFAULT 'reference',
  	"hero_primary_c_t_a_new_tab" boolean,
  	"hero_primary_c_t_a_route" "enum_home_settings_hero_primary_c_t_a_route",
  	"hero_primary_c_t_a_url" varchar,
  	"hero_primary_c_t_a_label" varchar,
  	"hero_secondary_c_t_a_type" "enum_home_settings_hero_secondary_c_t_a_type" DEFAULT 'reference',
  	"hero_secondary_c_t_a_new_tab" boolean,
  	"hero_secondary_c_t_a_route" "enum_home_settings_hero_secondary_c_t_a_route",
  	"hero_secondary_c_t_a_url" varchar,
  	"hero_secondary_c_t_a_label" varchar,
  	"introduction" varchar,
  	"final_c_t_a_title" varchar,
  	"final_c_t_a_description" varchar,
  	"final_c_t_a_cta_type" "enum_home_settings_final_c_t_a_cta_type" DEFAULT 'reference',
  	"final_c_t_a_cta_new_tab" boolean,
  	"final_c_t_a_cta_route" "enum_home_settings_final_c_t_a_cta_route",
  	"final_c_t_a_cta_url" varchar,
  	"final_c_t_a_cta_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"team_members_id" integer,
  	"references_id" integer
  );
  
  CREATE TABLE "about_settings_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "about_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_introduction" varchar,
  	"hero_hero_image_id" integer,
  	"body" jsonb,
  	"mission_title" varchar,
  	"mission_content" jsonb,
  	"vision_title" varchar,
  	"vision_content" jsonb,
  	"cta_type" "enum_about_settings_cta_type" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_route" "enum_about_settings_cta_route",
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"trainings_id" integer,
  	"publications_id" integer,
  	"case_studies_id" integer,
  	"resources_id" integer,
  	"team_members_id" integer
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_key_benefits" ADD CONSTRAINT "services_key_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables" ADD CONSTRAINT "services_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_key_benefits" ADD CONSTRAINT "_services_v_version_key_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_deliverables" ADD CONSTRAINT "_services_v_version_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sectors" ADD CONSTRAINT "sectors_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sectors" ADD CONSTRAINT "sectors_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sectors_v" ADD CONSTRAINT "_sectors_v_parent_id_sectors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sectors_v" ADD CONSTRAINT "_sectors_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sectors_v" ADD CONSTRAINT "_sectors_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trainings_objectives" ADD CONSTRAINT "trainings_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trainings_target_audience" ADD CONSTRAINT "trainings_target_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trainings_program" ADD CONSTRAINT "trainings_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trainings" ADD CONSTRAINT "trainings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trainings" ADD CONSTRAINT "trainings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trainings_rels" ADD CONSTRAINT "trainings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trainings_rels" ADD CONSTRAINT "trainings_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trainings_rels" ADD CONSTRAINT "trainings_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trainings_v_version_objectives" ADD CONSTRAINT "_trainings_v_version_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trainings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trainings_v_version_target_audience" ADD CONSTRAINT "_trainings_v_version_target_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trainings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trainings_v_version_program" ADD CONSTRAINT "_trainings_v_version_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trainings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trainings_v" ADD CONSTRAINT "_trainings_v_parent_id_trainings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trainings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trainings_v" ADD CONSTRAINT "_trainings_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trainings_v" ADD CONSTRAINT "_trainings_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trainings_v_rels" ADD CONSTRAINT "_trainings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_trainings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trainings_v_rels" ADD CONSTRAINT "_trainings_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trainings_v_rels" ADD CONSTRAINT "_trainings_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_topics" ADD CONSTRAINT "publications_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_version_topics" ADD CONSTRAINT "_publications_v_version_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_metrics" ADD CONSTRAINT "case_studies_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_client_reference_id_references_id_fk" FOREIGN KEY ("client_reference_id") REFERENCES "public"."references"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_metrics" ADD CONSTRAINT "_case_studies_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_client_reference_id_references_id_fk" FOREIGN KEY ("version_client_reference_id") REFERENCES "public"."references"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_rels" ADD CONSTRAINT "team_members_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_rels" ADD CONSTRAINT "team_members_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v_rels" ADD CONSTRAINT "_team_members_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_team_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v_rels" ADD CONSTRAINT "_team_members_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "references" ADD CONSTRAINT "references_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "references_rels" ADD CONSTRAINT "references_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."references"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "references_rels" ADD CONSTRAINT "references_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_references_v" ADD CONSTRAINT "_references_v_parent_id_references_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."references"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_references_v" ADD CONSTRAINT "_references_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_references_v_rels" ADD CONSTRAINT "_references_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_references_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_references_v_rels" ADD CONSTRAINT "_references_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_requests" ADD CONSTRAINT "training_requests_training_id_trainings_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_requests" ADD CONSTRAINT "training_requests_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_references_fk" FOREIGN KEY ("references_id") REFERENCES "public"."references"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_requests_fk" FOREIGN KEY ("contact_requests_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_requests_fk" FOREIGN KEY ("service_requests_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_requests_fk" FOREIGN KEY ("training_requests_id") REFERENCES "public"."training_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_columns_links" ADD CONSTRAINT "footer_navigation_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_columns" ADD CONSTRAINT "footer_navigation_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_networks" ADD CONSTRAINT "site_settings_social_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_social_image_id_media_id_fk" FOREIGN KEY ("default_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_settings_key_figures" ADD CONSTRAINT "home_settings_key_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings" ADD CONSTRAINT "home_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_rels" ADD CONSTRAINT "home_settings_rels_references_fk" FOREIGN KEY ("references_id") REFERENCES "public"."references"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_values" ADD CONSTRAINT "about_settings_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings" ADD CONSTRAINT "about_settings_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_settings" ADD CONSTRAINT "about_settings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_trainings_fk" FOREIGN KEY ("trainings_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_settings_rels" ADD CONSTRAINT "about_settings_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_sectors_id_idx" ON "pages_rels" USING btree ("sectors_id");
  CREATE INDEX "pages_rels_trainings_id_idx" ON "pages_rels" USING btree ("trainings_id");
  CREATE INDEX "pages_rels_publications_id_idx" ON "pages_rels" USING btree ("publications_id");
  CREATE INDEX "pages_rels_case_studies_id_idx" ON "pages_rels" USING btree ("case_studies_id");
  CREATE INDEX "pages_rels_resources_id_idx" ON "pages_rels" USING btree ("resources_id");
  CREATE INDEX "pages_rels_team_members_id_idx" ON "pages_rels" USING btree ("team_members_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_sectors_id_idx" ON "_pages_v_rels" USING btree ("sectors_id");
  CREATE INDEX "_pages_v_rels_trainings_id_idx" ON "_pages_v_rels" USING btree ("trainings_id");
  CREATE INDEX "_pages_v_rels_publications_id_idx" ON "_pages_v_rels" USING btree ("publications_id");
  CREATE INDEX "_pages_v_rels_case_studies_id_idx" ON "_pages_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_pages_v_rels_resources_id_idx" ON "_pages_v_rels" USING btree ("resources_id");
  CREATE INDEX "_pages_v_rels_team_members_id_idx" ON "_pages_v_rels" USING btree ("team_members_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "services_key_benefits_order_idx" ON "services_key_benefits" USING btree ("_order");
  CREATE INDEX "services_key_benefits_parent_id_idx" ON "services_key_benefits" USING btree ("_parent_id");
  CREATE INDEX "services_deliverables_order_idx" ON "services_deliverables" USING btree ("_order");
  CREATE INDEX "services_deliverables_parent_id_idx" ON "services_deliverables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_order_idx" ON "services" USING btree ("order");
  CREATE INDEX "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_sectors_id_idx" ON "services_rels" USING btree ("sectors_id");
  CREATE INDEX "_services_v_version_key_benefits_order_idx" ON "_services_v_version_key_benefits" USING btree ("_order");
  CREATE INDEX "_services_v_version_key_benefits_parent_id_idx" ON "_services_v_version_key_benefits" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_deliverables_order_idx" ON "_services_v_version_deliverables" USING btree ("_order");
  CREATE INDEX "_services_v_version_deliverables_parent_id_idx" ON "_services_v_version_deliverables" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_services_v_version_version_order_idx" ON "_services_v" USING btree ("version_order");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_sectors_id_idx" ON "_services_v_rels" USING btree ("sectors_id");
  CREATE UNIQUE INDEX "sectors_slug_idx" ON "sectors" USING btree ("slug");
  CREATE INDEX "sectors_hero_image_idx" ON "sectors" USING btree ("hero_image_id");
  CREATE INDEX "sectors_order_idx" ON "sectors" USING btree ("order");
  CREATE INDEX "sectors_meta_meta_image_idx" ON "sectors" USING btree ("meta_image_id");
  CREATE INDEX "sectors_updated_at_idx" ON "sectors" USING btree ("updated_at");
  CREATE INDEX "sectors_created_at_idx" ON "sectors" USING btree ("created_at");
  CREATE INDEX "sectors__status_idx" ON "sectors" USING btree ("_status");
  CREATE INDEX "_sectors_v_parent_idx" ON "_sectors_v" USING btree ("parent_id");
  CREATE INDEX "_sectors_v_version_version_slug_idx" ON "_sectors_v" USING btree ("version_slug");
  CREATE INDEX "_sectors_v_version_version_hero_image_idx" ON "_sectors_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_sectors_v_version_version_order_idx" ON "_sectors_v" USING btree ("version_order");
  CREATE INDEX "_sectors_v_version_meta_version_meta_image_idx" ON "_sectors_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_sectors_v_version_version_updated_at_idx" ON "_sectors_v" USING btree ("version_updated_at");
  CREATE INDEX "_sectors_v_version_version_created_at_idx" ON "_sectors_v" USING btree ("version_created_at");
  CREATE INDEX "_sectors_v_version_version__status_idx" ON "_sectors_v" USING btree ("version__status");
  CREATE INDEX "_sectors_v_created_at_idx" ON "_sectors_v" USING btree ("created_at");
  CREATE INDEX "_sectors_v_updated_at_idx" ON "_sectors_v" USING btree ("updated_at");
  CREATE INDEX "_sectors_v_latest_idx" ON "_sectors_v" USING btree ("latest");
  CREATE INDEX "trainings_objectives_order_idx" ON "trainings_objectives" USING btree ("_order");
  CREATE INDEX "trainings_objectives_parent_id_idx" ON "trainings_objectives" USING btree ("_parent_id");
  CREATE INDEX "trainings_target_audience_order_idx" ON "trainings_target_audience" USING btree ("_order");
  CREATE INDEX "trainings_target_audience_parent_id_idx" ON "trainings_target_audience" USING btree ("_parent_id");
  CREATE INDEX "trainings_program_order_idx" ON "trainings_program" USING btree ("_order");
  CREATE INDEX "trainings_program_parent_id_idx" ON "trainings_program" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "trainings_slug_idx" ON "trainings" USING btree ("slug");
  CREATE UNIQUE INDEX "trainings_code_idx" ON "trainings" USING btree ("code");
  CREATE INDEX "trainings_hero_image_idx" ON "trainings" USING btree ("hero_image_id");
  CREATE INDEX "trainings_order_idx" ON "trainings" USING btree ("order");
  CREATE INDEX "trainings_meta_meta_image_idx" ON "trainings" USING btree ("meta_image_id");
  CREATE INDEX "trainings_updated_at_idx" ON "trainings" USING btree ("updated_at");
  CREATE INDEX "trainings_created_at_idx" ON "trainings" USING btree ("created_at");
  CREATE INDEX "trainings__status_idx" ON "trainings" USING btree ("_status");
  CREATE INDEX "trainings_rels_order_idx" ON "trainings_rels" USING btree ("order");
  CREATE INDEX "trainings_rels_parent_idx" ON "trainings_rels" USING btree ("parent_id");
  CREATE INDEX "trainings_rels_path_idx" ON "trainings_rels" USING btree ("path");
  CREATE INDEX "trainings_rels_services_id_idx" ON "trainings_rels" USING btree ("services_id");
  CREATE INDEX "trainings_rels_sectors_id_idx" ON "trainings_rels" USING btree ("sectors_id");
  CREATE INDEX "_trainings_v_version_objectives_order_idx" ON "_trainings_v_version_objectives" USING btree ("_order");
  CREATE INDEX "_trainings_v_version_objectives_parent_id_idx" ON "_trainings_v_version_objectives" USING btree ("_parent_id");
  CREATE INDEX "_trainings_v_version_target_audience_order_idx" ON "_trainings_v_version_target_audience" USING btree ("_order");
  CREATE INDEX "_trainings_v_version_target_audience_parent_id_idx" ON "_trainings_v_version_target_audience" USING btree ("_parent_id");
  CREATE INDEX "_trainings_v_version_program_order_idx" ON "_trainings_v_version_program" USING btree ("_order");
  CREATE INDEX "_trainings_v_version_program_parent_id_idx" ON "_trainings_v_version_program" USING btree ("_parent_id");
  CREATE INDEX "_trainings_v_parent_idx" ON "_trainings_v" USING btree ("parent_id");
  CREATE INDEX "_trainings_v_version_version_slug_idx" ON "_trainings_v" USING btree ("version_slug");
  CREATE INDEX "_trainings_v_version_version_code_idx" ON "_trainings_v" USING btree ("version_code");
  CREATE INDEX "_trainings_v_version_version_hero_image_idx" ON "_trainings_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_trainings_v_version_version_order_idx" ON "_trainings_v" USING btree ("version_order");
  CREATE INDEX "_trainings_v_version_meta_version_meta_image_idx" ON "_trainings_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_trainings_v_version_version_updated_at_idx" ON "_trainings_v" USING btree ("version_updated_at");
  CREATE INDEX "_trainings_v_version_version_created_at_idx" ON "_trainings_v" USING btree ("version_created_at");
  CREATE INDEX "_trainings_v_version_version__status_idx" ON "_trainings_v" USING btree ("version__status");
  CREATE INDEX "_trainings_v_created_at_idx" ON "_trainings_v" USING btree ("created_at");
  CREATE INDEX "_trainings_v_updated_at_idx" ON "_trainings_v" USING btree ("updated_at");
  CREATE INDEX "_trainings_v_latest_idx" ON "_trainings_v" USING btree ("latest");
  CREATE INDEX "_trainings_v_rels_order_idx" ON "_trainings_v_rels" USING btree ("order");
  CREATE INDEX "_trainings_v_rels_parent_idx" ON "_trainings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_trainings_v_rels_path_idx" ON "_trainings_v_rels" USING btree ("path");
  CREATE INDEX "_trainings_v_rels_services_id_idx" ON "_trainings_v_rels" USING btree ("services_id");
  CREATE INDEX "_trainings_v_rels_sectors_id_idx" ON "_trainings_v_rels" USING btree ("sectors_id");
  CREATE INDEX "publications_topics_order_idx" ON "publications_topics" USING btree ("_order");
  CREATE INDEX "publications_topics_parent_id_idx" ON "publications_topics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "publications_slug_idx" ON "publications" USING btree ("slug");
  CREATE INDEX "publications_cover_image_idx" ON "publications" USING btree ("cover_image_id");
  CREATE INDEX "publications_order_idx" ON "publications" USING btree ("order");
  CREATE INDEX "publications_meta_meta_image_idx" ON "publications" USING btree ("meta_image_id");
  CREATE INDEX "publications_updated_at_idx" ON "publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
  CREATE INDEX "publications__status_idx" ON "publications" USING btree ("_status");
  CREATE INDEX "publications_rels_order_idx" ON "publications_rels" USING btree ("order");
  CREATE INDEX "publications_rels_parent_idx" ON "publications_rels" USING btree ("parent_id");
  CREATE INDEX "publications_rels_path_idx" ON "publications_rels" USING btree ("path");
  CREATE INDEX "publications_rels_team_members_id_idx" ON "publications_rels" USING btree ("team_members_id");
  CREATE INDEX "publications_rels_services_id_idx" ON "publications_rels" USING btree ("services_id");
  CREATE INDEX "publications_rels_sectors_id_idx" ON "publications_rels" USING btree ("sectors_id");
  CREATE INDEX "_publications_v_version_topics_order_idx" ON "_publications_v_version_topics" USING btree ("_order");
  CREATE INDEX "_publications_v_version_topics_parent_id_idx" ON "_publications_v_version_topics" USING btree ("_parent_id");
  CREATE INDEX "_publications_v_parent_idx" ON "_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "_publications_v" USING btree ("version_slug");
  CREATE INDEX "_publications_v_version_version_cover_image_idx" ON "_publications_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_publications_v_version_version_order_idx" ON "_publications_v" USING btree ("version_order");
  CREATE INDEX "_publications_v_version_meta_version_meta_image_idx" ON "_publications_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_latest_idx" ON "_publications_v" USING btree ("latest");
  CREATE INDEX "_publications_v_rels_order_idx" ON "_publications_v_rels" USING btree ("order");
  CREATE INDEX "_publications_v_rels_parent_idx" ON "_publications_v_rels" USING btree ("parent_id");
  CREATE INDEX "_publications_v_rels_path_idx" ON "_publications_v_rels" USING btree ("path");
  CREATE INDEX "_publications_v_rels_team_members_id_idx" ON "_publications_v_rels" USING btree ("team_members_id");
  CREATE INDEX "_publications_v_rels_services_id_idx" ON "_publications_v_rels" USING btree ("services_id");
  CREATE INDEX "_publications_v_rels_sectors_id_idx" ON "_publications_v_rels" USING btree ("sectors_id");
  CREATE INDEX "case_studies_metrics_order_idx" ON "case_studies_metrics" USING btree ("_order");
  CREATE INDEX "case_studies_metrics_parent_id_idx" ON "case_studies_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_cover_image_idx" ON "case_studies" USING btree ("cover_image_id");
  CREATE INDEX "case_studies_client_reference_idx" ON "case_studies" USING btree ("client_reference_id");
  CREATE INDEX "case_studies_order_idx" ON "case_studies" USING btree ("order");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies" USING btree ("meta_image_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_services_id_idx" ON "case_studies_rels" USING btree ("services_id");
  CREATE INDEX "case_studies_rels_sectors_id_idx" ON "case_studies_rels" USING btree ("sectors_id");
  CREATE INDEX "_case_studies_v_version_metrics_order_idx" ON "_case_studies_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_metrics_parent_id_idx" ON "_case_studies_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_cover_image_idx" ON "_case_studies_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_case_studies_v_version_version_client_reference_idx" ON "_case_studies_v" USING btree ("version_client_reference_id");
  CREATE INDEX "_case_studies_v_version_version_order_idx" ON "_case_studies_v" USING btree ("version_order");
  CREATE INDEX "_case_studies_v_version_meta_version_meta_image_idx" ON "_case_studies_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_services_id_idx" ON "_case_studies_v_rels" USING btree ("services_id");
  CREATE INDEX "_case_studies_v_rels_sectors_id_idx" ON "_case_studies_v_rels" USING btree ("sectors_id");
  CREATE UNIQUE INDEX "team_members_slug_idx" ON "team_members" USING btree ("slug");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_order_idx" ON "team_members" USING btree ("order");
  CREATE INDEX "team_members_meta_meta_image_idx" ON "team_members" USING btree ("meta_image_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "team_members_rels_order_idx" ON "team_members_rels" USING btree ("order");
  CREATE INDEX "team_members_rels_parent_idx" ON "team_members_rels" USING btree ("parent_id");
  CREATE INDEX "team_members_rels_path_idx" ON "team_members_rels" USING btree ("path");
  CREATE INDEX "team_members_rels_services_id_idx" ON "team_members_rels" USING btree ("services_id");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_slug_idx" ON "_team_members_v" USING btree ("version_slug");
  CREATE INDEX "_team_members_v_version_version_photo_idx" ON "_team_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_members_v_version_version_order_idx" ON "_team_members_v" USING btree ("version_order");
  CREATE INDEX "_team_members_v_version_meta_version_meta_image_idx" ON "_team_members_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE INDEX "_team_members_v_rels_order_idx" ON "_team_members_v_rels" USING btree ("order");
  CREATE INDEX "_team_members_v_rels_parent_idx" ON "_team_members_v_rels" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_rels_path_idx" ON "_team_members_v_rels" USING btree ("path");
  CREATE INDEX "_team_members_v_rels_services_id_idx" ON "_team_members_v_rels" USING btree ("services_id");
  CREATE UNIQUE INDEX "references_slug_idx" ON "references" USING btree ("slug");
  CREATE INDEX "references_logo_idx" ON "references" USING btree ("logo_id");
  CREATE INDEX "references_order_idx" ON "references" USING btree ("order");
  CREATE INDEX "references_updated_at_idx" ON "references" USING btree ("updated_at");
  CREATE INDEX "references_created_at_idx" ON "references" USING btree ("created_at");
  CREATE INDEX "references__status_idx" ON "references" USING btree ("_status");
  CREATE INDEX "references_rels_order_idx" ON "references_rels" USING btree ("order");
  CREATE INDEX "references_rels_parent_idx" ON "references_rels" USING btree ("parent_id");
  CREATE INDEX "references_rels_path_idx" ON "references_rels" USING btree ("path");
  CREATE INDEX "references_rels_sectors_id_idx" ON "references_rels" USING btree ("sectors_id");
  CREATE INDEX "_references_v_parent_idx" ON "_references_v" USING btree ("parent_id");
  CREATE INDEX "_references_v_version_version_slug_idx" ON "_references_v" USING btree ("version_slug");
  CREATE INDEX "_references_v_version_version_logo_idx" ON "_references_v" USING btree ("version_logo_id");
  CREATE INDEX "_references_v_version_version_order_idx" ON "_references_v" USING btree ("version_order");
  CREATE INDEX "_references_v_version_version_updated_at_idx" ON "_references_v" USING btree ("version_updated_at");
  CREATE INDEX "_references_v_version_version_created_at_idx" ON "_references_v" USING btree ("version_created_at");
  CREATE INDEX "_references_v_version_version__status_idx" ON "_references_v" USING btree ("version__status");
  CREATE INDEX "_references_v_created_at_idx" ON "_references_v" USING btree ("created_at");
  CREATE INDEX "_references_v_updated_at_idx" ON "_references_v" USING btree ("updated_at");
  CREATE INDEX "_references_v_latest_idx" ON "_references_v" USING btree ("latest");
  CREATE INDEX "_references_v_rels_order_idx" ON "_references_v_rels" USING btree ("order");
  CREATE INDEX "_references_v_rels_parent_idx" ON "_references_v_rels" USING btree ("parent_id");
  CREATE INDEX "_references_v_rels_path_idx" ON "_references_v_rels" USING btree ("path");
  CREATE INDEX "_references_v_rels_sectors_id_idx" ON "_references_v_rels" USING btree ("sectors_id");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE INDEX "resources_cover_image_idx" ON "resources" USING btree ("cover_image_id");
  CREATE INDEX "resources_order_idx" ON "resources" USING btree ("order");
  CREATE INDEX "resources_meta_meta_image_idx" ON "resources" USING btree ("meta_image_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "resources" USING btree ("_status");
  CREATE INDEX "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX "resources_rels_services_id_idx" ON "resources_rels" USING btree ("services_id");
  CREATE INDEX "resources_rels_sectors_id_idx" ON "resources_rels" USING btree ("sectors_id");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_file_idx" ON "_resources_v" USING btree ("version_file_id");
  CREATE INDEX "_resources_v_version_version_cover_image_idx" ON "_resources_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_resources_v_version_version_order_idx" ON "_resources_v" USING btree ("version_order");
  CREATE INDEX "_resources_v_version_meta_version_meta_image_idx" ON "_resources_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_rels_order_idx" ON "_resources_v_rels" USING btree ("order");
  CREATE INDEX "_resources_v_rels_parent_idx" ON "_resources_v_rels" USING btree ("parent_id");
  CREATE INDEX "_resources_v_rels_path_idx" ON "_resources_v_rels" USING btree ("path");
  CREATE INDEX "_resources_v_rels_services_id_idx" ON "_resources_v_rels" USING btree ("services_id");
  CREATE INDEX "_resources_v_rels_sectors_id_idx" ON "_resources_v_rels" USING btree ("sectors_id");
  CREATE INDEX "contact_requests_assigned_to_idx" ON "contact_requests" USING btree ("assigned_to_id");
  CREATE UNIQUE INDEX "contact_requests_idempotency_key_idx" ON "contact_requests" USING btree ("idempotency_key");
  CREATE INDEX "contact_requests_updated_at_idx" ON "contact_requests" USING btree ("updated_at");
  CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests" USING btree ("created_at");
  CREATE INDEX "service_requests_service_idx" ON "service_requests" USING btree ("service_id");
  CREATE INDEX "service_requests_sector_idx" ON "service_requests" USING btree ("sector_id");
  CREATE INDEX "service_requests_assigned_to_idx" ON "service_requests" USING btree ("assigned_to_id");
  CREATE UNIQUE INDEX "service_requests_idempotency_key_idx" ON "service_requests" USING btree ("idempotency_key");
  CREATE INDEX "service_requests_updated_at_idx" ON "service_requests" USING btree ("updated_at");
  CREATE INDEX "service_requests_created_at_idx" ON "service_requests" USING btree ("created_at");
  CREATE INDEX "training_requests_training_idx" ON "training_requests" USING btree ("training_id");
  CREATE INDEX "training_requests_assigned_to_idx" ON "training_requests" USING btree ("assigned_to_id");
  CREATE UNIQUE INDEX "training_requests_idempotency_key_idx" ON "training_requests" USING btree ("idempotency_key");
  CREATE INDEX "training_requests_updated_at_idx" ON "training_requests" USING btree ("updated_at");
  CREATE INDEX "training_requests_created_at_idx" ON "training_requests" USING btree ("created_at");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX "redirects_rels_sectors_id_idx" ON "redirects_rels" USING btree ("sectors_id");
  CREATE INDEX "redirects_rels_trainings_id_idx" ON "redirects_rels" USING btree ("trainings_id");
  CREATE INDEX "redirects_rels_publications_id_idx" ON "redirects_rels" USING btree ("publications_id");
  CREATE INDEX "redirects_rels_case_studies_id_idx" ON "redirects_rels" USING btree ("case_studies_id");
  CREATE INDEX "redirects_rels_team_members_id_idx" ON "redirects_rels" USING btree ("team_members_id");
  CREATE INDEX "redirects_rels_resources_id_idx" ON "redirects_rels" USING btree ("resources_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_content_type_idx" ON "search" USING btree ("content_type");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_excerpt_idx" ON "search" USING btree ("excerpt");
  CREATE INDEX "search_image_idx" ON "search" USING btree ("image_id");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_services_id_idx" ON "search_rels" USING btree ("services_id");
  CREATE INDEX "search_rels_sectors_id_idx" ON "search_rels" USING btree ("sectors_id");
  CREATE INDEX "search_rels_trainings_id_idx" ON "search_rels" USING btree ("trainings_id");
  CREATE INDEX "search_rels_publications_id_idx" ON "search_rels" USING btree ("publications_id");
  CREATE INDEX "search_rels_case_studies_id_idx" ON "search_rels" USING btree ("case_studies_id");
  CREATE INDEX "search_rels_resources_id_idx" ON "search_rels" USING btree ("resources_id");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_sectors_id_idx" ON "payload_locked_documents_rels" USING btree ("sectors_id");
  CREATE INDEX "payload_locked_documents_rels_trainings_id_idx" ON "payload_locked_documents_rels" USING btree ("trainings_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_references_id_idx" ON "payload_locked_documents_rels" USING btree ("references_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_contact_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_requests_id");
  CREATE INDEX "payload_locked_documents_rels_service_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("service_requests_id");
  CREATE INDEX "payload_locked_documents_rels_training_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("training_requests_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "header_rels_services_id_idx" ON "header_rels" USING btree ("services_id");
  CREATE INDEX "header_rels_sectors_id_idx" ON "header_rels" USING btree ("sectors_id");
  CREATE INDEX "header_rels_trainings_id_idx" ON "header_rels" USING btree ("trainings_id");
  CREATE INDEX "header_rels_publications_id_idx" ON "header_rels" USING btree ("publications_id");
  CREATE INDEX "header_rels_case_studies_id_idx" ON "header_rels" USING btree ("case_studies_id");
  CREATE INDEX "header_rels_resources_id_idx" ON "header_rels" USING btree ("resources_id");
  CREATE INDEX "header_rels_team_members_id_idx" ON "header_rels" USING btree ("team_members_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_navigation_columns_links_order_idx" ON "footer_navigation_columns_links" USING btree ("_order");
  CREATE INDEX "footer_navigation_columns_links_parent_id_idx" ON "footer_navigation_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_navigation_columns_order_idx" ON "footer_navigation_columns" USING btree ("_order");
  CREATE INDEX "footer_navigation_columns_parent_id_idx" ON "footer_navigation_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_services_id_idx" ON "footer_rels" USING btree ("services_id");
  CREATE INDEX "footer_rels_sectors_id_idx" ON "footer_rels" USING btree ("sectors_id");
  CREATE INDEX "footer_rels_trainings_id_idx" ON "footer_rels" USING btree ("trainings_id");
  CREATE INDEX "footer_rels_publications_id_idx" ON "footer_rels" USING btree ("publications_id");
  CREATE INDEX "footer_rels_case_studies_id_idx" ON "footer_rels" USING btree ("case_studies_id");
  CREATE INDEX "footer_rels_resources_id_idx" ON "footer_rels" USING btree ("resources_id");
  CREATE INDEX "footer_rels_team_members_id_idx" ON "footer_rels" USING btree ("team_members_id");
  CREATE INDEX "site_settings_social_networks_order_idx" ON "site_settings_social_networks" USING btree ("_order");
  CREATE INDEX "site_settings_social_networks_parent_id_idx" ON "site_settings_social_networks" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "site_settings" USING btree ("logo_dark_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_social_image_idx" ON "site_settings" USING btree ("default_social_image_id");
  CREATE INDEX "home_settings_key_figures_order_idx" ON "home_settings_key_figures" USING btree ("_order");
  CREATE INDEX "home_settings_key_figures_parent_id_idx" ON "home_settings_key_figures" USING btree ("_parent_id");
  CREATE INDEX "home_settings_hero_hero_image_idx" ON "home_settings" USING btree ("hero_image_id");
  CREATE INDEX "home_settings_rels_order_idx" ON "home_settings_rels" USING btree ("order");
  CREATE INDEX "home_settings_rels_parent_idx" ON "home_settings_rels" USING btree ("parent_id");
  CREATE INDEX "home_settings_rels_path_idx" ON "home_settings_rels" USING btree ("path");
  CREATE INDEX "home_settings_rels_pages_id_idx" ON "home_settings_rels" USING btree ("pages_id");
  CREATE INDEX "home_settings_rels_posts_id_idx" ON "home_settings_rels" USING btree ("posts_id");
  CREATE INDEX "home_settings_rels_services_id_idx" ON "home_settings_rels" USING btree ("services_id");
  CREATE INDEX "home_settings_rels_sectors_id_idx" ON "home_settings_rels" USING btree ("sectors_id");
  CREATE INDEX "home_settings_rels_trainings_id_idx" ON "home_settings_rels" USING btree ("trainings_id");
  CREATE INDEX "home_settings_rels_publications_id_idx" ON "home_settings_rels" USING btree ("publications_id");
  CREATE INDEX "home_settings_rels_case_studies_id_idx" ON "home_settings_rels" USING btree ("case_studies_id");
  CREATE INDEX "home_settings_rels_resources_id_idx" ON "home_settings_rels" USING btree ("resources_id");
  CREATE INDEX "home_settings_rels_team_members_id_idx" ON "home_settings_rels" USING btree ("team_members_id");
  CREATE INDEX "home_settings_rels_references_id_idx" ON "home_settings_rels" USING btree ("references_id");
  CREATE INDEX "about_settings_values_order_idx" ON "about_settings_values" USING btree ("_order");
  CREATE INDEX "about_settings_values_parent_id_idx" ON "about_settings_values" USING btree ("_parent_id");
  CREATE INDEX "about_settings_hero_hero_hero_image_idx" ON "about_settings" USING btree ("hero_hero_image_id");
  CREATE INDEX "about_settings_meta_image_idx" ON "about_settings" USING btree ("meta_image_id");
  CREATE INDEX "about_settings_rels_order_idx" ON "about_settings_rels" USING btree ("order");
  CREATE INDEX "about_settings_rels_parent_idx" ON "about_settings_rels" USING btree ("parent_id");
  CREATE INDEX "about_settings_rels_path_idx" ON "about_settings_rels" USING btree ("path");
  CREATE INDEX "about_settings_rels_pages_id_idx" ON "about_settings_rels" USING btree ("pages_id");
  CREATE INDEX "about_settings_rels_posts_id_idx" ON "about_settings_rels" USING btree ("posts_id");
  CREATE INDEX "about_settings_rels_services_id_idx" ON "about_settings_rels" USING btree ("services_id");
  CREATE INDEX "about_settings_rels_sectors_id_idx" ON "about_settings_rels" USING btree ("sectors_id");
  CREATE INDEX "about_settings_rels_trainings_id_idx" ON "about_settings_rels" USING btree ("trainings_id");
  CREATE INDEX "about_settings_rels_publications_id_idx" ON "about_settings_rels" USING btree ("publications_id");
  CREATE INDEX "about_settings_rels_case_studies_id_idx" ON "about_settings_rels" USING btree ("case_studies_id");
  CREATE INDEX "about_settings_rels_resources_id_idx" ON "about_settings_rels" USING btree ("resources_id");
  CREATE INDEX "about_settings_rels_team_members_id_idx" ON "about_settings_rels" USING btree ("team_members_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "services_key_benefits" CASCADE;
  DROP TABLE "services_deliverables" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_key_benefits" CASCADE;
  DROP TABLE "_services_v_version_deliverables" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "sectors" CASCADE;
  DROP TABLE "_sectors_v" CASCADE;
  DROP TABLE "trainings_objectives" CASCADE;
  DROP TABLE "trainings_target_audience" CASCADE;
  DROP TABLE "trainings_program" CASCADE;
  DROP TABLE "trainings" CASCADE;
  DROP TABLE "trainings_rels" CASCADE;
  DROP TABLE "_trainings_v_version_objectives" CASCADE;
  DROP TABLE "_trainings_v_version_target_audience" CASCADE;
  DROP TABLE "_trainings_v_version_program" CASCADE;
  DROP TABLE "_trainings_v" CASCADE;
  DROP TABLE "_trainings_v_rels" CASCADE;
  DROP TABLE "publications_topics" CASCADE;
  DROP TABLE "publications" CASCADE;
  DROP TABLE "publications_rels" CASCADE;
  DROP TABLE "_publications_v_version_topics" CASCADE;
  DROP TABLE "_publications_v" CASCADE;
  DROP TABLE "_publications_v_rels" CASCADE;
  DROP TABLE "case_studies_metrics" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_version_metrics" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_rels" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "_team_members_v_rels" CASCADE;
  DROP TABLE "references" CASCADE;
  DROP TABLE "references_rels" CASCADE;
  DROP TABLE "_references_v" CASCADE;
  DROP TABLE "_references_v_rels" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "_resources_v_rels" CASCADE;
  DROP TABLE "contact_requests" CASCADE;
  DROP TABLE "service_requests" CASCADE;
  DROP TABLE "training_requests" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer_navigation_columns_links" CASCADE;
  DROP TABLE "footer_navigation_columns" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "site_settings_social_networks" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "contact_information" CASCADE;
  DROP TABLE "home_settings_key_figures" CASCADE;
  DROP TABLE "home_settings" CASCADE;
  DROP TABLE "home_settings_rels" CASCADE;
  DROP TABLE "about_settings_values" CASCADE;
  DROP TABLE "about_settings" CASCADE;
  DROP TABLE "about_settings_rels" CASCADE;
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_route";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_route";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_route";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_route";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_route";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_route";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_sectors_status";
  DROP TYPE "public"."enum__sectors_v_version_status";
  DROP TYPE "public"."enum_trainings_format";
  DROP TYPE "public"."enum_trainings_status";
  DROP TYPE "public"."enum__trainings_v_version_format";
  DROP TYPE "public"."enum__trainings_v_version_status";
  DROP TYPE "public"."enum_publications_type";
  DROP TYPE "public"."enum_publications_status";
  DROP TYPE "public"."enum__publications_v_version_type";
  DROP TYPE "public"."enum__publications_v_version_status";
  DROP TYPE "public"."enum_case_studies_client_disclosure";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_client_disclosure";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_references_type";
  DROP TYPE "public"."enum_references_status";
  DROP TYPE "public"."enum__references_v_version_type";
  DROP TYPE "public"."enum__references_v_version_status";
  DROP TYPE "public"."enum_resources_type";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum__resources_v_version_type";
  DROP TYPE "public"."enum__resources_v_version_status";
  DROP TYPE "public"."enum_contact_requests_status";
  DROP TYPE "public"."enum_contact_requests_source";
  DROP TYPE "public"."enum_contact_requests_notification_status";
  DROP TYPE "public"."enum_service_requests_status";
  DROP TYPE "public"."enum_service_requests_source";
  DROP TYPE "public"."enum_service_requests_notification_status";
  DROP TYPE "public"."enum_training_requests_preferred_format";
  DROP TYPE "public"."enum_training_requests_status";
  DROP TYPE "public"."enum_training_requests_source";
  DROP TYPE "public"."enum_training_requests_notification_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_search_content_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_nav_items_link_route";
  DROP TYPE "public"."enum_header_primary_c_t_a_type";
  DROP TYPE "public"."enum_header_primary_c_t_a_route";
  DROP TYPE "public"."enum_footer_nav_items_link_type";
  DROP TYPE "public"."enum_footer_nav_items_link_route";
  DROP TYPE "public"."enum_footer_navigation_columns_links_link_type";
  DROP TYPE "public"."enum_footer_navigation_columns_links_link_route";
  DROP TYPE "public"."enum_footer_legal_links_link_type";
  DROP TYPE "public"."enum_footer_legal_links_link_route";
  DROP TYPE "public"."enum_site_settings_social_networks_platform";
  DROP TYPE "public"."enum_home_settings_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum_home_settings_hero_primary_c_t_a_route";
  DROP TYPE "public"."enum_home_settings_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum_home_settings_hero_secondary_c_t_a_route";
  DROP TYPE "public"."enum_home_settings_final_c_t_a_cta_type";
  DROP TYPE "public"."enum_home_settings_final_c_t_a_cta_route";
  DROP TYPE "public"."enum_about_settings_cta_type";
  DROP TYPE "public"."enum_about_settings_cta_route";`)
}
