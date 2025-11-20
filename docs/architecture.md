# Beboere App Architecture

## Roles
- **ADMIN**: full access to manage units, phases, messages, documents, photos, comments, exports, and audit logs.
- **BEBOER**: tenant-level access. Can view their own unit(s), read messages/documents/photos targeted to them or their unit, mark items as read, toggle language and senior mode, and manage their own password. Cannot see internal comments or audit data.
- **VIEWER**: read-only oversight role. Can view all units, phases, messages, documents, photos, and internal comments. Can trigger exports. Cannot create or modify tenant-facing content.

## Data Model (MVP scope)
- **User**: email, passwordHash, role, language (da/en), seniorMode flag, timestamps.
- **Profile**: name, phone for a user.
- **Unit**: name, address, unique houseCode for tenant onboarding.
- **Phase**: construction/renovation phase with status and optional dates.
- **UnitPhase**: join table connecting units to phases.
- **TenantUnit**: connects BEBOER to unit(s) with activity window.
- **Message**: created by ADMIN, optionally linked to a phase. Targets are defined per unit or role. Reads tracked per user.
- **MessageTarget**: links messages to specific units and/or roles.
- **MessageRead**: records when a user has read a message.
- **Document**: belongs to a unit, has versions and soft-delete status.
- **DocumentVersion**: immutable storage reference for a document version.
- **Photo**: belongs to a unit, can be pinned; references a storage key.
- **Comment**: internal note on message/document/photo (only ADMIN/VIEWER).
- **AuditLog**: records actions for ADMIN visibility.
- **ExportJob**: tracks exports initiated by ADMIN/VIEWER.
- **PasswordResetToken**: single-use password reset for users.

## Flows
- **Authentication**: email + password. Language and seniorMode stored on user. Sessions must carry role for RBAC.
- **Tenant onboarding**: BEBOER registers using email, password, name, and houseCode. System links to matching unit via houseCode and creates TenantUnit.
- **Messaging**: ADMIN creates messages, selecting unit targets and/or roles. Users only see messages targeted to their unit or role; BEBOER only for their own units.
- **Documents**: ADMIN uploads PDFs per unit; versions tracked. Soft delete/restore supported. Download served via stored fileKey.
- **Photos**: ADMIN uploads photos per unit; can pin/unpin. Stored via fileKey reference.
- **Comments**: ADMIN/VIEWER can add internal comments on messages/documents/photos.
- **Audit**: ADMIN can export audit logs as JSON; all create/update actions should write a simple audit entry.
- **Exports**: VIEWER can request exports; records stored in ExportJob with fileKey placeholder.
- **Settings**: Users can change password, language, and senior mode. BEBOER UI favors large touch targets.

## Permissions
- **ADMIN**: create/read/update for all entities; view audit logs; manage documents/photos/messages; manage phases/units.
- **VIEWER**: read-only access to all units/phases/messages/documents/photos; can add internal comments and trigger exports. No create/update for tenant-facing data.
- **BEBOER**: access limited to units linked via TenantUnit; can read messages/documents/photos targeted to their units or role; can mark reads; can manage own profile/settings. No access to comments or audit logs.
