-- =================================================================
-- Users Table
-- Stores user profile information.
-- The 'external_id' is used to link to an external authentication provider like Auth0 or Clerk.
-- =================================================================
create table ass_psp_users (
  u_id SERIAL primary key,
  u_ext_id VARCHAR(255) unique, -- From auth provider (e.g., Clerk, Auth0)
  u_email VARCHAR(255) unique not null,
  u_first_name VARCHAR(255),
  u_last_name VARCHAR(255),
  u_avatar_url TEXT,
  u_verified BOOLEAN not null default false,
  u_created_at TIMESTAMPTZ not null default NOW(),
  u_updated_at TIMESTAMPTZ not null default NOW(),
  u_not_deleted SMALLINT not null default 1 -- 0: deleted, 1: active
);

-- =================================================================
-- Organizations Table
-- Represents a tenant in the system. Each organization is a separate entity.
-- =================================================================
create table ass_psp_organizations (
  o_id SERIAL primary key,
  o_u_id SERIAL not null references ass_psp_users (u_id) o_name VARCHAR(255) not null,
  o_created_at TIMESTAMPTZ not null default NOW(),
  o_updated_at TIMESTAMPTZ not null default NOW(),
  o_not_deleted SMALLINT not null default 1 -- 0: deleted, 1: active
);

-- =================================================================
-- Organization Membership and Roles
-- Defines user roles within the context of a specific organization.
-- =================================================================
create table ass_psp_members (
  m_id SERIAL primary key,
  m_o_id SERIAL not null references ass_psp_organizations (o_id),
  m_u_id SERIAL not null references ass_psp_users (u_id),
  m_role SMALLINT not null default 1, -- 1: member, 2: admin, 3: super_admin
  m_created_at TIMESTAMPTZ not null default NOW(),
  m_not_deleted SMALLINT not null default 1 -- 0: deleted, 1: active
);

-- =================================================================
-- Services Table
-- Each service belongs to an organization
-- =================================================================
create table ass_psp_services (
  s_id SERIAL primary key,
  s_o_id SERIAL not null references ass_psp_organizations (o_id),
  s_name VARCHAR(255) not null,
  s_service_status_id SERIAL not null references ass_psp_service_status (ss_id),
  s_created_at TIMESTAMPTZ not null default NOW(),
  s_updated_at TIMESTAMPTZ not null default NOW(),
  s_not_deleted SMALLINT not null default 1
);

-- =================================================================
-- Services Status Table
-- Each service status belongs to an organization
-- =================================================================
create table ass_psp_service_status (
  ss_id SERIAL primary key,
  ss_o_id SERIAL not null references ass_psp_organizations (o_id),
  ss_name VARCHAR(255) not null,
  ss_created_at TIMESTAMPTZ not null default NOW(),
  ss_updated_at TIMESTAMPTZ not null default NOW(),
  ss_not_deleted SMALLINT not null default 1 -- 0: inactive/archived, 1: active
);

create table ass_psp_incidents (
  i_id SERIAL primary key,
  i_service_id INT not null,
  i_title VARCHAR(255) not null,
  i_description TEXT,
  i_status SMALLINT not null default 1, -- 1: open, 2: Resolved
  i_created_at TIMESTAMP default CURRENT_TIMESTAMP,
  i_resolved_at TIMESTAMP DEFAULT NULL,
  i_not_deleted SMALLINT not null default 1,
  foreign KEY (i_service_id) references ass_psp_services (s_id) on delete CASCADE
);

create TABLE ass_psp_incident_updates (
  iu_id SERIAL primary key,
  iu_type SMALLINT, -- 1: incident update (Old_Text -> New_Text), 2: scheduled maintenance ( Start/End)
  iu_update TEXT,
  iu_i_id SERIAL REFERENCES ass_psp_incidents (i_id),
  iu_created_at TIMESTAMP default CURRENT_TIMESTAMP,
  iu_not_deleted SMALLINT default 1
);

CREATE TABLE ass_psp_service_status_updates (
  ssu_id SERIAL primary key,
  ssu_ss_id SERIAL REFERENCES ass_psp_service_status (ss_id),
  ssu_update TEXT, -- old_status_text -> new_status_text
  ssu_created_at TIMESTAMP default CURRENT_TIMESTAMP,
  ssu_not_deleted SMALLINT default 1
);
